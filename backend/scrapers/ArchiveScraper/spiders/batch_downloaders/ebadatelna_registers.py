"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from eBadatelna.

@Modified by Pavel Sestak (xsesta07)

Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider
from scrapy import Request, Selector
from scrapy_playwright.page import PageMethod
import re


def parse_and_set_originator(originator_string, archive_item):
    str_split = [orig_str.strip().replace(')', '') for orig_str in originator_string.split('(')]
    archive_item['originatorName'] = str_split[0]
    archive_item['originatorType'] = str_split[1]


def parse_and_set_years(response, archive_item):
    born_divs = response.xpath("//div[contains(text(), 'Narození / index')]/../../descendant::div/div/text()").getall()
    if born_divs:
        if "---" not in born_divs[1]:
            archive_item['yearBornFrom'], archive_item['yearBornTo'] = \
                auxiliary.parse_years(born_divs[1])

        if "---" not in born_divs[2]:
            archive_item['yearBornIndexFrom'], archive_item['yearBornIndexTo'] = \
                auxiliary.parse_years(born_divs[2])

    married_divs = response.xpath("//div[contains(text(), 'Oddaní / index')]/../../descendant::div/div/text()").getall()
    if married_divs:
        if "---" not in married_divs[1]:
            archive_item['yearMarriedFrom'], archive_item['yearMarriedTo'] = \
                auxiliary.parse_years(married_divs[1])

        if "---" not in married_divs[2]:
            archive_item['yearMarriedIndexFrom'], archive_item['yearMarriedIndexTo'] = \
                auxiliary.parse_years(married_divs[2])

    deceased_divs = response.xpath("//div[contains(text(), 'Zemřelí / index')]/../../descendant::div/div/text()").getall()
    if deceased_divs:
        if "---" not in deceased_divs[1]:
            archive_item['yearDeceasedFrom'], archive_item['yearDeceasedTo'] = \
                auxiliary.parse_years(deceased_divs[1])

        if "---" not in deceased_divs[2]:
            archive_item['yearDeceasedIndexFrom'], archive_item['yearDeceasedIndexTo'] = \
                auxiliary.parse_years(deceased_divs[2])


def parse_and_set_registerNote(response, archive_item):
    general_description = \
        response.xpath("string(//span[contains(text(), 'Obecný popis matriky')]/following::span[1])").get()
    general_description = auxiliary.strip_or_return_none(general_description)
    if not general_description or general_description == "---":
        general_description = ""

    additional_info = \
        response.xpath("string(//span[contains(text(), 'Informace o nematričních zápisech')]/following::span[1])").get()
    additional_info = auxiliary.strip_or_return_none(additional_info)
    if not additional_info or additional_info == "---":
        additional_info = ""

    damage_info = \
        response.xpath("string(//span[contains(text(), 'Podrobný popis poškození matriky')]/following::span[1])").get()
    damage_info = auxiliary.strip_or_return_none(damage_info)
    if not damage_info or damage_info == "---":
        damage_info = ""

    registerNote = general_description + '\n' + additional_info + '\n' + damage_info

    archive_item['registerNote'] = registerNote


def parse_and_set_locations(response, archive_item):
    localities_array = response.xpath("//div[contains(@class, 'obecCastLabel')]/text()").getall()
    district = response.xpath("//div[contains(text(), 'Okres')]/following::div[2]/text()").get().strip()

    locations_list = []
    for locality in localities_array:
        locality = locality.strip()  # 'Plachova Lhota / Lhota Plachowa / Bláhová Lhota, Bláhova Lhota [1939 - 1945]'
        locality = "".join(re.split("\[|\]", locality)[::2])  # Remove dates in brackets
        locality = [loc.strip() for loc in locality.replace('/', ',').split(',')]
        municipality = locality[0]
        alternative_names = locality[1:] if len(locality) > 1 else None
        locations_dict = auxiliary.get_locations_dict(district=district, municipality=municipality,
                                                            alternative_names=alternative_names)
        locations_list.append(locations_dict)

    archive_item['locations'] = locations_list


