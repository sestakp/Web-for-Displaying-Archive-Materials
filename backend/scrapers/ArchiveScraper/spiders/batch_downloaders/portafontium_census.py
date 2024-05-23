"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading census from Porta fontium.

@Modified by Pavel Sestak (xsesta07)

Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor


def parse_and_set_landRegistryNrs(archive_item, response):
    first_nr = response.xpath("//*[contains(text(), 'Nr.') and not(contains(text(), '--'))]/text()").get()
    last_nr = response.xpath("(//*[contains(text(), 'Nr.') and not(contains(text(), '--'))])[last()]/text()").get()

    if not first_nr:
        return

    first_nr = first_nr.split(". ")[1]
    last_nr = last_nr.split(". ")[1]

    final_str = first_nr
    if first_nr != last_nr:
        final_str += "-" + last_nr

    archive_item['landRegistryNrs'] = final_str


def parse_and_set_locations(response, archive_item):
    area_strings = response.xpath("//div[@class='view-content']/div[@class='doc-place-item-list']/ul/li/span/span/text()").getall()

    print("text: ", area_strings)
    if len(area_strings) == 0:
        return

    area_strings = [unit.strip() for unit in area_strings]

    # area_strings could be in form:
    #   [0] = Domažlice
    #   [1] = lesní personál (Taus, Tausen)
    # or:
    #   [0] = Rokycany - Plzeňské předměstí (Rokitzan - Pilsner Vorstadt, Pilsner Vorstadt)

    # I normalize it all to have the second form
    if len(area_strings) == 2:
        area_strings[0] = area_strings[0] + " - " + area_strings[1]

    normalized_string = area_strings[0]
    if auxiliary.strip_or_return_none(normalized_string) is None:
        return

    # Alternatives are in the brackets
    normalized_string_split = normalized_string.split("(")
    units = normalized_string_split[0]
    alternatives = None
    if len(normalized_string_split) == 2:
        alternatives = normalized_string_split[1].replace(")", "")

    # In units, it's either just municipality, or municipality
    # and borough separated by " - "
    units_split = units.split(" - ")
    municipality = units_split[0]
    borough = None
    if len(units_split) == 2:
        borough = units_split[1]

    if alternatives:
        alternatives = [alt.strip() for alt in alternatives.split(",")]

    locations_dict = auxiliary.get_locations_dict(municipality=municipality, borough=borough,
                                                        alternative_names=alternatives)

    print("location: ", locations_dict)
    archive_item['locations'] = [locations_dict]


class PortaFontiumCensusScraper(CrawlSpider):
    name = constants.sn_portafontium_census
    archive = constants.a_portafontium
    start_urls = ["https://www.portafontium.eu/searching/census?mode=0&field_archives=All&search_api_views_fulltext="]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_portafontium)

    rules = (
        # Crawl all pages
        Rule(LinkExtractor(restrict_xpaths="//li[contains(@class, 'pager-next')]/a")),

        # Parse the items
        Rule(LinkExtractor(restrict_xpaths="//td[contains(@class, 'views-field views-field-title-field')]/a"),
             callback="parse_item"),
    )

    def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_census

        # Write archive name
        archive_item['archive'] = constants.a_portafontium

        # Write fund
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'fundName', "//div[contains(text(), 'Značka fondu:')]/following-sibling::div/child::div/text()")

        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'fundCode',
            "//div[contains(text(), 'Číslo fondu:')]/following::div[contains(@class, 'field-item even')]/text()"
        )

        # Write year
        yearTaken = response.xpath("//div[contains(@class, 'field-name-field-doc-dates')]/descendant::div[@class='field-item even']/text()").get()
        if yearTaken:
            archive_item['yearTaken'] = int(yearTaken)

        # Write judicial district
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'judicialDistrict', "//div[contains(text(), 'Soudní okres: ')]/a/text()")

        # Write land registry nrs
        parse_and_set_landRegistryNrs(archive_item, response)

        # Write covered area
        parse_and_set_locations(response, archive_item)

        # Write link
        archive_item['link'] = auxiliary.get_url_without_params(response.url)

        #parse images
        scans = []
        jp2_images = response.xpath('//img[contains(@src, ".jp2")]/@src').getall()
        for jp2_image in jp2_images:
            # Remove everything behind .jp2 and add .dzi
            scanUrl = jp2_image.split('.jp2')[0] + '.jp2.dzi'
            scanUrl = scanUrl.replace(".fcgi?FIF=", ".fcgi?Deepzoom=")
            scans.append({ 'url': "https://www.portafontium.eu"+scanUrl, 'preFetchUrl': ""})

        archive_item['scans'] = scans

        return archive_item
