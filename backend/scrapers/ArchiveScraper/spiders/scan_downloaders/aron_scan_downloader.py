"""
Author: Jan Valušek (xvalus03)
Description: Module with functions for downloading scans from ARON.
"""

import json
from scrapy import Request


def get_aron_item_url(url_link):
    return url_link.replace("/apu", "/api/aron/apu")


def parse_aron_item_url(response):
    json_response = json.loads(response.text)

    for obj in json_response['parts'][0]['items']:
        if obj['type'] == 'URL':
            scan_zip_url = obj['href']
            yield Request(url=scan_zip_url,
                          callback=download_aron_scan_zipfile,
                          meta=dict(
                              temp_directory=response.meta['temp_directory'],
                              signature=response.meta['signature'],
                          ))
            break


def download_aron_scan_zipfile(response):
    with open(f"{response.meta['temp_directory']}/{response.meta['signature']}.zip", 'wb') as file:
        file.write(response.body)
