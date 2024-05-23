"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading urbariums from Porta fontium.

@Modified by Pavel Sestak (xsesta07)


Locations work: 12.4.2024
Scans work: 12.4.2024
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import CrawlSpider, Rule
from ArchiveScraper.spiders.batch_downloaders import portafontium_registers
from scrapy.linkextractors import LinkExtractor
import re


def write_borough_string(name_string):
   # Parse alternative names
    alternative_names = None
    if '(' in name_string:
        alternative_names_str = name_string[name_string.find("(") + 1:name_string.find(")")]
        alternative_names = [alt.strip() for alt in alternative_names_str.split(',')]
    
    municipality = name_string.split('(')[0].strip()

    # Parse superior units
    district = None
    borough = None
    superior_units = [unit.strip() for unit in name_string[name_string.find("[") + 1:name_string.find("]")].strip().split(",")]
    for unit in superior_units:
        if unit.startswith("okres"):
            district = unit.split(" ")[1]
        elif unit.startswith("část obce"):
            borough = municipality
            municipality = unit.replace("část obce ", "")

    # Construct the locations dictionary
    locations_dict = auxiliary.get_locations_dict()
    locations_dict['district'] = district
    locations_dict['municipality'] = municipality
    locations_dict['borough'] = borough
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

def parse_and_set_locations(response, archive_item):
        areas = response.\
            xpath("//div[@class='doc-place-item-list']/ul/li//text()")
        
        # Extract text content from the Selector objects
        area_text = [sel.extract().strip() for sel in areas]

        # Filter out empty strings
        area_text = [text for text in area_text if text]

        # Print the extracted text
        print(area_text)

        #print("area: ", area_text)

        locations_list = []


        i = 0

        while i < len(area_text):
            j = i + 1
            locationText = area_text[i]
            location = None
            if(j < len(area_text) and "[" in area_text[j]):
                locationText = locationText + " "+ area_text[j]
                location = write_borough_string(locationText)
                i = i + 2
            else:
                location = write_municipality_string(locationText)
                i = i + 1

            
            locations_list.append(location)


        
        archive_item['locations'] = locations_list


class PortaFontiumUrbariumsScraper(CrawlSpider):
    name = constants.sn_portafontium_urbariums
    archive = constants.a_portafontium
    start_urls = ["https://www.portafontium.eu/searching/amtsbuch?field_archives=All&field_book_type%5B%5D=urbar&search_api_views_fulltext="]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_portafontium)

    rules = (
        # Crawl all pages
        Rule(LinkExtractor(restrict_xpaths="//li[contains(@class, 'pager-next')]/a")),

        # Parse the items
        Rule(LinkExtractor(restrict_xpaths="//td[contains(@class, 'views-field views-field-title-field')]/a[text()='Urbář']"),
             callback="parse_item"),
    )

    def parse_item(self, response):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_urbarium

        # Write archive name
        archive_item['archive'] = constants.a_portafontium

        # Write fund
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'fundName', "//div[contains(text(), 'Značka fondu:')]/following-sibling::div/child::div/text()")

        auxiliary.add_to_item_if_not_none(
            response, archive_item,
            'fundCode',
            "//div[contains(text(), 'Číslo fondu:')]/following::div[contains(@class, 'field-item even')]/text()"
        )
        
        # Write signature
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'signature',
                                          "//div[contains(text(), 'Signatura – ev./ukl. j. č.:')]/following-sibling::div/child::div/text()")

        # Write inventory nr
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'inventoryNumber',
                                          "//div[contains(text(), 'Inv. č.:')]/following-sibling::div/child::div/text()")

        # Write years
        years_str = response.xpath("//div[contains(text(),  'Datace:')]/following-sibling::div/child::div/text()").get()
        if years_str:
            archive_item['yearFrom'], archive_item['yearTo'] = auxiliary.parse_years(years_str)

        # Write name
        name = response.xpath("(//div[@class='breadcrumb']/text())[last()]").get()
        if name:
            name = auxiliary.strip_or_return_none(name.replace('›', ''))
            archive_item['name'] = name

        # Write original name
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'originalName',
                                          "//div[contains(text(), 'Původní nadpis:')]/following-sibling::div/div/text()")

        # Write languages
        langs = response.xpath(
            "//div[contains(text(), 'Jazyk:')]/following-sibling::div/child::div[contains(@class, 'field-item even')]/text()").get()
        if langs:
            archive_item['languages'] = auxiliary.get_languages_array(langs.strip())

        # Write content
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'content', "//div[contains(text(), 'Obsah / Regest:')]/following-sibling::div/descendant::p/text()")

        # Write other note
        auxiliary.add_to_item_if_not_none(response, archive_item,
                                          'content', "//div[contains(text(), 'Poznámka:')]/following-sibling::div/descendant::div/text()")

        # Write covered area        
        parse_and_set_locations(response, archive_item)

        nr_of_scans = \
            response.xpath("(//div[contains(@class, 'iip-thumbnail-number')]/child::p/text())[last()]").get()
        if nr_of_scans:
            archive_item['numberOfScans'] = int(nr_of_scans[:-1])
        else:
            archive_item['numberOfScans'] = 0

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
