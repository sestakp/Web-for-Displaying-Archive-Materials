"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading urbariums from Archives.

@Modified by Pavel Sestak (xsesta07)
@Modified by Oto Malik (xmalik22)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import CrawlSpider, Rule, Request
from scrapy.linkextractors import LinkExtractor
import asyncio

def parse_and_set_locations(archive_item, response):
    localities = auxiliary.strip_or_return_none(response.xpath("//div[contains(@class, 'uzemniRozsah')]/text()").get())
    if not localities:
        return

    munis = [muni.strip() for muni in localities.split(';')]
    archive_item['locations'] = [auxiliary.get_locations_dict(municipality=muni) for muni in munis]


class ArchivesUrbariumsScraper(CrawlSpider):
    name = constants.sn_archives_urbariums

    archive = constants.a_archives
    start_urls = ["https://digi.archives.cz/da/searchlink?myQuery=8eb48b108e5aa1cab0a2ff7c020cfc4f&modeView=LIST"]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_archives)
    goNext = False

    #rules = (
    #    # Parse first item
    #    Rule(LinkExtractor(restrict_xpaths="(//div[contains(@class, 'content') and contains(@class, 'list')]/a)[1]"),
    #         follow=True, callback="parse_item"),

    #    # Crawl all the other items
    #    Rule(LinkExtractor(
    #        restrict_xpaths=
    #        "//div[contains(@id, 'contentRecordDetailFull')]"  # << we're on an item
    #        "/preceding::i[contains(@class, 'icon-forward3')]/parent::a"),
    #        follow=True, callback="parse_item")
    #)

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url, callback=self.parse)

    def parse(self, response, **kwargs):
        first_item_href = \
            response.xpath("(//div[contains(@class, 'content') and contains(@class, 'list')]/a/@href)[1]").get()
        yield Request(url=f"https://digi.archives.cz{first_item_href}",
                      callback=self.parse_item_and_go_to_next)

    async def parse_item_and_go_to_next(self, response):
        yield self.parse_item(response)

        while not self.goNext:
            await asyncio.sleep(1)

        self.goNext = False

        next_page_href = response.xpath("//i[contains(@class, 'icon-forward3')]/parent::a/@href").get()
        if next_page_href:
            yield Request(url=f"https://digi.archives.cz{next_page_href}",
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
            next_page_scan_url = "https://digi.archives.cz" + next_page_link
            return Request(url=next_page_scan_url,
                           callback=self.parse_scans_page,
                           meta={'archive_item': archive_item})
        else:
            self.goNext = True
            return archive_item

    def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_urbarium

        # Write archive name
        archive_item['archive'] = constants.a_archives

        # Write nad
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'nad', "//div[contains(@class, 'cnad')]/text()")

        # Write fundName
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'fundName', "//div[contains(@class, 'fondNazev')]/text()")

        # Write inventory number
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber', "//div[contains(@class, 'invc')]/text()")

        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'signature', "//div[contains(@class, 'sign')]/text()")

        # Write name
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'name', "//div[contains(@class, 'nazev')]/text()")

        # Write original name
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'originalName', "//div[contains(@class, 'origNazev')]/text()")

        # Write index only
        indexOnly = auxiliary.strip_or_return_none(response.xpath("//div[contains(@class, 'indexOnly')]/text()").get())
        if indexOnly == "Ano":
            archive_item['indexOnly'] = True
        else:
            archive_item['indexOnly'] = False


        # Write covered area
        parse_and_set_locations(archive_item, response)

        # Write years
        years = auxiliary.strip_or_return_none(response.xpath("//div[contains(@class, 'datum')]/text()").get())
        if years:
            archive_item['yearFrom'], archive_item['yearTo'] = auxiliary.parse_years(years)

        # Write description
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'description', "//div[contains(@class, 'popis')]/text()")

        # Write record method
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'recordMethod', "//div[contains(@class, 'zpusobVedeni')]/text()")

        # Write languages
        langs = response.xpath("//div[contains(@class, 'jazyk')]/text()").get()
        if langs:
            archive_item['languages'] = auxiliary.get_languages_array(auxiliary.strip_or_return_none(langs))

        # Write other note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'otherNote', "//div[contains(@class, 'pozn')]/text()")

        # Write number of scans
        nr_of_scans = response.xpath("//div[@class='imageBlock']/child::span/text()").get()
        if nr_of_scans:
            only_nr = auxiliary.strip_or_return_none(auxiliary.strip_or_return_none(nr_of_scans).split(' ')[0])
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
            scans_url_page = "https://digi.archives.cz" + scan_href
            return Request(url=scans_url_page,
                           callback=self.parse_scans_page,
                           meta={'archive_item': archive_item})
        else:
            archive_item['scans'] = []
        self.goNext = True

        return archive_item
