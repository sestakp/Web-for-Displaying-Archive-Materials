"""
Author: Jan Valušek (xvalus03)
Description: Module with functions for downloading scans from Porta fontium.
"""

import re
from scrapy import Request


def parse_portafontium_item_url(response):
    url_prefix = "https://www.portafontium.eu"
    download_urls = [url_prefix + url.replace("wid=100", "wid=0")
                     for url in response.xpath("//div[contains(@class, 'iip-thumbnail')]/a/img/@src").getall()]
    
    for url in download_urls:
        yield Request(url=url,
                      callback=download_portafontium_jpeg,
                      meta={"item_directory": response.meta['item_directory']})


def download_portafontium_jpeg(response):
    filename = re.findall(r"(?<=filename=).*.jpg", response.headers['Content-Disposition'].decode('utf-8'))[0]
    with open(f"{response.meta['item_directory']}/{filename}", 'wb') as file:
        file.write(response.body)
