"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from CeskeArchivy.

@Modified by Pavel Sestak (xsesta07)
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider
from scrapy import Request
import re


def set_index_years_of_type(archive_item, year_from, year_to, reg_type):
    match reg_type:
        case 'N':
            archive_item['yearBornIndexFrom'] = year_from
            archive_item['yearBornIndexTo'] = year_to

        case 'O':
            archive_item['yearMarriedIndexFrom'] = year_from
            archive_item['yearMarriedIndexTo'] = year_to

        case 'Z':
            archive_item['yearDeceasedIndexFrom'] = year_from
            archive_item['yearDeceasedIndexTo'] = year_to


def set_reg_years_of_type(archive_item, year_from, year_to, reg_type):
    match reg_type:
        case 'N':
            archive_item['yearBornFrom'] = year_from
            archive_item['yearBornTo'] = year_to

        case 'O':
            archive_item['yearMarriedFrom'] = year_from
            archive_item['yearMarriedTo'] = year_to

        case 'Z':
            archive_item['yearDeceasedFrom'] = year_from
            archive_item['yearDeceasedTo'] = year_to


def parse_and_set_years(content_as_selector, archive_item):
    reg_or_index = 'r'

    if content_as_selector.xpath("//td[text()='Matrika/index']/following-sibling::td/text()").get() == "index":
        reg_or_index = 'i'

    if "s indexem" in str(content_as_selector.xpath("//td[text()='Poznámka']/following-sibling::td/text()").get() or ''):
        reg_or_index = 'b'

    date_strings = content_as_selector.xpath("//td[text()='Datace']/following-sibling::td/div/text()").getall()

    for date in date_strings:
        date_split = date.split(' ')
        reg_type = date_split[0]
        year_from, year_to = auxiliary.parse_years(date_split[1])

        match reg_or_index:
            case 'r':
                set_reg_years_of_type(archive_item, year_from, year_to, reg_type)

            case 'i':
                set_index_years_of_type(archive_item, year_from, year_to, reg_type)

            case 'b':
                set_reg_years_of_type(archive_item, year_from, year_to, reg_type)
                set_reg_years_of_type(archive_item, year_from, year_to, reg_type)


def parse_and_set_locations(content_as_selector, archive_item):
    locations_string = content_as_selector.xpath("string(//td[text()='Kniha vedena pro']/following-sibling::td)").get()
    if not locations_string:
        locations_string = content_as_selector.xpath("string(//td[text()='Lokality']/following-sibling::td)").get()  # So I can use it for urbariums, too

    split_string = re.split(r',(?=(?:[^/\n]*/[^/\n]*/)*[^/\n]*$)', locations_string)

    district = content_as_selector.xpath("//table[@class='tab_popis']/descendant::td[text()='Okres']/following-sibling::td/text()").get()

    locations_list = []
    for item in split_string:
        item = item.replace('/', ',', 1).replace('/', '').split(',')
        municipality = item[0].strip()
        alternative_names = [alt.strip() for alt in item[1:]] if len(item[1:]) > 0 else None
        locations_dict = auxiliary.get_locations_dict(district=district, municipality=municipality,
                                                            alternative_names=alternative_names)
        locations_list.append(locations_dict)

    archive_item['locations'] = locations_list


def parse_and_set_originator(content_as_selector, archive_item):
    church = content_as_selector.xpath("//td[text()='Církev']/following-sibling::td/text()").get()

    if church:
        archive_item['originatorType'] = church
    else:
        archive_item['originatorType'] = "civilní"

    archive_item['originatorName'] = content_as_selector.xpath("//td[contains(text(), 'Sídlo')]/following-sibling::td/text()").get()


class CeskeArchivyRegistersScraper(Spider):
    name = constants.sn_ceskearchivy_registers
    archive = constants.a_ceskearchivy
    start_urls = [f"https://digi.ceskearchivy.cz/pages/fondy/ajaxmaterial1.php?ver=23.02.28&subtyp=&doctree=1Xa&id=21200001000024&start={nr}&typ=2&typ2=-1"
                  for nr in range(0, 7500 + 1, 50)]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_ceskearchivy)

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url)

    async def parse(self, response, **kwargs):
        """Parse the Matriky endpoint."""
        reg_onlick = response.xpath("//tr/@onclick").getall()
        reg_ids = [re.search("(?<=id=).*(?='\))", id_str).group() for id_str in reg_onlick]
        reg_links = [f"https://digi.ceskearchivy.cz/description.php?menu=4&id={reg_id}&lmenu=3" for reg_id in reg_ids]

        for link in reg_links:
            yield Request(url=link, callback=self.parse_item)

    async def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_ceskearchivy

        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'signature', "//td[text()='ID']/following-sibling::td/text()")

        # Write NAD
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'nad', "//td[text()='Číslo NAD']/following-sibling::td/span/text()")

        # Write years
        parse_and_set_years(response, archive_item)

        # Write originator name and type
        parse_and_set_originator(response, archive_item)

        # Write languages
        languages = response.xpath("string(//td[text()='Jazyk']/following-sibling::td)").get()
        if languages:
            archive_item['languages'] = auxiliary.get_languages_array(languages)

        # Write note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'otherNote',
                                          "//td[contains(text(), 'Poznámka')]/following-sibling::td/text()")

        # Write covered area
        parse_and_set_locations(response, archive_item)

        # Write number of scans
        nr_of_scans = response.xpath("//td[text()='Počet snímků']/following-sibling::td/text()").get()
        if nr_of_scans:
            archive_item['numberOfScans'] = int(nr_of_scans)
        else:
            archive_item['numberOfScans'] = 0

        # Write url
        archive_item['link'] = response.xpath("//td[text()='HTML odkaz']/following-sibling::td/text()").get()

        return archive_item
