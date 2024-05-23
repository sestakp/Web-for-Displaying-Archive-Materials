"""
Author: Jan Valušek (xvalus03)
Description: Module with spider for downloading registers from ARON.

@Modified by Pavel Sestak (xsesta07)
"""

from ArchiveScraper import constants, auxiliary
from ArchiveScraper.items import ArchiveItem
from scrapy.spiders import Spider
from scrapy import Request, Selector
import json
import requests


AREA_ID_TO_STRING = {}  # Area string cache so I don't have to do new requests every time


def set_years(archive_item, types_of_reg, years):
    if "záznamy narozených" in types_of_reg:
        archive_item['yearBornFrom'], archive_item['yearBornTo'] = years[0], years[1]

    if "rejstřík narozených" in types_of_reg:
        archive_item['yearBornIndexFrom'], archive_item['yearBornIndexTo'] = years[0], years[1]

    if "záznamy oddaných" in types_of_reg:
        archive_item['yearMarriedFrom'], archive_item['yearMarriedTo'] = years[0], years[1]

    if "rejstřík oddaných" in types_of_reg:
        archive_item['yearMarriedIndexFrom'], archive_item['yearMarriedIndexTo'] = years[0], years[1]

    if "záznamy zemřelých" in types_of_reg:
        archive_item['yearDeceasedFrom'], archive_item['yearDeceasedTo'] = years[0], years[1]

    if "rejstřík zemřelých" in types_of_reg:
        archive_item['yearDeceasedIndexFrom'], archive_item['yearDeceasedIndexTo'] = years[0], years[1]


def parse_and_set_locations(archive_item, json_response):
    area_strings = []

    found_ids = []
    for item in json_response['parts'][1]['items']:
        if (item['type'] == "ENTITY~ROLE~82") and (item['visible']):
            found_ids.append(item['value'])

    for a_id in found_ids:
        if a_id in AREA_ID_TO_STRING:
            area_strings.append(AREA_ID_TO_STRING[a_id])
        else:
            link = f"https://aron.vychodoceskearchivy.cz/api/aron/apu/{a_id}"
            area_json = requests.get(link).json()
            area_string = None

            if 'name' in area_json:
                area_string = area_json['name']

            AREA_ID_TO_STRING[a_id] = area_string
            area_strings.append(area_string)

    if len(area_strings) == 0:
        return

    # Current form:
    # - 'Babice (Hradec Králové, Česko)'
    # - 'Malé Babice (Babice, Hradec Králové, Česko : nižší sídelní jednotka)'
    # ...it goes from the lowest administrative unit to the highest (excluding region)

    locations_list = []
    for area_str in area_strings:
        if not area_str:
            continue

        area_str = area_str.replace('(', ',').replace(')', '')
        area_str = area_str.split(':')[0]
        area_arr = [unit.strip() for unit in area_str.split(',')]
        current_dict = auxiliary.get_locations_dict()
        if len(area_arr) == 3:
            current_dict['district'] = area_arr[1]
            current_dict['municipality'] = area_arr[0]
        elif len(area_arr) == 4:
            current_dict['district'] = area_arr[2]
            current_dict['municipality'] = area_arr[1]
            current_dict['borough'] = area_arr[0]

        locations_list.append(current_dict)

    archive_item['locations'] = locations_list


class AronRegistersScraper(Spider):
    name = constants.sn_aron_registers
    
    archive = constants.a_aron
    start_url = "https://aron.vychodoceskearchivy.cz/apu/1875fe9a-f56e-4735-866e-12f442ac8eb9"
    custom_settings = auxiliary.get_custom_settings_dict_with_request_headers(constants.a_aron)

    def start_requests(self):
        yield Request(url=self.start_url, meta=dict(
            playwright=True,
            playwright_include_page=True,
            errback=self.errback,
        ))

    async def parse(self, response, **kwargs):
        page = response.meta["playwright_page"]
        await page.wait_for_selector("xpath=//div[@id='evidence-detail-tree-wrapper']")
        page_content = Selector(text=await page.content())
        await page.close()

        new_ids = page_content.xpath("(//li[@aria-expanded='true' and not(@tab-index='0')])[last()]/descendant::li")
        item_ids = []
        page_ids = []

        for new_id in new_ids:
            if ("matrika" in new_id.xpath("string(.)").get()) or ("index" in new_id.xpath("string(.)").get()):
                item_ids.append(new_id.xpath("./@id").get())
            else:
                page_ids.append(new_id.xpath("./@id").get())

        for item_id in item_ids:
            api_link = f"https://aron.vychodoceskearchivy.cz/api/aron/apu/{item_id}"
            yield Request(url=api_link, callback=self.parse_item)

        for page_id in page_ids:
            new_link = f"https://aron.vychodoceskearchivy.cz/apu/{page_id}"
            yield Request(url=new_link, meta=dict(
                playwright=True,
                playwright_include_page=True,
                errback=self.errback,
            ))

    def parse_item(self, response, **kwargs):
        json_response = json.loads(response.text)

        #print(json.dumps(json_response, indent=4, ensure_ascii=False))
        #print("json item: ", json_response)
        archive_item = ArchiveItem()

        # Write type of record
        archive_item['typeOfRecord'] = constants.t_register

        # Write archive name
        archive_item['archive'] = constants.a_aron

        # Write originator name
        archive_item['originatorName'] = json_response['parent']['description']

        # Write originator type
        if "fary" in json_response['parent']['parent']['description']:
            archive_item['originatorType'] = json_response['parent']['parent']['parent']['description']
        else:
            archive_item['originatorType'] = json_response['parent']['parent']['description']

        # Write signature, inventory number
        # and fetch types of register, years
        types_of_reg = []
        years = None
        for item in json_response['parts'][0]['items']:
            value = auxiliary.strip_or_return_none(item['value'])

            match item['type']:
                case "OTHERID~SIG":
                    archive_item['signature'] = value
                case "STORAGE~ID":
                    archive_item['inventoryNumber'] = value
                case "RECORD~TYPE":
                    types_of_reg.append(value)
                case "UNIT~DATE":
                    years = auxiliary.parse_years(value)

        set_years(archive_item, types_of_reg, years)

        # Write covered area
        parse_and_set_locations(archive_item, json_response)

        # Write number of scans
        archive_item['numberOfScans'] = 0
        if ("digitalObjects" in json_response) and (len(json_response['digitalObjects']) > 0) and ("files" in json_response['digitalObjects'][0]):
            nr_of_scans = json_response['digitalObjects'][0]['files'][-1]['order']
            if nr_of_scans:
                archive_item['numberOfScans'] = nr_of_scans

        # Write register note
        archive_item['registerNote'] = auxiliary.strip_or_return_none(json_response['description'])

        # Write url
        archive_item['link'] = auxiliary.get_url_without_params(response.url).replace("api/aron/", '')

        archive_item["scans"] = []
        for file in json_response["digitalObjects"][0]["files"]:
            if file["type"] == "TILE":
                #print("TILE: ", file["id"])
                url = f'https://aron.vychodoceskearchivy.cz/api/aron/tile/{file["id"]}/image.dzi'
                archive_item["scans"].append({ 'url': url, 'preFetchUrl': ""})

        return archive_item

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()
