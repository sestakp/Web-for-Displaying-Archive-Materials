"""
Author: Jan Valušek (xvalus03)
Description: Module with auto_downloader spider.
"""

import datetime
import io
import re
import slate3k as slate
from configparser import ConfigParser
from pypdf import PdfReader
from scrapy import Selector
from scrapy.spiders import Spider, Request
from ArchiveScraper import constants, auxiliary
from ArchiveScraper.settings import custom_timestamp
from ArchiveScraper.spiders.batch_downloaders.archives_registers_olomouc import ArchivesRegistersScraper
from ArchiveScraper.spiders.batch_downloaders.mza_registers import MzaRegistersScraper
from ArchiveScraper.spiders.batch_downloaders.ceskearchivy_registers import CeskeArchivyRegistersScraper
from ArchiveScraper.spiders.batch_downloaders.portafontium_registers import PortaFontiumRegistersScraper
from ArchiveScraper.spiders.batch_downloaders.pragapublica_registers_A import PragaPublicaRegistersScraper


def create_config_file():
    config = ConfigParser()
    config['AUTO_DOWNLOADER'] = {'LastCrawlDateTime': custom_timestamp}

    with open(constants.auto_downloader_config_filepath, "w") as file:
        config.write(file)


def get_last_crawl_datetime():
    config = ConfigParser()
    config.read(constants.auto_downloader_config_filepath)

    as_string = config['AUTO_DOWNLOADER']['LastCrawlDateTime']
    return datetime.datetime.strptime(as_string, "%d.%m.%Y-%H_%M_%S")


def update_last_crawl_datetime():
    config = ConfigParser()
    config.read(constants.auto_downloader_config_filepath)
    config.set('AUTO_DOWNLOADER', 'LastCrawlDateTime', custom_timestamp)
    with open(constants.auto_downloader_config_filepath, "w+") as configfile:
        config.write(configfile)


