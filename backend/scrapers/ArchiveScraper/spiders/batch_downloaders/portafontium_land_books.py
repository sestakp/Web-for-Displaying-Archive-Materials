"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading land books from Porta fontium.

@Modified by Pavel Sestak (xsesta07)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import CrawlSpider, Rule
from ArchiveScraper.spiders.batch_downloaders import portafontium_registers
from scrapy.linkextractors import LinkExtractor



class PortaFontiumLandBooksScraper(CrawlSpider):
    name = constants.sn_portafontium_land_books
    archive = constants.a_portafontium
    start_urls = ["https://www.portafontium.eu/searching/amtsbuch?field_archives=All&field_book_type%5B%5D=grundbuch"]
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
        archive_item['typeOfRecord'] = constants.t_land_book

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
        
        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'signature',
                                          "//div[contains(text(), 'Signatura – ev./ukl. j. č.:')]/following-sibling::div/child::div/text()")

        # Write inventory nr
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber',
                                          "//div[contains(text(), 'Inv. č.:')]/following-sibling::div/child::div/text()")

        # Write years
        years_str = response.xpath("//div[contains(text(),  'Datace:')]/following-sibling::div/child::div/text()").get()
        if years_str:
            archive_item['yearFrom'], archive_item['yearTo'] = auxiliary.parse_years(years_str)

        # Write name
        name = response.xpath("(//div[@class='breadcrumb']/text())[last()]").get()
        if name:
            name = auxiliary.strip_or_return_none(name.replace('›', ''))
            archive_item['name'] = name

        # Write original name
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'originalName',
                                          "//div[contains(text(), 'Původní nadpis:')]/following-sibling::div/div/text()")

        # Write languages
        langs = response.xpath(
            "//div[contains(text(), 'Jazyk:')]/following-sibling::div/child::div[contains(@class, 'field-item even')]/text()").get()
        if langs:
            archive_item['languages'] = auxiliary.get_languages_array(langs.strip())

        # Write content
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'content', "//div[contains(text(), 'Obsah / Regest:')]/following-sibling::div/descendant::p/text()")

        # Write other note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'content', "//div[contains(text(), 'Poznámka:')]/following-sibling::div/descendant::div/text()")

        # Write covered area
        portafontium_registers.parse_and_set_locations(response, archive_item)

        nr_of_scans = \
            response.xpath("(//div[contains(@class, 'iip-thumbnail-number')]/child::p/text())[last()]").get()
        if nr_of_scans:
            archive_item['numberOfScans'] = int(nr_of_scans[:-1])
        else:
            archive_item['numberOfScans'] = 0

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
