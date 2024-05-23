"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from PragaPublica.

@Modified by Oto Malik (xmalik22)
@Modified by Pavel Sestak (xsesta07)

Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import CrawlSpider, Rule, Request
from scrapy.linkextractors import LinkExtractor
import asyncio

def parse_and_set_area(archive_item):
    locations_dict = auxiliary.get_locations_dict(country='Česko', region='Hlavní město Praha',
                                                        municipality='Praha')
    archive_item['locations'] = [locations_dict]


def parse_and_set_years(response, archive_item):
    general_from_to = response.xpath("//div[contains(@class, 'contentArticle row')]/child::h1/text()").get()
    if general_from_to and len(general_from_to.split('•')) > 1:
        year_from, year_to = auxiliary.parse_years(general_from_to.split('•')[1].strip())
        archive_item['yearFrom'] = year_from
        archive_item['yearTo'] = year_to

    symbol_meanings = {
        'N': ['y_born'],
        'O': ['y_married'],
        'Z': ['y_deceased'],
        'i': ['y_index_born', 'y_index_married', 'y_index_deceased'],
        'N,i': ['y_born', 'y_index_born'],
        'O,i': ['y_married', 'y_index_married'],
        'Z,i': ['y_deceased', 'y_index_deceased'],
        'iN': ['y_index_born'],
        'iOZ': ['y_index_married', 'y_index_deceased'],
        'NOZ': ['y_born', 'y_married', 'y_deceased'],
        'N, i': ['y_born', 'y_index_born'],
        'NO': ['y_born', 'y_married'],
        'iZ': ['y_index_deceased'],
        'OZ': ['y_married', 'y_deceased'],
        'iO': ['y_index_married'],
        'iNOZ': ['y_index_born', 'y_index_married', 'y_index_deceased'],
        'Z+i': ['y_deceased', 'y_index_deceased'],
        'NOZ,i': ['y_born', 'y_married', 'y_deceased', 'y_index_born', 'y_index_married', 'y_index_deceased'],
        'i,N': ['y_index_born'],
        'i,Z': ['y_index_deceased'],
        'OZ,i': ['y_married', 'y_deceased', 'y_index_married', 'y_index_deceased'],
        'O.i': ['y_married', 'y_index_married'],
        'NZ,i': ['y_born', 'y_deceased', 'y_index_born', 'y_index_deceased'],
        'O+i': ['y_married', 'y_index_married'],
        'N+i': ['y_born', 'y_index_born'],
        'O, i': ['y_married', 'y_index_married'],
        'Z (obsahuje index)': ['y_deceased', 'y_index_deceased'],
        'NZ': ['y_born', 'y_deceased'],
        'NO,i,Z,i': ['y_born', 'y_married', 'y_deceased', 'y_index_born', 'y_index_married', 'y_index_deceased'],
        'N,i,Z': ['y_born', 'y_index_born', 'y_deceased'],
        'N,I': ['y_born', 'y_index_born'],
        'N, O, Z': ['y_born', 'y_married', 'y_deceased'],
        'index': ['y_index_born', 'y_index_married', 'y_index_deceased'],
        'o+i': ['y_married', 'y_index_married'],
    }

    obsahy_tag = response.xpath("//span[contains(text(), 'Obsahy:')]/following-sibling::span/text()")

    for obsah_node in obsahy_tag:
        symbol, date_span = [token.strip() for token in obsah_node.get().strip().split(';')][0:2]
        if symbol == '' or date_span == '':
            continue

        year_from, year_to = auxiliary.parse_years(date_span)

        for meaning in symbol_meanings[symbol]:
            archive_item[meaning + '_from'] = year_from
            archive_item[meaning + '_to'] = year_to


class PragaPublicaRegistersScraper(CrawlSpider):
    name = constants.sn_pragapublica_registers + "_B"
    archive = constants.a_pragapublica
    start_urls = [
        #"https://katalog.ahmp.cz/pragapublica/searchlink?xid=7EF18906B65E11DF820F00166F1163D4&fcDb=&onlyDigi=true&modeView=LIST&searchAsPhrase=&patternTxt=",
        "http://katalog.ahmp.cz/pragapublica/searchlink?xid=9cc574cf764e155979d091e92448e22f&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt="
    ]

    goNext = False
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_pragapublica)

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url, callback=self.parse)

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

    #rules = (
    #    # Parse first item
    #    Rule(LinkExtractor(restrict_xpaths="(//span[contains(@class, 'info infoType')]/following-sibling::a)[1]"),
    #         follow=True, callback="parse_item"),
    #
    #    # Crawl all the other items
    #    Rule(LinkExtractor(
    #        restrict_xpaths=
    #        "//div[contains(@class, 'contentArticle row')]"  # << we're on an item
    #        "/preceding::i[contains(@class, 'icon-forward3')]/parent::a"),
    #        follow=True, callback="parse_item")
    #)

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
        if response.xpath("//span[contains(text(), 'Typ záznamu:')]/following-sibling::span/text()").get() in ["Fond"]:
            return

        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_pragapublica

        # Write originator name
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorName', "//span[contains(text(), 'Fara/úřad:')]/following-sibling::span/text()"
        )

        # Write originator type
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorType', "(//li[contains(@class, 'navigatorLine treeComponent')]/child::a/text())[4]"
        )

        # Write originator note
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorNote', "//span[contains(text(), 'Poznámky k farnosti:')]/following-sibling::span/text()"
        )

        # Write signature
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'signature', "//span[contains(text(), 'Signatura:')]/following-sibling::span/text()"
        )

        # Write years
        #parse_and_set_years(response, archive_item)

        # Write note
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'otherNote', "//span[contains(text(), 'Poznámka:')]/following-sibling::span/text()"
        )

        # Write covered area
        parse_and_set_area(archive_item)

        # Write number of scans
        numberOfScans = response.xpath("//span[contains(text(), ' obrázk')]/text()").get()
        if numberOfScans:
            archive_item['numberOfScans'] = int(auxiliary.strip_or_return_none(numberOfScans.strip().split(' ')[0]))
        else:
            archive_item['numberOfScans'] = 0

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
