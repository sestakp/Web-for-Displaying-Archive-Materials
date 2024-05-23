"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading census from MZA.

@Modified by Pavel Sestak (xsesta07)

Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy import Spider, Request
import re
import time

def parse_and_set_landRegistryNrs(archive_item, response):
    nrs_breakdown = response.xpath("//div[text()='Rozpis čísel popisných']/following-sibling::div/text()").get()

    archive_item['landRegistryNrs'] = auxiliary.strip_or_return_none(nrs_breakdown)
    if archive_item['landRegistryNrs']:
        return

    auxiliary.add_to_item_if_not_none(response, archive_item,
                                      'landRegistryNrs',
                                      "//div[text()='Číslo popisné (od-do)']/following-sibling::div/text()")


def parse_and_set_locations(archive_item, response):
    municipality_czech = auxiliary.strip_or_return_none(
        response.xpath("//div[text()='Město/obec (česky)']/following-sibling::div/text()").get())

    municipality_german = auxiliary.strip_or_return_none(
        response.xpath("//div[text()='Město/obec (německy)']/following-sibling::div/text()").get())

    borough_czech = auxiliary.strip_or_return_none(
        response.xpath("//div[text()='Část obce/osada (česky)']/following-sibling::div/text()").get())

    borough_german = auxiliary.strip_or_return_none(
        response.xpath("//div[text()='Část obce/osada (německy)']/following-sibling::div/text()").get())

    if borough_czech:
        locations_dict = auxiliary.get_locations_dict(municipality=municipality_czech,
                                                            borough=borough_czech,
                                                            german_name=borough_german)
    else:
        locations_dict = auxiliary.get_locations_dict(municipality=municipality_czech,
                                                            german_name=municipality_german)

    archive_item['locations'] = [locations_dict]


class MzaCensusScraper(Spider):
    name = constants.sn_mza_census
    archive = constants.a_mza
    handle_httpstatus_list = [403]

    start_urls = ["https://www.mza.cz/scitacioperaty/digisada/search/1"]

    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_mza)
    

    def start_requests(self):
        for url in self.start_urls:
            
            yield Request(url=url,
                          callback=self.parse_page,
                          dont_filter=True)

    def parse_page(self, response):
        dont_continue = False
        if response.status == 403:
            
            yield Request(url=response.url,
                          callback=self.parse_page,
                          dont_filter=True)
            dont_continue = True

        if not dont_continue:
            # Crawl all items on the page
            items_urls = response.xpath("//a[contains(text(), 'Zobrazit')]/@href").getall()
            for url in items_urls:
                
                yield Request(url=url,
                              callback=self.pre_parse_item,
                              dont_filter=True)

            # Crawl next page
            next_page_url = response.xpath("(//li[contains(@class, 'page-item')])[last()]/a/@href").get()

            if next_page_url:
                
                yield Request(url=next_page_url,
                              callback=self.parse_page,
                              dont_filter=True)

    def pre_parse_item(self, response):
        if response.status == 403:
        
            yield Request(url=response.url,
                          callback=self.pre_parse_item,
                          dont_filter=True)
        else:
            yield self.parse_item(response)

    def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_census

        # Write archive name
        archive_item['archive'] = constants.a_mza

        # Write fund
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'fundName', "//div[text()='Název fondu']/following-sibling::div/text()")

        # Write nad
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'nad', "//div[text()='Číslo NAD']/following-sibling::div/text()")

        # Write inventory number
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber',
                                          "//div[text()='Inventární číslo']/following-sibling::div/text()")
        if archive_item['inventoryNumber'] == 'N':
            archive_item['inventoryNumber'] = None

        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'signature', "//div[text()='Signatura']/following-sibling::div/text()")

        # Write year taken
        yearTaken = response.xpath("//div[text()='Rok sčítání']/following-sibling::div/text()").get()
        if auxiliary.strip_or_return_none(yearTaken):
            y_as_ints = auxiliary.parse_years(yearTaken)
            archive_item['yearTaken'] = y_as_ints[0]
            if y_as_ints[1] != y_as_ints[0]:
                archive_item['yearFrom'] = y_as_ints[0]
                archive_item['yearTo'] = y_as_ints[1]

        # Write judicial district
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'judicialDistrict',
                                          "//div[text()='Soudní okres']/following-sibling::div/text()")

        # Write land registry nrs
        parse_and_set_landRegistryNrs(archive_item, response)

        # Write covered area
        parse_and_set_locations(archive_item, response)

        # Write number of scans
        nr_of_scans = response.xpath("//div[text()='Počet listů/fol.']/following-sibling::div/text()").get()
        if auxiliary.strip_or_return_none(nr_of_scans):
            archive_item['numberOfScans'] = int(auxiliary.strip_or_return_none(nr_of_scans))
        else:
            archive_item['numberOfScans'] = 0

        # Write other note
        notes_arr = response.xpath("//div[contains(text(), 'Poznámka ')]/following-sibling::div/text()").getall()
        archive_item['otherNote'] = \
            ", ".join(filter(None, [auxiliary.strip_or_return_none(note) for note in notes_arr]))
        if archive_item['otherNote'] == '':
            archive_item['otherNote'] = None


        #get scans
        script_content = response.xpath("//script[contains(text(), 'CreateSeadragon')]/text()").get()

        if script_content:
            array_match = re.search(r'\[([^\]]+)\]', script_content)
            if array_match:
                array_string = array_match.group(1)
                array_of_strings = [ { 'url': url.strip().strip('"').replace("\\", ""), 'preFetchUrl': ""} for url in array_string.split(',')]
                archive_item['scans'] = array_of_strings


        # Write link
        archive_item['link'] = auxiliary.get_url_without_params(response.url)
        return archive_item
