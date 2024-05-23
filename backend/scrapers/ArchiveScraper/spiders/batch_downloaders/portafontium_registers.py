"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from Porta fontium.

@Modified by Pavel Sestak (xsesta07)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

import re
from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor


def write_borough_string(name_string):
    # I don't know if there can be a municipality without an alternative name,
    # but I am just checking it to be sure
    if '(' in name_string:
        alternative_names = name_string[name_string.find("(") + 1:name_string.find(")")]  # Get text in brackets ()
        alternative_names = [alt.strip() for alt in alternative_names.split(',')]
        borough_name = name_string.split('(')[0].strip()
    else:
        alternative_names = None
        borough_name = name_string

    municipality = None
    district = None

    superior_units = [unit.strip() for unit in name_string[name_string.find("[") + 1:name_string.find("]")].strip().split(",")]
    if len(superior_units) == 1:
        municipality = superior_units[0]
    else:
        for unit in superior_units:
            if "část obce" in unit:
                municipality = unit[10:]
            elif "okres" in unit:
                district = unit[6:]

    locations_dict = auxiliary.get_locations_dict()
    locations_dict['district'] = district
    locations_dict['municipality'] = municipality
    locations_dict['borough'] = borough_name
    locations_dict['alternative_names'] = alternative_names

    return locations_dict


def write_municipality_string(name_string):
    # I don't know if there can be a municipality without an alternative name,
    # but I am just checking it to be sure
    if '(' in name_string:
        alternative_names = name_string[name_string.find("(") + 1:name_string.find(")")]  # Get text in brackets ()
        alternative_names = [alt.strip() for alt in alternative_names.split(',')]
        municipality_name = name_string.split('(')[0].strip()
    else:
        alternative_names = None
        municipality_name = name_string

    locations_dict = auxiliary.get_locations_dict()
    locations_dict['municipality'] = municipality_name
    locations_dict['alternative_names'] = alternative_names

    return locations_dict


def parse_and_set_locations(response, archive_item, xpathRequest = "//div[contains(text(), 'Místo:')]/following::div[contains(@class, 'field-item even')]/text()"):
    area = response.\
        xpath(xpathRequest).get()

    print("area: ", area)
    if not area:
        return

    # Split only by commas that are not inside () or [] brackets
    # Modified regex from https://stackoverflow.com/a/26634150
    area_split = re.split(r',\s*(?![^()[\]]*[)\]])', area)

    # Each element is either in the form of "name_of_borough (alternative_names_sep_by_comma) [name_of_superior_unit/s]"
    # or                                    "name_of_municipality (alternative_names_sep_by_comma)"
    locations_list = []
    
    for name_string in area_split:
        if '[' in name_string:
            locations_list.append(write_borough_string(name_string))
        else:
            locations_list.append(write_municipality_string(name_string))

    print("locations: ", locations_list)
    archive_item['locations'] = locations_list


def parse_and_set_individual_years(response, archive_item):
    can_return = False
    text_repr_list = ['Narození od:', 'Narození do:', 'Oddaní od:', 'Oddaní do:', 'Zemřelí od:', 'Zemřelí do:',
                      'Index narozených od:', 'Index narozených do:', 'Index oddaných od:', 'Index oddaných do:',
                      'Index zemřelých od:', 'Index zemřelých do:']
    fields = ['yearBornFrom', 'yearBornTo', 'yearMarriedFrom', 'yearMarriedTo', 'yearDeceasedFrom', 'yearDeceasedTo',
              'yearBornIndexFrom', 'yearBornIndexTo', 'yearMarriedIndexFrom', 'yearMarriedIndexTo',
              'yearDeceasedIndexFrom', 'yearDeceasedIndexTo']
    for (text_repr, field) in zip(text_repr_list, fields):
        year = response.xpath(
            f"//div[contains(text(), '{text_repr}')]/following::div[contains(@class, 'field-item even')]/text()"
        ).get()
        if year:
            archive_item[field] = int(year)
            can_return = True

    return can_return


