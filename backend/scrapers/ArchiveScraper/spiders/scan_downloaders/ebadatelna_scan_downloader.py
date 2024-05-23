"""
Author: Jan Valušek (xvalus03)
Description: Module with functions for downloading scans from eBadatelna.
"""

from scrapy import Request


def get_ebadatelna_scans_url(url_link):
    return url_link.replace("pages/MatrikaPage/idx/1/matrikaId", "d") + "/1"


def parse_ebadatelna_scans_url(response):
    last_scan_page = int(response.xpath("//a[@class='pageNumber'][2]/span/text()").get())
    base_url = response.request.url[:-1]
    for page in range(1, last_scan_page + 1):
        yield Request(url=base_url + str(page),
                      callback=parse_ebadatelna_scan_page,
                      meta={"item_directory": response.meta['item_directory']},
                      dont_filter=True)


def parse_ebadatelna_scan_page(response):
    jpeg_url = "https://ebadatelna.soapraha.cz/" \
               + response.xpath("//span[text()='▼']/parent::a/@href").get().replace("../../", '')
    yield Request(url=jpeg_url,
                  callback=download_ebadatelna_jpeg,
                  meta={"item_directory": response.meta['item_directory']},
                  dont_filter=True)


def download_ebadatelna_jpeg(response):
    filename = response.request.url.split('/')[-1]
    with open(f"{response.meta['item_directory']}/{filename}", 'wb') as file:
        file.write(response.body)
