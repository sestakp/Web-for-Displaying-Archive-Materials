"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from MZA.

@Modified by Pavel Sestak (xsesta07)

Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy import Spider, Request
import re

def parse_and_set_locations(archive_item, response):
    area_strings = response.xpath("//em[contains(text(), 'Obce a jiné lokality')]/parent::th/parent::tr/following-sibling::tr[1]/descendant::a/text()").getall()
    area_strings = [auxiliary.strip_or_return_none(ar) for ar in area_strings if auxiliary.strip_or_return_none(ar)]

    if len(area_strings) == 0:
        return

    locations_list = []
    for as_string in area_strings:
        locations_dict = auxiliary.get_locations_dict()

        if ", okres: " in as_string:
            i = as_string.index(", okres: ")
            locations_dict['district'] = as_string[i + 9:].strip()
            as_string = as_string[:i]

        # If there's 'obec' in the string,
        # the first name is actually a borough (část obce),
        # else the first name is a municipality (obec)
        municipality_satisfied = False
        if ", obec: " in as_string:
            i = as_string.index(", obec: ")
            locations_dict['municipality'] = as_string[i + 8:].strip()
            as_string = as_string[:i]
            municipality_satisfied = True

        # There are no alternative names
        if "(" not in as_string:
            if municipality_satisfied:
                locations_dict['borough'] = as_string.strip()
            else:
                locations_dict['municipality'] = as_string.strip()
        # There are alternative names
        else:
            str_split = as_string.split("(")

            if municipality_satisfied:
                locations_dict['borough'] = str_split[0].strip()
            else:
                locations_dict['municipality'] = str_split[0].strip()

            alternative_names = str_split[1].replace(")", "")
            locations_dict['alternative_names'] = [name.strip() for name in alternative_names.split(", ")]

        locations_list.append(locations_dict)

    archive_item['locations'] = locations_list


class MzaRegistersScraper(Spider):
    name = constants.sn_mza_registers
    archive = constants.a_mza
    handle_httpstatus_list = [403]

    # It's not necessary to have just one link at once here.
    start_urls = [
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=1&search_by_puvodce=",  # českobratrská církev evangelická
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=2&search_by_puvodce=",  # československá církev
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=3&search_by_puvodce=",  # civilní matriky
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=4&search_by_puvodce=",  # jednota baptistů (posledně 0 záznamů)
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=5&search_by_puvodce=",  # jednota bratrská (posledně 0 záznamů)
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=6&search_by_puvodce=",  # milosrdní bratři (posledně 0 záznamů)
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=7&search_by_puvodce=",  # německá evangelická církev
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=8&search_by_puvodce=",  # německé vojenské matriky
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=9&search_by_puvodce=",  # německý stavovský úředník
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=10&search_by_puvodce=",  # pravoslavná církev (posledně 0 záznamů)
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=11&search_by_puvodce=",  # řeckokatolická církev (posledně 0 záznamů)
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=12&search_by_puvodce=",  # římskokatolická církev
        "https://www.mza.cz/actapublica/matrika/hledani?typ=puvodce&typ_puvodce_id=13&search_by_puvodce=",  # starokatolická církev
    ]

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
            items_urls = response.xpath("//a[contains(@title, 'Zobrazit matriku')]/@href").getall()
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
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_mza

        # Write languages
        langs = response.xpath("//td[contains(text(), 'Jazyk')]/following-sibling::td/text()").get()
        if langs:
            archive_item['languages'] = auxiliary.get_languages_array(langs.strip())

        # Write number of scans
        if response.xpath("//div[contains(text(), 'Nebyly nalezeny žádné digitalizované stránky matriky.')]").get():
            archive_item['numberOfScans'] = 0
        else:
            as_text = auxiliary.strip_or_return_none(response.xpath("//label[contains(text(), 'Snímek:')]/following::div/child::div/text()").get())
            if as_text and len(as_text.split()) > 1:
                archive_item['numberOfScans'] = int(as_text.split()[1])

        # Write other note
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'otherNote', "//td[contains(text(), 'Poznámka') and not(contains(text(), 'o původci'))]"
                          "/following-sibling::td/text()")
        # Write link
        archive_item['link'] = auxiliary.get_url_without_params(response.url)

        # Write covered area
        parse_and_set_locations(archive_item, response)

        # Write signature
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'signature', "//td[contains(text(), 'Číslo knihy')]/following-sibling::td/text()")

        # Write originator name
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorName', "//td[contains(text(), 'Původce')]/following-sibling::td/child::a/text()")

        # Write originator type
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorType', "//td[contains(text(), 'Původce')]/following-sibling::td/small/em/text()")

        # Write years
        born = auxiliary.strip_or_return_none(response.xpath("//td[contains(text(), 'Narození od-do')]/following-sibling::td/text()").get())
        archive_item['yearBornFrom'], archive_item['yearBornTo'] = auxiliary.parse_years(born)

        born_index = auxiliary.strip_or_return_none(response.xpath("//td[contains(text(), 'Narození od-do')]/following-sibling::td/small/em/text()").get())
        archive_item['yearBornIndexFrom'], archive_item['yearBornIndexTo'] = auxiliary.parse_years(born_index)

        married = auxiliary.strip_or_return_none(response.xpath("//td[contains(text(), 'Oddaní od-do')]/following-sibling::td/text()").get())
        archive_item['yearMarriedFrom'], archive_item['yearMarriedTo'] = auxiliary.parse_years(married)

        married_index = auxiliary.strip_or_return_none(response.xpath("//td[contains(text(), 'Oddaní od-do')]/following-sibling::td/small/em/text()").get())
        archive_item['yearMarriedIndexFrom'], archive_item['yearMarriedIndexTo'] = auxiliary.parse_years(married_index)

        deceased = auxiliary.strip_or_return_none(response.xpath("//td[contains(text(), 'Zemřelí od-do')]/following-sibling::td/text()").get())
        archive_item['yearDeceasedFrom'], archive_item['yearDeceasedTo'] = auxiliary.parse_years(deceased)

        deceased_index = auxiliary.strip_or_return_none(response.xpath("//td[contains(text(), 'Zemřelí od-do')]/following-sibling::td/small/em/text()").get())
        archive_item['yearDeceasedIndexFrom'], archive_item['yearDeceasedIndexTo'] = auxiliary.parse_years(deceased_index)

        # Write register note
        reg_note = auxiliary.strip_or_return_none(response.xpath("//button[contains(@title, 'Poznámka k matrice')]/@data-content").get())
        if not reg_note == "(bez poznámky)":
            archive_item['registerNote'] = reg_note

        # Write originator note
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'originatorNote', "//td[contains(text(), 'Poznámka o původci')]/following-sibling::td/text()")
        
        #get scans
        script_content = response.xpath("//script[contains(text(), 'CreateSeadragon')]/text()").get()

        if script_content:
            array_match = re.search(r'\[([^\]]+)\]', script_content)
            if array_match:
                array_string = array_match.group(1)
                array_of_strings = [ { 'url': url.strip().strip('"').replace("\\", ""), 'preFetchUrl': ""} for url in array_string.split(',')]
                
                archive_item['scans'] = array_of_strings


        return archive_item


