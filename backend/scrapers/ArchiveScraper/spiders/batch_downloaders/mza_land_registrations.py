"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading land registrations from MZA.

@Modified by Pavel Sestak (xsesta07)
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider
import scrapy
import json
import re


def parse_and_set_locations(archive_item, item_dict):
    municipalities = [muni.strip() for muni in item_dict['obsah'].split("<br><br>")[1].split(',')]

    locations_list = []
    for muni in municipalities:
        locations_dict = auxiliary.get_locations_dict(country="Česko", municipality=muni)
        locations_list.append(locations_dict)

    archive_item['locations'] = locations_list



class MzaLandRegistrationsScraper(Spider):
    """Spider for MZA's land registrations (lánové rejstříky)."""
    name = constants.sn_mza_land_registrations
    archive = constants.a_mza
    start_urls = ["http://www.mza.cz/a8web/A8Apps1/ARCViewer/data/D1-Inventar.json"]
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_mza)

    def parse(self, response, **kwargs):
        json_response = json.loads(response.text)

        for item in json_response['ar1']:
            yield self.parse_item(item)

    def parse_additional_field(self, response):
        # Retrieve archive_item from meta
        archive_item = response.meta['archive_item'].copy()

        # Extracting JavaScript content from the response body
        js_content = response.xpath('//script[contains(text(), "var ts1 =")]/text()').get()

        
        #print(f'parse_additional_field: ', js_content)

        # Parsing ts1 variable from JavaScript content using regular expression
        ts1_match = re.search(r'var ts1\s*=\s*\[([\s\S]*?)\];', js_content)
        if ts1_match:
            
            #print(f'ts1_match')
            ts1_content = ts1_match.group(1)
            # Extracting URLs from ts1 content
            urls = re.findall(r'"(.*?)"', ts1_content)
            # Adding URLs to archive_item
            
            #self.logger.error('urls: %s', urls)
            
            archive_item['scans'] = []
            for url in urls:
                archive_item['scans'].append({ 'url': url, 'preFetchUrl': ""})
        
        yield archive_item

    def parse_item(self, item_dict):
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_land_registration

        # Write archive name
        archive_item['archive'] = constants.a_mza

        # Write inventory number
        archive_item['inventoryNumber'] = item_dict['invj1']

        # Write signature
        archive_item['signature'] = item_dict['signa']

        # Write covered area
        parse_and_set_locations(archive_item, item_dict)

        # Write years
        archive_item['yearFrom'], archive_item['yearTo'] = [int(y.strip()) for y in item_dict['rok'].split('-')]

        # Write url
        archive_item['link'] = item_dict['dd']

        if item_dict['dd'] == "" or item_dict['dd'] is None:
            return archive_item
        else:
            return scrapy.Request(url=item_dict['dd'], callback=self.parse_additional_field, meta={'archive_item': archive_item})
        

