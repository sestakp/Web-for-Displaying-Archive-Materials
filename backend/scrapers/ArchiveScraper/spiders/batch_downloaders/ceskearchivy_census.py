"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading census from CeskeArchivy.

@Modified by Pavel Sestak (xsesta07)
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider
from scrapy import Request
import re


def parse_and_set_locations(archive_item, response):
    area_string = response.xpath("string(//td[text()='Lokalita']/following-sibling::td/a)").get()

    units = area_string
    alternatives = None
    if len(area_string.split('/')) > 1:
        units = area_string.split('/')[0]
        alternatives = area_string.split('/')[1]

    units = [unit.strip() for unit in units.replace('(', ',').replace(')', '').split(',')]
    country = units[-1]
    district = units[-2]
    municipality = None
    borough = None

    if len(units) > 2:
        municipality = units[-3]

    if len(units) > 3:
        borough = units[0]

    if alternatives:
        alternatives = [alt.strip() for alt in alternatives.replace('/', '').split(',')]

    archive_item['locations'] = [auxiliary.get_locations_dict(country=country, district=district,
                                                                    municipality=municipality, borough=borough,
                                                                    alternative_names=alternatives)]


class CeskeArchivyCensusScraper(Spider):
    name = constants.sn_ceskearchivy_census
    archive = constants.a_ceskearchivy
    start_urls = [f"https://digi.ceskearchivy.cz/pages/klicova/ajaxmaterial1.php?ver=23.02.28&edit=0&role=&uzivid=2&subtyp=&doctree=18s&id=582890&start={nr}&typ=22&typ2=-1"
                  for nr in range(0, 11650 + 1, 50)]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_ceskearchivy)

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url)

    async def parse(self, response, **kwargs):
        """Parse the Scitani lidu endpoint."""
        census_onclick = response.xpath("//tr/@onclick").getall()
        census_ids = [re.search("(?<=id=).*(?='\))", id_str).group() for id_str in census_onclick]
        census_links = [f"https://digi.ceskearchivy.cz/description.php?menu=4&id={cen_id}&lmenu=3" for cen_id in census_ids]

        for link in census_links:
            yield Request(url=link, callback=self.parse_item)

    async def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_census

        # Write archive name
        archive_item['archive'] = constants.a_ceskearchivy

        # Write nad
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'nad', "//td[contains(text(), 'Číslo NAD')]/following-sibling::td/span/text()")

        # Write inventory number
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber',
                                          "//td[contains(text(), 'Inventární číslo')]/following-sibling::td/span/text()")

        # Write judicial district
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'judicialDistrict',
                                          "//table[@class='tab_popis']/descendant::td[contains(text(), 'Soudní okres')]/following-sibling::td//text()")

        # Write note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'otherNote',
                                          "//td[contains(text(), 'Poznámka')]/following-sibling::td/text()")

        # Write covered area
        parse_and_set_locations(archive_item, response)

        # Write content
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'content',
                                          "//table[@class='tab_popis']/descendant::td[contains(text(), 'Obsah')]/following-sibling::td//text()")

        # Write number of scans
        nr_of_scans = response.xpath("//td[text()='Počet snímků']/following-sibling::td/text()").get()
        if nr_of_scans:
            archive_item['numberOfScans'] = int(nr_of_scans)
        else:
            archive_item['numberOfScans'] = 0

        # Write url
        archive_item['link'] = response.xpath("//td[text()='HTML odkaz']/following-sibling::td/text()").get()

        return archive_item
