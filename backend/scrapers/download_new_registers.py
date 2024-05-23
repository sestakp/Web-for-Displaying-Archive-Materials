"""
Author: Jan Valušek (xvalus03)
Description: Script that auto-downloads the new/updated registers from the archives.
"""

from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from ArchiveScraper.spiders.auto_downloader import AutoDownloaderScraper
from ArchiveScraper.spiders.scan_downloader import ScanDownloaderScraper
from ArchiveScraper import constants
from ArchiveScraper import settings
import argparse
import os


def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-m",
        "--mode",
        choices=["texts", "both"],
        default="texts",
        help="Specifies the mode of the run. 'texts' downloads only the text data of the registers. "
             "'both' downloads the text data of the registers, and its scans. Default: 'texts'.",
    )

    return parser.parse_args()


def run(mode="texts"):
    """
    Downloads text data and/or scans of new/updated registers.

    :param mode: Specifies the mode of the run. 'texts' downloads only the text data of the registers.
                 'both' downloads the text data of the registers, and its scans.
    """
    output_folder_filepath = f"{constants.output_directory_name}/{constants.sn_auto_downloader}"
    json_filepath = f"{output_folder_filepath}/{constants.sn_auto_downloader}_{settings.custom_timestamp}.json"
    os.makedirs(output_folder_filepath, exist_ok=True)
    scrapy_settings = get_project_settings()
    scrapy_settings.set("LOG_FILE", json_filepath.replace(".json", "_texts.log"))

    process = CrawlerProcess(scrapy_settings)
    process.crawl(AutoDownloaderScraper)
    process.start()

    if mode != "texts":
        scrapy_settings.set("LOG_FILE", json_filepath.replace(".json", "_scans.log"))
        process = CrawlerProcess(scrapy_settings)
        process.crawl(ScanDownloaderScraper, json_filepath=json_filepath)
        process.start()


if __name__ == "__main__":
    args = parse_arguments()
    run(mode=args.mode)
