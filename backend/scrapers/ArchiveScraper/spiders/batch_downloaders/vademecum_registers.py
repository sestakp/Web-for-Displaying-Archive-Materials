"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from VadeMeCum.

@Modified by Oto Malik (xmalik22)
@Modified by Pavel Sestak (xsesta07)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

import re
from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider, Request
from ArchiveScraper.spiders.batch_downloaders.archives_registers_olomouc import parse_and_set_years, parse_and_set_area  # Same as in archives
import asyncio


class VadeMeCumRegistersScraper(Spider):
    name = constants.sn_vademecum_registers
    archive = constants.a_vademecum
    first_url = "http://vademecum.soalitomerice.cz"  # To avoid getting 503 unavailable error
    start_url = "http://vademecum.soalitomerice.cz/vademecum/searchlink?myQuery=58dfaa151fd0522ef99aef1d9ac272f5&modeView=LIST"
    goNext = False
    auxiliary.get_custom_settings_dict_with_request_headers(constants.a_vademecum)

    def start_requests(self):
        yield Request(url=self.first_url)

    def parse(self, response, **kwargs):
        yield Request(url=self.start_url, callback=self.parse_search_page)

    def parse_search_page(self, response):
        first_item_href = response.xpath("(//div[contains(@class, 'content') and contains(@class, 'list')]/a/@href)[1]").get()

        yield Request(url=f"http://vademecum.soalitomerice.cz{first_item_href}",
                      callback=self.parse_item_and_go_to_next)

    async def parse_item_and_go_to_next(self, response):
        yield self.parse_item(response)

        while not self.goNext:
            await asyncio.sleep(1)

        self.goNext = False

        next_page_href = response.xpath("//i[contains(@class, 'icon-forward3')]/parent::a/@href").get()
        if next_page_href:
            yield Request(url=f"http://vademecum.soalitomerice.cz{next_page_href}",
                          callback=self.parse_item_and_go_to_next)

    def parse_scans_page(self, response):
        img_elements = response.xpath('//ul[@class="pictures"]//li/descendant::img')
        scans_url = []
        for img in img_elements:
            src = img.attrib['src']
            modified_url = src.replace("/image/", "/proxy/").replace("/nahled_maly.jpg", '')
            scans_url.append({ 'url': modified_url, 'preFetchUrl': ""})

        archive_item = response.meta['archive_item']
        if 'scans' not in archive_item:
            archive_item['scans'] = []
        archive_item['scans'].extend(scans_url)

        next_page_link = response.xpath("//i[@class='icon-forward3 icon link']/parent::a/@href").get()
        if next_page_link:
            next_page_scan_url = "http://vademecum.soalitomerice.cz" + next_page_link
            return Request(url=next_page_scan_url,
                           callback=self.parse_scans_page,
                           meta={'archive_item': archive_item})
        else:
            self.goNext = True
            return archive_item

    def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_vademecum

        # Write originator name
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorName', "//div[contains(text(), 'Původce:') or contains(text(), 'Originator:')]/following-sibling::div/text()")

        # Write signature
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'signature', "//div[contains(text(), 'Signatura:') or contains(text(), 'Signature:')]/following-sibling::div/text()")

        # Write inventory number
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'inventoryNumber', "//div[contains(text(), 'Inventární číslo:') or contains(text(), 'Inventory Number:')]/following-sibling::div/text()")

        # Write originator type
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorType', "//div[contains(text(), 'Typ matriky:') or contains(text(), 'Registry type:')]/following-sibling::div/text()")

        # Write years
        parse_and_set_years(response, archive_item)

        # Write area
        parse_and_set_area(response, archive_item)

        # Write other note
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'otherNote', "//div[contains(text(), 'Poznámka:') or contains(text(), 'Note:')]/following-sibling::div/text()")

        # Write number of scans
        nr_of_scans = response.xpath("//div[@class='imageBlock']/child::span/text()").get()
        if nr_of_scans:
            only_nr = auxiliary.strip_or_return_none(auxiliary.strip_or_return_none(nr_of_scans).split(' ')[0]).replace(',', '')
            archive_item['numberOfScans'] = int(only_nr)
        else:
            archive_item['numberOfScans'] = 0

        # Write link
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'link', "//textarea[contains(@id, 'permalinkPopupTextarea')]/text()"
        )

        #parse images
        scan_href = response.xpath("//div[@class='imageBlock']/a/@href").get()
        if scan_href:
            scans_url_page = "http://vademecum.soalitomerice.cz" + scan_href
            return Request(url=scans_url_page,
                          callback=self.parse_scans_page,
                          meta={'archive_item': archive_item})
        else:
            archive_item['scans'] = []
            self.goNext = True

        return archive_item
