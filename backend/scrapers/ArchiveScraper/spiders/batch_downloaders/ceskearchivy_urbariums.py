"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading urbariums from CeskeArchivy.

@Modified by Pavel Sestak (xsesta07)
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider
from scrapy import Request
from ArchiveScraper.spiders.batch_downloaders.ceskearchivy_registers import parse_and_set_locations
import re

class CeskeArchivyUrbariumsScraper(Spider):
    name = constants.sn_ceskearchivy_urbariums
    archive = constants.a_ceskearchivy
    start_urls = [f"https://digi.ceskearchivy.cz/pages/klicova/ajaxmaterial1.php?ver=23.03.08&edit=0&role=&uzivid=2&subtyp=&doctree=18u&id=582876&start={nr}&typ=26&typ2=-1"
                  for nr in range(0, 500 + 1, 50)]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_ceskearchivy)

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url)

    async def parse(self, response, **kwargs):
        """Parse the Urbariums endpoint."""
        urbariums_onclick = response.xpath("//tr/@onclick").getall()
        urbariums_ids = [re.search("(?<=id=).*(?='\))", id_str).group() for id_str in urbariums_onclick]
        urbariums_links = [f"https://digi.ceskearchivy.cz/description.php?menu=4&id={urb_id}&lmenu=3"
                           for urb_id in urbariums_ids]

        for link in urbariums_links:
            yield Request(url=link, callback=self.parse_item)

    async def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_urbarium

        # Write archive name
        archive_item['archive'] = constants.a_ceskearchivy

        # Write nad
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'nad',
                                          "//td[contains(text(), 'Číslo NAD')]/following-sibling::td/span/text()")

        # Write inventory number
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber',
                                          "//td[contains(text(), 'Inventární číslo')]/following-sibling::td/span/text()")

        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'signature',
                                          "//td[contains(text(), 'Signatura')]/following-sibling::td/span/text()")

        # Write name
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'name', "//td[contains(text(), 'Název')]/following-sibling::td/text()")

        # Write original name
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'originalName',
                                          "//td[contains(text(), 'Originální název')]/following-sibling::td/text()")

        # Write years
        years = response.xpath("//td[text()='Datace']/following-sibling::td/text()").get()
        if years:
            archive_item['yearFrom'], archive_item['yearTo'] = auxiliary.parse_years(years)

        # Write languages
        languages = response.xpath("string(//td[text()='Jazyk']/following-sibling::td)").get()
        if languages:
            archive_item['languages'] = auxiliary.get_languages_array(languages)

        # Write locations
        parse_and_set_locations(response, archive_item)

        # Write note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'otherNote',
                                          "//td[contains(text(), 'Poznámka')]/following-sibling::td/text()")

        # Write number of scans
        nr_of_scans = response.xpath("//td[text()='Počet snímků']/following-sibling::td/text()").get()
        if nr_of_scans:
            archive_item['numberOfScans'] = int(nr_of_scans)
        else:
            archive_item['numberOfScans'] = 0

        # Write url
        archive_item['link'] = response.xpath("//td[text()='HTML odkaz']/following-sibling::td/text()").get()

        return archive_item