def parse_and_set_together_years(response, archive_item):
    symbol_meaning = {
        '*': 'yearBorn',
        '*i': 'yearBornIndex',
        'oo': 'yearMarried',
        'ooi': 'yearMarriedIndex',
        '+': 'yearDeceased',
        '+i': 'yearDeceasedIndex'
    }

    date_string = response.xpath(
        "//span[normalize-space(text()) = 'Datace']/../../descendant::div[contains(@class, 'field-item even')]/text()"
    ).get()

    if not date_string:
        return

    string_split = [item.strip() for item in date_string.strip().replace(',', '').split(' ')]
    years_from, year_to = auxiliary.parse_years(string_split[0])

    for key in symbol_meaning:
        if key in string_split:
            archive_item[symbol_meaning[key] + 'From'] = years_from
            archive_item[symbol_meaning[key] + 'To'] = year_to


def parse_and_set_years(response, archive_item):
    # Years are either represented individually
    # in the "Datace zápisů" and "Datace indexů" tabs (1)
    # or together in Datace tab (2)

    # First, let's try (1)
    found = parse_and_set_individual_years(response, archive_item)
    if found:
        return

    # Now let's try (2)
    parse_and_set_together_years(response, archive_item)


class PortaFontiumRegistersScraper(CrawlSpider):
    name = constants.sn_portafontium_registers
    archive = constants.a_portafontium
    start_urls = ["https://www.portafontium.eu/searching/register"]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_portafontium)

    rules = (
        # Crawl all pages
        Rule(LinkExtractor(restrict_xpaths="//li[contains(@class, 'pager-next')]/a")),

        # Parse the items
        Rule(LinkExtractor(restrict_xpaths="//td[contains(@class, 'views-field views-field-title-field')]/a"),
             callback="parse_item"),
    )

    def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_portafontium

        # Write signature
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'signature',
            "//div[contains(text(), 'Signatura:')]/following::div[contains(@class, 'field-item even')]/text()"
        )

        # Write signature
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'fundName',
            "//div[contains(text(), 'Značka fondu:')]/following::div[contains(@class, 'field-item even')]/text()"
        )

        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'fundCode',
            "//div[contains(text(), 'Číslo fondu:')]/following::div[contains(@class, 'field-item even')]/text()"
        )

        # Write years
        parse_and_set_years(response, archive_item)

        # Write originator name and type
        originator = response.xpath(
            "//div[contains(text(), 'Původce:')]/following::div[contains(@class, 'field-item even')]/text()").get()
        if originator:
            orig_split = originator.split('(')
            archive_item['originatorName'] = orig_split[0].strip()
            if len(orig_split) > 1:
                archive_item['originatorType'] = orig_split[1][:-1].strip()

        # Write area covered
        parse_and_set_locations(response, archive_item)

        # Write number of pages
        # Number of scans must be retrieved from the last div with class 'iip-thumbnail-number'
        # (it doesn't correspond with 'Počet skenů', nor 'Počet stran')
        nr_of_scans = \
            response.xpath("(//div[contains(@class, 'iip-thumbnail-number')]/child::p/text())[last()]").get()
        if nr_of_scans:
            archive_item['numberOfScans'] = int(nr_of_scans[:-1])
        else:
            archive_item['numberOfScans'] = 0

        # Write languages
        langs = response.xpath(
            "//div[contains(text(), 'Jazyk:')]/following-sibling::div/child::div[contains(@class, 'field-item even')]/text()").get()
        if langs:
            archive_item['languages'] = auxiliary.get_languages_array(langs.strip())

        # Write description
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'description',
            "//div[contains(text(), 'Formální popis:')]/following::div[contains(@class, 'field-item even')]/p"
        )

        # Write content
        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'content',
            "//div[contains(text(), 'Obsah:')]/following::div[contains(@class, 'field-item even')]/p"
        )

        #parse images
        scans = []
        jp2_images = response.xpath('//img[contains(@src, ".jp2")]/@src').getall()
        for jp2_image in jp2_images:
            # Remove everything behind .jp2 and add .dzi
            scanUrl = jp2_image.split('.jp2')[0] + '.jp2.dzi'
            scanUrl = scanUrl.replace(".fcgi?FIF=", ".fcgi?Deepzoom=")
            scans.append({ 'url': "https://www.portafontium.eu"+scanUrl, 'preFetchUrl': ""})

        archive_item['scans'] = scans
        
        # Write link
        archive_item['link'] = auxiliary.get_url_without_params(response.url)

        return archive_item
