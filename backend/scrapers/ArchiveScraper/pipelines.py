"""
Author: Jan Valušek (xvalus03)
Description: Module with Scrapy pipelines.

@Modified by Pavel Sestak (xsesta07)
"""

import glob
import os.path
import shutil
from zipfile import ZipFile
from ArchiveScraper import constants, auxiliary
import requests
import re
import json

import modules.clusteringModule as clusteringModule, modules.locationModule as locationModule, modules.parseModule as parseModule

class SetDefaultsPipeline:
    """Sets all item values to None."""

    def process_item(self, item, spider):
        for field in item.fields:
            item.setdefault(field, None)
        
        return item


class LocationPipeline:
    """
    locations_dict = {
        "country": string,
        "region": string,
        "district": string,
        "municipality": string,
        "borough": string,
        "german_name": string,
        "alternative_names": alternative_names
    }
    """

    def get_location_string(self, loc):
        locString = ""
        if loc["country"] is not None:
            locString = loc["country"]

        if loc["region"] is not None:
            if(len(locString)) > 0:
                locString = locString + ", " + loc["region"]
            else:
                locString = loc["region"]
        
        if loc["municipality"] is not None:
            if(len(locString)) > 0:
                locString = locString + ", " + loc["municipality"]
            else:
                locString = loc["municipality"]
        return locString
    
    def filter_roman(self,input_string):
        # Define a regular expression pattern to match Roman numerals and dots
        pattern = r'\b(?:[IVXLCDM]+|\.)\b'

        # Use re.sub to replace matches with an empty string
        result = re.sub(pattern, '', input_string)

        return result

    def process_item(self, item, spider):

        archive_city_name = auxiliary.get_city_from_archive(spider.archive)

        archive_location = locationModule.get_location_info(archive_city_name, None)[0]
        
        newAddresses = []
        if item.get("locations", None) is not None:
            for loc in item["locations"]:
                all_fields_none = all(value is None for value in loc.values())

                if all_fields_none:
                    continue
                
                if loc["municipality"] is not None:
                    muni = loc["municipality"]
                    muni = muni.split('(')[0]
                    muni = muni.split(',')[0]

                    
                    muni = muni.split(" - ")[0]

                    substrings = ["žid", "předměstí", "město", "sumář", "hrad", "strana"] #must be lowercase
                    parts = muni.split("-")
                    if len(parts) > 1:
                        parts1Lower = parts[1].lower()
                        for substring in substrings:
                            if substring in parts1Lower:
                                muni = parts[0]
                                break
                    

                    muni = self.filter_roman(muni) # remove roman numbers

                    muni = muni.replace('.', '') #remove dots

                    loc["municipality"] = muni
                

                loc["municipality"] = loc["municipality"].strip()
                
                if loc["country"] is not None and ":" in loc["country"]:
                    country_parts = loc["country"].split(":")
                    loc["country"] = country_parts[0]

                locString = self.get_location_string(loc)
                locations_from_api = locationModule.get_location_info(locString, archive_location)

                locations_from_api_filtered = []
                for locApi in locations_from_api:
                    
                    address = parseModule.parseAddress(locApi.raw)
                    if loc is not None and address is not None:
                        if loc["municipality"] is not None and address["municipality"] is not None:
                            if loc["municipality"] in address["municipality"]:
                                locations_from_api_filtered.append(locApi)
                                continue
                        if loc["borough"] is not None and address["borough"] is not None:
                            if loc["borough"] in address["borough"]:
                                locations_from_api_filtered.append(locApi)
                                continue
                        if loc["borough"] is not None and address["municipality"] is not None:
                            if loc["borough"] in address["municipality"]:
                                locations_from_api_filtered.append(locApi)
                                continue
                        if loc["municipality"] is not None and address["borough"] is not None:
                            if loc["municipality"] in address["borough"]:
                                locations_from_api_filtered.append(locApi)
                                continue

                loc["locations"] = locations_from_api_filtered
                newAddresses.append(loc)

        clusteringModule.iterative_clustering2(newAddresses, archive_location)
        
        newAddressesFinal = []
        for loc in newAddresses:
            if len(loc["locations"]) > 0:
                address = parseModule.parseAddress(loc["locations"][0].raw)
                del loc["locations"]
                if address is not None and address["municipality"] is None and address["borough"] is None:
                    if loc["municipality"] is None and loc["borough"] is None:
                        continue
                    loc = auxiliary.remove_none_keys(loc)
                    newAddressesFinal.append(loc)
                
                if address is not None:
                    address = auxiliary.remove_none_keys(address)
                    newAddressesFinal.append(address)
                else:
                    loc = auxiliary.remove_none_keys(loc)
                    newAddressesFinal.append(loc)
            else:
                del loc["locations"]
                loc = auxiliary.remove_none_keys(loc)
                newAddressesFinal.append(loc)

        print("new addresses: ", newAddressesFinal)
        item["locations"] = newAddressesFinal
        return item

class APISenderPipeline:

    def process_item(self, item, spider):
        api_url = 'http://backend:8080/api/archival-records'
        #api_url = 'http://perun.fit.vutbr.cz:8082/api/archival-records'
            
        try:
            itemWithoutNone = auxiliary.remove_none_keys(dict(item))


            # Serialize the individual field to JSON
            #serialized_item = json.dumps(itemWithoutNone, ensure_ascii=False, indent=4)
            if itemWithoutNone["link"] is None or itemWithoutNone["link"] == "":
                return item
            
            #print(json.dumps(itemWithoutNone, ensure_ascii=False, indent=4))
            # Make a PUT request to the API with the individual field as JSON in the request body
            response = requests.put(api_url, json=itemWithoutNone, headers={'Content-Type': 'application/json'})

            # Check the response status
            if response.status_code == 200:
                print(f'Data sent to API successfully with link {item["link"]}')
            else:
                spider.logger.error(f'Failed to send data to API with status code: {response.status_code} link {item["link"]}')
                spider.logger.error(response.text)
        except Exception as e:
            spider.logger.error(f'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ERROR SENDING: {e} for link {item["link"]}')
            spider.logger.error(f'{item["locations"]}')

        return item

class PackTempDirectoriesPipeline:
    """Packs the scan folders to ZIP files."""

    def close_spider(self, spider):
        for temp_dir in spider.temp_dirs:
            self.pack_item_dirs(temp_dir)
            self.pack_temp_dir(temp_dir)

    def pack_item_dirs(self, temp_dir):
        for item_dir in glob.glob(temp_dir + "/*"):
            with ZipFile(f"{item_dir}.zip", 'w') as zipobject:
                for filepath in glob.glob(item_dir + "/*"):
                    zipobject.write(filepath, os.path.basename(filepath))

            shutil.rmtree(item_dir)

    def pack_temp_dir(self, temp_dir):
        with ZipFile(f"{temp_dir.replace(constants.sd_temp_folder_prefix, '')}.zip", 'w') as zipobject:
            for filepath in glob.glob(temp_dir + "/*"):
                zipobject.write(filepath, os.path.basename(filepath))

        shutil.rmtree(temp_dir)
