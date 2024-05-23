"""
Author: Jan Valušek (xvalus03)
Description: Module with scan_downloader spider.
"""

import json
import os
import hashlib
from scrapy.spiders import Spider, Request
from scrapy import FormRequest
from ArchiveScraper import constants, auxiliary
from ArchiveScraper.spiders.scan_downloaders.archives_scan_downloader import parse_archives_item_url
from ArchiveScraper.spiders.scan_downloaders.aron_scan_downloader import get_aron_item_url, parse_aron_item_url
from ArchiveScraper.spiders.scan_downloaders.ceske_archivy_scan_downloader import ceskearchivy_yield_requests, errback
from ArchiveScraper.spiders.scan_downloaders.ebadatelna_scan_downloader import get_ebadatelna_scans_url, parse_ebadatelna_scans_url
from ArchiveScraper.spiders.scan_downloaders.mza_scan_downloader import parse_mza_scans_url
from ArchiveScraper.spiders.scan_downloaders.portafontium_scan_downloader import parse_portafontium_item_url


def create_and_get_temp_directory(json_filepath):
    json_filename = os.path.basename(json_filepath)
    json_directory = os.path.dirname(json_filepath)

    temp_directory = json_directory + "/" + constants.sd_temp_folder_prefix + json_filename.replace(".json", '')
    os.makedirs(temp_directory, exist_ok=True)

    return temp_directory


def playwright_abort_requests(req):
    if "png" in req.url:  # Common
        return True

    if "cgi-bin" in req.url or "Assets" in req.url:  # Ceske archivy
        return True

    if "nahled_maly.jpg" in req.url:  # Archives
        return True

    return False


class ScanDownloaderScraper(Spider):
    name = constants.sn_scan_downloader
    handle_httpstatus_list = [403]

    temp_dirs = []
    archives_context_cnt = 0

    custom_settings = {
        "DEFAULT_REQUEST_HEADERS": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8,sk;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Linux", },
        "CONCURRENT_REQUESTS": 1,
        "DOWNLOAD_DELAY": 2,
        "FEEDS": None,
        "ITEM_PIPELINES": {
            'ArchiveScraper.pipelines.PackTempDirectoriesPipeline': 300,
        },
        "PLAYWRIGHT_ABORT_REQUEST": playwright_abort_requests,
    }

    def __init__(self, json_filepath, **kwargs):
        super().__init__(**kwargs)
        self.json_filepath = json_filepath

    def start_requests(self):
        temp_directory = create_and_get_temp_directory(self.json_filepath)
        self.temp_dirs.append(temp_directory)

        with open(self.json_filepath, "r") as file:
            as_json = json.load(file)

        # If the signature is shared by two or more records,
        # the ZIP file should have MD5 of the record's URL link
        # in its name, not the signature. That's why we have to
        # track the number of occurrences of each signature.
        signature_dict = {}
        for item in as_json:
            signature = item['signature']
            if signature not in signature_dict:
                signature_dict[signature] = 1
            else:
                signature_dict[signature] += 1

        for item in as_json:
            if item['typeOfRecord'] != constants.t_register:
                continue

            if not item['numberOfScans'] or item['numberOfScans'] < 1:
                continue

            url_link = item['link']
            signature = item['signature']

            # If there's no signature or two or more records
            # are using the same signature, we use MD5 hash
            # of the URL link instead of it.
            if not signature or signature_dict[signature] > 1:
                signature = hashlib.md5(item['link'].encode('utf-8')).hexdigest()

            item_directory = temp_directory + "/" + auxiliary.string_to_dir_name(signature)
            os.makedirs(item_directory, exist_ok=True)

            match item['archive']:
                case constants.a_archives | constants.a_pragapublica | constants.a_vademecum:
                    yield Request(url=url_link,
                                  callback=parse_archives_item_url,
                                  meta=dict(
                                      playwright=True,
                                      playwright_context=f"{self.archives_context_cnt}",
                                      delay=self.settings.getint("DOWNLOAD_DELAY"),
                                      item_directory=item_directory,
                                  ))
                    self.archives_context_cnt += 1

                case constants.a_aron:
                    yield Request(url=get_aron_item_url(url_link),
                                  callback=parse_aron_item_url,
                                  meta=dict(
                                      temp_directory=temp_directory,
                                      signature=signature,
                                  ))

                case constants.a_ceskearchivy:
                    yield FormRequest(url="https://digi.ceskearchivy.cz/pages/login.php?menu=7&lang=cs",
                                      callback=ceskearchivy_yield_requests,
                                      meta=dict(
                                          item_directory=item_directory,
                                          signature=item['signature'],
                                          numberOfScans=item['numberOfScans'],
                                          delay=self.settings.getint("DOWNLOAD_DELAY"),
                                          playwright=True,
                                          playwright_include_page=True,
                                          errback=errback),
                                      dont_filter=True,
                                      formdata={"small": "",
                                                "url": "",
                                                "jmeno": "janscraper",
                                                "heslo": "5poapqjVY7HPqqZ",
                                                "obnovit": "1",
                                                "wx": "1896",
                                                "wy": "1075"})

                case constants.a_ebadatelna:
                    yield Request(url=get_ebadatelna_scans_url(url_link),
                                  callback=parse_ebadatelna_scans_url,
                                  meta=dict(
                                      item_directory=item_directory,
                                  ),
                                  dont_filter=True)

                case constants.a_mza:
                    yield Request(url=url_link,
                                  callback=parse_mza_scans_url,
                                  meta=dict(
                                      delay=self.settings.getint("DOWNLOAD_DELAY"),
                                      playwright=True,
                                      playwright_include_page=True,
                                      item_directory=item_directory,
                                  ),
                                  dont_filter=True)

                case constants.a_portafontium:
                    yield Request(url=url_link,
                                  callback=parse_portafontium_item_url,
                                  meta=dict(
                                      item_directory=item_directory,
                                  ))