class EbadatelnaRegistersScraper(Spider):
    name = constants.sn_ebadatelna_registers
    archive = constants.a_ebadatelna
    start_url = "https://ebadatelna.soapraha.cz/pages/SearchMatrikaPage"
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_ebadatelna)

    def start_requests(self):
        yield Request(url=self.start_url, meta=dict(
            playwright=True,
            playwright_include_page=True,
            playwright_page_methods=[
                PageMethod("click", selector=".buttonBig.searchButton"),
            ],
            errback=self.errback,
        ))

    async def parse(self, response, **kwargs):
        page = response.meta["playwright_page"]

        previous_page = "0"

        while True:
            await page.wait_for_load_state('networkidle')

            # Wait for new page to load
            while True:
                content = await page.content()
                content_selector = Selector(text=content)
                await page.wait_for_timeout(1000)
                current_page = content_selector.xpath("//select[@name='tableContainer:pagination:results:pageDropdown']/option[@selected='selected']/text()").get()
                if current_page != previous_page:
                    break

            item_urls = content_selector.xpath("//tr[contains(@name, 'dataLink')]/@href").getall()

            for current_url in item_urls:
                # Go straight to the description page (by default it goes to the scans page)
                current_url = ("https://ebadatelna.soapraha.cz/" + current_url).replace("DataMatrikaPage", "MatrikaPage")
                yield Request(url=current_url, callback=self.parse_item)

            # If there isn't next page (we're on the last one), there isn't this button
            next_page_exists = content_selector.xpath("//a[@class='pageNumber' and contains(text(), '>')]").get()
            if not next_page_exists:
                break

            next_page_button = page.locator("xpath=(//a[@class='pageNumber' and contains(text(), '>')])[1]")
            previous_page = current_page
            await next_page_button.click()

    async def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_ebadatelna

        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item, 'signature', "//a[@class='hxLink']/h1/text()")

        # Write originator name and type
        originator_string = response.xpath("//div[contains(@class, 'puvodceLink')]/span/text()").get()
        if originator_string:
            parse_and_set_originator(originator_string, archive_item)

        # Write years
        parse_and_set_years(response, archive_item)

        # Write languages
        lang_str = response.xpath("//div[contains(text(), 'Jazyk')]/following::div[2]/text()").get()
        if lang_str:
            archive_item['languages'] = auxiliary.get_languages_array(lang_str)

        # Write number of scans
        nr_of_scans = response.xpath("//div[contains(text(), 'Počet snímků')]/following::div[2]/text()").get()
        if nr_of_scans:
            archive_item['numberOfScans'] = int(nr_of_scans)
        else:
            archive_item['numberOfScans'] = 0

        #print("signature: ", archive_item['signature'], " with scans: ", archive_item['numberOfScans'])
        # Write register note
        parse_and_set_registerNote(response, archive_item)

        # Write originator note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'originatorNote',
                                          "string(//span[contains(text(), 'Detail původce')]/following::span[1])")

        # Write covered area
        parse_and_set_locations(response, archive_item)

        # Write url
        archive_item['link'] = auxiliary.get_url_without_params(response.url).split(";jsessionid")[0]

        #url example https://ebadatelna.soapraha.cz/wicket/resource/org.apache.wicket.Application/Arnostovice_01__002.jpg
        #we need prefetch data with https://ebadatelna.soapraha.cz/d/14706/75 request
        archive_item['scans'] = []

        signatureUnderscored = auxiliary.remove_special_chars(archive_item['signature'])#.replace(" ", "_")

        archivalNumber = archive_item['link'].split('/')[-1]
        for i in range(1, archive_item['numberOfScans']+1):
            iStrFormatted = "{:03d}".format(i)
            archive_item['scans'].append({ 'url': f'https://ebadatelna.soapraha.cz/wicket/resource/org.apache.wicket.Application/{signatureUnderscored}__{iStrFormatted}.jpg', 'preFetchUrl': f'https://ebadatelna.soapraha.cz/d/{archivalNumber}/{i}'})


        return archive_item

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()
