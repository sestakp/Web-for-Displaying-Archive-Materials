"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading census from VadeMeCum.

@Modified by Oto Malik (xmalik22)
@Modified by Pavel Sestak (xsesta07)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider, Request
from ArchiveScraper.spiders.batch_downloaders.vademecum_urbariums import parse_and_set_locations
import asyncio

class VadeMeCumCensusScraper(Spider):
    name = constants.sn_vademecum_census
    archive = constants.a_vademecum
    first_url = "http://vademecum.soalitomerice.cz"  # To avoid getting 503 unavailable error
    start_url = "http://vademecum.soalitomerice.cz/vademecum/searchlink?myQuery=288eda58d2d3ca2ab50b15a1613f1258&modeView=LIST"
    goNext = False
    auxiliary.get_custom_settings_dict_with_request_headers(constants.a_vademecum)

    def start_requests(self):
        yield Request(url=self.first_url)

    def parse(self, response, **kwargs):
        yield Request(url=self.start_url, callback=self.parse_search_page)

    def parse_search_page(self, response):
        first_item_href = \
            response.xpath("(//div[contains(@class, 'content') and contains(@class, 'list')]/a/@href)[1]").get()
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

        archive_item = response.meta['archive_item'].copy()
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
        archive_item['typeOfRecord'] = constants.t_census

        # Write archive name
        archive_item['archive'] = constants.a_vademecum

        # Write NAD
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'nad', "//div[contains(@class, 'cnad')]/text()")

        # Write year
        yearTaken = response.xpath("//div[contains(@class, 'rok')]/text()").get()
        if auxiliary.strip_or_return_none(yearTaken):
            y_as_ints = auxiliary.parse_years(yearTaken)
            archive_item['yearTaken'] = y_as_ints[0]
            if y_as_ints[1] != y_as_ints[0]:
                archive_item['yearFrom'] = y_as_ints[0]
                archive_item['yearTo'] = y_as_ints[1]

        # Write covered area
        parse_and_set_locations(archive_item, response)

        # Write land registry nrs
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'landRegistryNrs',
                                          "//div[contains(@class, 'objekt')]/text()")

        # Write judicial district
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'judicialDistrict', "//div[contains(@class, 'pokres')]/text()")

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
