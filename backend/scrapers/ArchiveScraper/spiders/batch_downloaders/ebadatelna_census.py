"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading census from eBadatelna.

@Modified by Pavel Sestak (xsesta07)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider
from scrapy import Request, Selector
import re


def parse_and_set_locations(archive_item, response):
    alternative_names = response.xpath("//div[@class='obecCastLabel']/text()").get().split(" / ")[1:]
    if len(alternative_names) == 0:
        alternative_names = None

    locations_arr = re.findall(r"(?<=\d\d\d\d: ).+(?=, čp)", archive_item['description'])
    if len(locations_arr) == 0:
        return

    locations_arr = [unit.split(' ', 1)[1].strip() for unit in locations_arr[0].split(" - ")]

    locations_dict = auxiliary.get_locations_dict(district=locations_arr[0],
                                                        municipality=locations_arr[1],
                                                        alternative_names=alternative_names)

    if len(locations_arr) == 3:
        locations_dict['borough'] = locations_arr[2]

    archive_item['locations'] = [locations_dict]


class EbadatelnaCensusScraper(Spider):
    name = constants.sn_ebadatelna_census
    archive = constants.a_ebadatelna
    start_url = "https://ebadatelna.soapraha.cz/pages/SearchArchivaliePage"
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_ebadatelna)

    def start_requests(self):
        print("start url")
        yield Request(url=self.start_url, meta=dict(
            playwright=True,
            playwright_include_page=True,
            errback=self.errback,
        ))

    async def parse(self, response, **kwargs):
        print("parse")
        page = response.meta["playwright_page"]

        await page.locator("xpath=//select[@name='typArchivalie']").select_option("19")
        await page.locator(".buttonBig.searchButton").click()

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
                current_url = ("https://ebadatelna.soapraha.cz/" + current_url).replace("DataArchivaliePage", "ArchivaliePage")
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
        archive_item['typeOfRecord'] = constants.t_census

        # Write archive name
        archive_item['archive'] = constants.a_ebadatelna

        # Write fundName
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'fundName',
                                          "//div[text()='Archivní fond']/../following-sibling::div/child::div/text()")

        # Write year
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'yearTaken',
                                          "//div[text()='Datace rok']/../following-sibling::div/child::div/text()")

        # Write inventory number
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber',
                                          "//div[text()='Inventární číslo']/../following-sibling::div/child::div/text()")

        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'signature',
                                          "//div[text()='Signatura']/../following-sibling::div/child::div/text()")

        # Write languages
        lang_str = response.xpath("//div[text()='Jazyk']/../following-sibling::div/child::div/text()").get()
        if lang_str:
            archive_item['languages'] = auxiliary.get_languages_array(lang_str)

        # Write nr of scans
        nr_of_scans = response.xpath("//div[text()='Snímky']/../following-sibling::div/child::div/text()").get()
        if nr_of_scans and auxiliary.strip_or_return_none(nr_of_scans):
            archive_item['numberOfScans'] = int(auxiliary.strip_or_return_none(nr_of_scans))
        else:
            archive_item['numberOfScans'] = 0

        # Write nad
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'nad',
                                          "//div[text()='NAD']/../following-sibling::div/child::div/text()")

        # Write description
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'description',
                                          "//span[text()='Popis archiválie']/../../following-sibling::div/descendant::span/text()")

        # Write other note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'otherNote',
                                          "//span[text()='Poznámky']/../../following-sibling::div/descendant::span/text()")

        # Write land registry nrs
        if len(archive_item['description'].split("čp. ")) == 2:
            archive_item['landRegistryNrs'] = archive_item['description'].split("čp. ")[1]

        # Write covered area
        parse_and_set_locations(archive_item, response)

        # Write url
        archive_item['link'] = auxiliary.get_url_without_params(response.url).split(";jsessionid")[0]

        archive_item['scans'] = []



        scanName = auxiliary.strip_or_return_none(response.xpath("//h1/text()").get())
        scanNameUnderscored = auxiliary.remove_special_chars(scanName)

        archivalNumber = archive_item['link'].split('/')[-3]
        for i in range(1, archive_item['numberOfScans']+1):
            iStrFormatted = "{:03d}".format(i)
            archive_item['scans'].append({ 'url': f'https://ebadatelna.soapraha.cz/wicket/resource/org.apache.wicket.Application/{scanNameUnderscored}__{iStrFormatted}.jpg', 'preFetchUrl': f'https://ebadatelna.soapraha.cz/a/{archivalNumber}/{i}'})


        return archive_item

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()
