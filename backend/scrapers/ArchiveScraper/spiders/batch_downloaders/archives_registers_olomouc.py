"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from Archives.

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


def parse_and_set_years(response, archive_item):
    years = auxiliary.parse_years(
        response.xpath("//div[contains(text(), 'Časový rozsah') or contains(text(), 'Date range:') or contains(text(), 'Time span')]/following-sibling::div/text()").get())

    if years:
        archive_item['yearFrom'], archive_item['yearTo'] = years

    obsah_svazku = response.xpath("string(//div[contains(text(), 'Obsah svazku:') or contains(text(), 's content:') or contains(text(), 'Contents:')]/following-sibling::div)").get()

    if not obsah_svazku:
        return

    for line in obsah_svazku.split('\n'):
        line = line.strip()
        if line == "":
            continue
        line_split = line.split('•')

        years_type = line_split[0].strip()
        if len(line_split) > 1:
            years = auxiliary.parse_years(line_split[1].strip())

        if years_type == 'N' and years:
            archive_item['yearBornFrom'], archive_item['yearBornTo'] = years
        elif years_type == 'I-N' and years:
            archive_item['yearBornIndexFrom'], archive_item['yearBornIndexTo'] = years
        elif years_type == 'O' and years:
            archive_item['yearMarriedFrom'], archive_item['yearMarriedTo'] = years
        elif years_type == 'I-O' and years:
            archive_item['yearMarriedIndexFrom'], archive_item['yearMarriedIndexTo'] = years
        elif years_type == 'Z' and years:
            archive_item['yearDeceasedFrom'], archive_item['yearDeceasedTo'] = years
        elif years_type == 'I-Z' and years:
            archive_item['yearDeceasedIndexFrom'], archive_item['yearDeceasedIndexTo'] = years


def split_and_parse_lokalita_indent(lokalita_indent_text, locations_dict):
    # Split, strip, and convert empty string to None
    text_split = lokalita_indent_text.split(';')
    text_split_strip = [name.strip() if name.strip() != '' else None for name in text_split]

    locations_dict['country'] = text_split_strip[0]
    locations_dict['region'] = text_split_strip[1]
    locations_dict['district'] = text_split_strip[2]
    locations_dict['municipality'] = text_split_strip[3]
    locations_dict['borough'] = text_split_strip[4]


def split_and_parse_indent_list(indent_list_text, locations_dict):
    # Create alternative names list if it hasn't already been created
    if not locations_dict['alternative_names']:
        locations_dict['alternative_names'] = []

    # Split, strip and throw out empty string
    text_split = indent_list_text.split(';')
    text_split_strip = [name.strip() for name in text_split if name.strip() != '']

    for name in text_split_strip:
        if name:
            locations_dict['alternative_names'].append(name)


def parse_and_set_area(response, archive_item):
    # Find localities-related td tags
    localities_tds = \
        response.xpath("//tbody/descendant::td[contains(@class, 'indent list') or contains(@class, 'lokalita indent')]")

    locations_list = []
    current_dict = None
    for td in localities_tds:
        if td.attrib['class'] == 'lokalita indent':

            # We have to close the previous dict and append it
            if current_dict is not None:
                locations_list.append(current_dict)

            current_dict = auxiliary.get_locations_dict()
            split_and_parse_lokalita_indent(td.xpath('string(.)').get(), current_dict)

        # Add alternative names
        else:
            split_and_parse_indent_list(td.xpath('string(.)').get(), current_dict)

        # If it's the last td, we have to close it and append it
        if td == localities_tds[-1]:
            locations_list.append(current_dict)

    if locations_list:
        archive_item['locations'] = locations_list


class ArchivesRegistersScraper(CrawlSpider):
    name = constants.sn_archives_registers + "_olomouc"

    archive = constants.a_archives
    # Choose just one link at a time!!!
    start_urls = [
        "https://digi.archives.cz/da/searchlink?myQuery=cc8376f2bbd677e2a773137481adbe15&modeView=LIST", # Pobocka Olomouc
        #"https://digi.archives.cz/da/searchlink?myQuery=544361307c2fe803ee0748390c1aa18d&modeView=LIST", # Pobocka Opava
    ]

    goNext = False
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_archives)

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
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_archives

        # Write originator name
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorName', "//div[contains(text(), 'Původce:') or contains(text(), 'Originator:')]/following-sibling::div/text()")

        # Write signature
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'signature', "//div[contains(text(), 'Signatura archivu:') or contains(text(), 'signature:')]/following-sibling::div/text()")

        # Write inventory number
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'inventoryNumber', "//div[contains(text(), 'Inventární číslo:') or contains(text(), 'Inventory Number:')]/following-sibling::div/text()")

        # Write originator type
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorType', "//div[contains(text(), 'Typ matriky:') or contains(text(), 'Type of parish registers:')]/following-sibling::div/text()")

        # Write language
        langs = response.xpath("//div[contains(text(), 'Jazyk:') or contains(text(), 'Language:')]/following-sibling::div/text()").get()
        if langs:
            archive_item['languages'] = auxiliary.get_languages_array(langs.strip())

        # Write years
        parse_and_set_years(response, archive_item)

        # Write area
        parse_and_set_area(response, archive_item)

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
