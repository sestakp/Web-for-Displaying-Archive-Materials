"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading census from PragaPublica.

@Modified by Oto Malik (xmalik22)
@Modified by Pavel Sestak (xsesta07)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider, Request
import re
import asyncio


def parse_and_set_landRegistryNrs(archive_item):
    if not archive_item['content']:
        return

    nrs = re.search("(?<=čp. ).*", archive_item['content'])

    if nrs and nrs.group():
        archive_item['landRegistryNrs'] = nrs.group()


def parse_and_set_locations(archive_item):
    if not archive_item['content'] \
            or "Korespondence" in archive_item['content'] \
            or "rekapitulace" in archive_item['content'] \
            or "přehled" in archive_item['content'] \
            or "nepřítomní" in archive_item['content'] \
            or "sumář" in archive_item['content']:
        return

    as_array = re.split(r"^[MDCLXVI]+-", archive_item['content'].replace("sčítání bytů, ", '').split(', čp')[0])
    borough = [txt for txt in as_array if txt != '']

    archive_item['locations'] = [auxiliary.get_locations_dict(country="Česko",
                                                                    municipality="Praha",
                                                                    borough=borough[0])]


class PragaPublicaCensuscraper(Spider):
    name = constants.sn_pragapublica_census + "_E"
    archive = constants.a_pragapublica

    # Choose one for it to work properly
    start_urls = [
        #'http://katalog.ahmp.cz/pragapublica/searchlink?xid=a3bda7c650ce14833899bad62b7f4d1d&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=',
        #'http://katalog.ahmp.cz/pragapublica/searchlink?xid=22bddf12dd2ce806f562c9d6a54830d2&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=',
        #'http://katalog.ahmp.cz/pragapublica/searchlink?xid=977067a9884345540f20cbc3d3f50d47&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=',
        #'http://katalog.ahmp.cz/pragapublica/searchlink?xid=bbcec0d3839054558d49dfe725124a84&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=',
        'http://katalog.ahmp.cz/pragapublica/searchlink?xid=05bad1c7e0055fe3326b4dd9e0511405&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=',
        #'http://katalog.ahmp.cz/pragapublica/searchlink?xid=15ccaabda5a46f2b6c11c99225fcb05c&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=',
        #'http://katalog.ahmp.cz/pragapublica/searchlink?xid=a6503e9f1a1efe27388cb4d38228dd31&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=',
    ]

    goNext = False
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_pragapublica)

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url)

    def parse(self, response, **kwargs):
        first_item_href = response.xpath(
            "//div[@class='contentArticle']/child::div[@class='navigatorLine listArticle navigatorLineActiv']/child::a[not(@class='attachments')]/@href").get()
        yield Request(url=f"http://katalog.ahmp.cz{first_item_href}", callback=self.parse_item_and_go_to_next_page)

    async def parse_item_and_go_to_next_page(self, response):
        yield self.parse_item(response)

        while not self.goNext:
            await asyncio.sleep(1)

        self.goNext = False

        next_page_href = response.xpath("//i[contains(@class, 'icon-forward3')]/parent::a/@href").get()
        if next_page_href:
            yield Request(url=f"http://katalog.ahmp.cz{next_page_href}",
                          callback=self.parse_item_and_go_to_next_page)


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
            next_page_scan_url = "http://katalog.ahmp.cz" + next_page_link
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
        archive_item['archive'] = constants.a_pragapublica

        # Write inventory number
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber',
                                          "//span[contains(text(), 'Inventární č.:')]/following-sibling::span/text()")

        # Write year taken
        yearTaken = response.xpath("//span[contains(text(), 'Čas. rozsah:')]/following-sibling::span/text()").get()
        if yearTaken:
            years = auxiliary.parse_years(yearTaken)
            archive_item['yearTaken'] = years[0]

        # Write content
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'content',
                                          "//span[contains(text(), 'Obsah:')]/following-sibling::span/text()")

        # Write land registry nrs
        parse_and_set_landRegistryNrs(archive_item)

        # Write number of scans
        numberOfScans = response.xpath("//span[contains(text(), ' obrázk')]/text()").get()
        if numberOfScans:
            archive_item['numberOfScans'] = int(numberOfScans.strip().split(' ')[0].strip())
        else:
            archive_item['numberOfScans'] = 0

        # Write covered area
        parse_and_set_locations(archive_item)

        # Write link
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'link', "//textarea[contains(@class, 'textareaPermalink')]/text()"
        )

        #parse images
        scan_href = response.xpath("//div[@class='oneThumbBloc imageArea']/a/@href").get()
        if scan_href:
            scans_url_page = "http://katalog.ahmp.cz" + scan_href
            return Request(url=scans_url_page,
                           callback=self.parse_scans_page,
                           meta={'archive_item': archive_item})
        else:
            archive_item['scans'] = []
            self.goNext = True

        return archive_item