class AutoDownloaderScraper(Spider):
    name = constants.sn_auto_downloader
    handle_httpstatus_list = [403]

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
            "sec-ch-ua-platform": "Linux", 
        },
        "CONCURRENT_REQUESTS": "1",
    }

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        if not constants.auto_downloader_config_filepath.is_file():
            create_config_file()

        self.last_crawl_datetime = get_last_crawl_datetime()

    def __del__(self):
        update_last_crawl_datetime()

    def start_requests(self):
        # Scrape Archives
        yield Request(url=constants.ad_archives, callback=self.parse_archives_updates_page)

        # Scrape Ceske Archivy
        yield Request(url=constants.ad_ceske_archivy, callback=self.parse_ceske_archivy_updates_page, meta=dict(
            playwright=True,
            playwright_include_page=True,
            errback=self.errback,
        ))

        # Scrape MZA
        yield Request(url=constants.ad_mza, callback=self.parse_mza_updates_page, dont_filter=True)

        # Scrape PortaFontium
        yield Request(url=constants.ad_portafontium, callback=self.parse_portafontium_updates_page)

        # Scrape PragaPublica
        yield Request(url=constants.ad_pragapublica, callback=self.parse_pragapublica_updates_page)

    # ****************************************************************** #
    # **************************** ARCHIVES **************************** #
    # ****************************************************************** #
    def parse_archives_updates_page(self, response):
        rows = response.xpath("//tr[@class='eALine']")

        for row in rows:
            to_datetime = datetime.datetime.strptime(row.xpath("./child::td[3]/text()").get(), "%Y-%m-%d")

            if to_datetime > self.last_crawl_datetime:
                url = row.xpath("./child::td/child::a/@href").get()
                yield Request(url=url, callback=self.parse_archives_xml)

    def parse_archives_xml(self, response):
        archives_scraper = ArchivesRegistersScraper()

        items = response.xpath("//hits/hits")
        for item in items:
            if item.xpath("./_source/documentTypeSort/text()").get() == '10':
                uuid = item.xpath("./_source/uuid/text()").get()
                url = f"http://digi.archives.cz/da/permalink?xid={uuid}"
                yield Request(url=url, callback=archives_scraper.parse_item)

    # ****************************************************************** #
    # ************************** CESKE ARCHIVY ************************* #
    # ****************************************************************** #
    async def parse_ceske_archivy_updates_page(self, response):
        content = await self.ceske_archivy_get_content_as_selector(response)
        ca_scraper = CeskeArchivyRegistersScraper()

        items = content.xpath("//div[@class='zpravy']")
        for item in items:
            created = item.xpath("./div[@class='zpravy_nadpis']/text()").get()
            created_datetime = datetime.datetime.strptime(created, "%d. %m. %Y").replace(hour=23, minute=59, second=59)

            if created_datetime < self.last_crawl_datetime:
                return

            uid = item.xpath("./div[@class='zpravy_telo']/a/@href").get().replace("https://digi.ceskearchivy.cz/", '')
            url = f"https://digi.ceskearchivy.cz/description.php?menu=4&id={uid}&lmenu=3"
            yield Request(url=url, callback=ca_scraper.parse_item)

        next_page_href = content.xpath("//a[@data-tooltip='Další strana']/div/@onclick").get()
        if not next_page_href:
            return

        next_page_href = next_page_href.replace("wai();location.href=\"", '').replace("\";", '')
        next_page_url = f"https://digi.ceskearchivy.cz/{next_page_href}"
        yield Request(url=next_page_url, callback=self.parse_ceske_archivy_updates_page, meta=dict(
            playwright=True,
            playwright_include_page=True,
            errback=self.errback,
        ))

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()

    async def ceske_archivy_get_content_as_selector(self, response):
        """
        Gets the page content from the response
        (could be either the iframe content if present,
        or the main html itself).
        """
        page = response.meta["playwright_page"]
        await page.wait_for_load_state('networkidle')
        await page.wait_for_selector("xpath=(//iframe[@id='ram'] | //div[@id='stranka1'])", state="attached")

        if len(page.main_frame.child_frames) > 0:
            frame = page.main_frame.child_frames[0]
            await frame.wait_for_load_state('networkidle')
            content = await frame.content()
        else:
            content = await page.content()

        await page.close()

        return Selector(text=content)

    # ****************************************************************** #
    # ******************************* MZA ****************************** #
    # ****************************************************************** #
    def parse_mza_updates_page(self, response):
        dont_continue = False
        if response.status == 403:
            yield Request(url=response.url,
                          callback=self.parse_mza_updates_page,
                          dont_filter=True)
            dont_continue = True

        if not dont_continue:
            articles = response.xpath("//table[@id='table']/descendant::tr")
            for article in articles:
                headline = article.xpath("./td/div[@class='mb-3']/h2/text()").get()
                if 'matri' not in headline.lower():
                    continue

                created = auxiliary.strip_or_return_none(article.xpath("string(./td/div[@class='mb-3']/p)").get())
                created_datetime = datetime.datetime.strptime(created, "%d.%m.%Y").replace(hour=23, minute=59, second=59)
                if created_datetime < self.last_crawl_datetime:
                    continue

                lines = article.xpath("./td/div[@class='mb-3']/div/p")
                for line in lines:
                    text = auxiliary.strip_or_return_none(line.xpath("string(.)").get())
                    if not text:
                        continue

                    signature = text.replace("opis", '').split(' ')[0]
                    if signature.lower() == "na":
                        continue

                    url = f"https://www.mza.cz/actapublica/matrika/hledani?typ=signatura&mode=show&signatura={signature}"
                    yield Request(url=url, callback=self.parse_mza_search, dont_filter=True)

    def parse_mza_search(self, response):
        """
        The response is either directly the item page,
        or a search page (e.g.: https://www.mza.cz/actapublica/matrika/hledani?typ=signatura&mode=show&signatura=1334).
        """
        dont_continue = False
        if response.status == 403:
            yield Request(url=response.url,
                          callback=self.parse_mza_updates_page,
                          dont_filter=True)
            dont_continue = True

        if not dont_continue:
            mza_scraper = MzaRegistersScraper()

            if "hledani" in response.url:
                # We're on the search page
                searched_nr = auxiliary.strip_or_return_none(response.url.split("=")[-1])
                items = response.xpath("//table[@id='table']/child::tbody/child::tr")
                for item in items:
                    item_nr = auxiliary.strip_or_return_none(item.xpath("./child::td[1]/text()").get())

                    if item_nr != searched_nr:
                        continue

                    url = item.xpath("./child::td[1]/@onclick").get().replace("window.location='", '').replace("';", '')
                    yield Request(url=url, callback=mza_scraper.pre_parse_item, dont_filter=True)
                    break

            else:
                yield mza_scraper.parse_item(response)

    # ****************************************************************** #
    # *************************** PORTAFONTIUM ************************* #
    # ****************************************************************** #
    def parse_portafontium_updates_page(self, response):
        newly_added = response.xpath("//div[@class='view-content']/child::div")

        for item in newly_added:
            created = item.xpath("./descendant::small/text()").get()
            date_as_datetime = datetime.datetime.strptime(created, "%d. %m. %Y").replace(hour=23, minute=59, second=59)

            name = item.xpath("./descendant::a/text()").get().lower()

            if ("matriky" in name) and (date_as_datetime > self.last_crawl_datetime):
                year = name.split(" ")[1]
                url = f"https://www.portafontium.eu/sites/default/files/prirustky-matrik-{year}.pdf"
                yield Request(url=url, callback=self.parse_portafontium_pdf)

    def parse_portafontium_pdf(self, response):
        reader = PdfReader(io.BytesIO(response.body))

        key_str = "/Annots"
        uri_str = "/URI"
        ann_str = "/A"
        links = []
        for page in range(len(reader.pages)):
            page_obj = reader.pages[page].get_object()
            if key_str in page_obj.keys():
                ann = page_obj[key_str]
                for a in ann:
                    u = a.get_object()
                    if uri_str in u[ann_str].keys():
                        links.append(u[ann_str][uri_str])

        portafontium_scraper = PortaFontiumRegistersScraper()
        for url in links:
            yield Request(url=url, callback=portafontium_scraper.parse_item)

    # ****************************************************************** #
    # ************************** PRAGA PUBLICA ************************* #
    # ****************************************************************** #
    def parse_pragapublica_updates_page(self, response):
        articles = response.xpath("//article[@class='article']")

        for article in articles:
            created = article.xpath("./span[@class='date']/text()").get()
            create_datetime = datetime.datetime.strptime(created, "%d. %m. %Y").replace(hour=23, minute=59, second=59)

            if create_datetime < self.last_crawl_datetime:
                continue

            text = article.xpath("string(./div[@class='text'])").get()
            if "matrik" not in text.lower():
                continue

            # If there's a link, there's PDF we have to parse
            url = article.xpath("./div[@class='text']/descendant::a/@href").get()
            if url:
                yield Request(url=url, callback=self.parse_pragapublica_pdf)
            else:  # Else we parse the text
                signatures = self.parse_pragapublica_article_text(text)
                for sign in signatures:
                    yield Request(url=self.pragapublica_signature_to_url(sign), callback=self.parse_pragapublica_search_page)

    def parse_pragapublica_pdf(self, response):
        pdf_text = slate.PDF(io.BytesIO(response.body)).text()
        signatures = re.findall(r"\w+ [NZO]\d+[a-z]*", pdf_text)

        for sign in signatures:
            yield Request(url=self.pragapublica_signature_to_url(sign), callback=self.parse_pragapublica_search_page)

    def parse_pragapublica_article_text(self, text):
        # The signatures can be in the form of "MAG Z14 až MAG Z24",
        # so we first find these cases
        signatures = set()
        for sign in re.findall(r"\w+ [NZO]\d+[a-z]* až \w+ [NZO]\d+[a-z]*", text):
            sign_nrs = re.findall(r"\d+", sign)
            sign_prefix = re.findall(r"\w+ [NZO]", sign)[0]
            for nr in range(int(sign_nrs[0]), int(sign_nrs[1]) + 1):
                signatures.add(sign_prefix + str(nr))

        for sign in re.findall(r"\w+ [NZO]\d+[a-z]*", text):
            signatures.add(sign)

        return signatures

    def parse_pragapublica_search_page(self, response):
        href = response.xpath("//div[@class='contentArticle']/child::div/a[2]/@href").get()
        url = f"http://katalog.ahmp.cz/{href}"

        pragapublica_scraper = PragaPublicaRegistersScraper()
        yield Request(url=url, callback=pragapublica_scraper.parse_item)

    def pragapublica_signature_to_url(self, sign):
        sign = auxiliary.strip_or_return_none(sign).replace(' ', "%20")
        return f"http://katalog.ahmp.cz/pragapublica/searchlink?xid=9cc574cf764e155979d091e92448e22f&fcDb=&onlyDigi=false&modeView=LIST&searchAsPhrase=&patternTxt=&sign.not_analyzed={sign}"
