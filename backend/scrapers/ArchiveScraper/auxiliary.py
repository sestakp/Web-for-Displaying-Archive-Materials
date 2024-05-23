"""
Author: Jan Valušek (xvalus03)
Description: Module with auxiliary functions.

@Modified by Pavel Sestak (xsesta07)
"""

from ArchiveScraper import constants
import re
from ArchiveScraper.constants import host_dict


def get_city_from_archive(archive):

    if archive == constants.a_archives:
        return "Opava"
    
    if archive == constants.a_aron:
        return "Hradec Králové"
    
    if archive == constants.a_ceskearchivy:
        return "Třeboň"
    
    if archive == constants.a_ebadatelna:
        return "Praha"  
      
    if archive == constants.a_mza:
        return "Brno"    
    
    if archive == constants.a_portafontium:
        return "Plzeň"    
    
    if archive == constants.a_pragapublica:
        return "Praha"   
     
    if archive == constants.a_vademecum:
        return "Litoměřice"    




def string_to_dir_name(as_str):
    """
    Replaces the '/' character with '-'
    so the string can be used as a directory name.
    """
    return as_str.replace("/", "-")


def parse_years(years_string):
    """Parses years from the year_string,
    returns the min year and the max year."""
    if not years_string:
        return None, None

    years_as_str = re.findall(r"\d\d\d\d", years_string)
    if len(years_as_str) == 0:
        return None, None

    years = [int(y) for y in years_as_str]
    return min(years), max(years)


def remove_special_chars(text):
    # Define a translation table mapping special characters to their respective replacements

    if text is None:
        return None
    
    translation_table = {
        'á': 'a',
        'č': 'c',
        'ď': 'd',
        'é': 'e',
        'ě': 'e',
        'í': 'i',
        'ň': 'n',
        'ó': 'o',
        'ř': 'r',
        'š': 's',
        'ť': 't',
        'ú': 'u',
        'ů': 'u',
        'ý': 'y',
        'ž': 'z',
        'Á': 'A',
        'Č': 'C',
        'Ď': 'D',
        'É': 'E',
        'Ě': 'E',
        'Í': 'I',
        'Ň': 'N',
        'Ó': 'O',
        'Ř': 'R',
        'Š': 'S',
        'Ť': 'T',
        'Ú': 'U',
        'Ů': 'U',
        'Ý': 'Y',
        'Ž': 'Z',
        ' ': '_',
        # Add more special characters and their replacements as needed
    }
    # Replace special characters with their replacements
    for char, replacement in translation_table.items():
        text = text.replace(char, replacement)
    return text

def get_languages_array(lang_str):
    """Returns languages aray from string."""
    if "část" in lang_str:  # ebadatelna: "část česky, část německy a část latinsky"
        langs = [lang.strip() for lang in lang_str.replace("část", '').replace(' a ', ',').split(',')]
    elif len(lang_str.split(",")) > 1:
        langs = [lang.strip() for lang in lang_str.split(',')]
    elif len(lang_str.split("/")) > 1:
        langs = [lang.strip() for lang in lang_str.split('/')]
    elif len(lang_str.split(".")) > 1:
        langs = [lang.strip() for lang in lang_str.split('.')]
    else:
        langs = [lang_str.strip()]

    clean_langs = [constants.languages_dict[lang] if lang in constants.languages_dict else lang for lang in langs if lang]

    if len(clean_langs) == 1 and clean_langs[0] == "neuvedeno":
        clean_langs = None

    return clean_langs


def get_locations_dict(country=None, region=None, district=None, municipality=None,
                          borough=None, german_name=None, alternative_names: list = None):
    """Returns covered area dictionary."""
    locations_dict = {
        "country": country,
        "region": region,
        "district": district,
        "municipality": municipality,
        "borough": borough,
        "german_name": german_name,
        "alternative_names": alternative_names
    }

    return locations_dict

def remove_none_keys(obj):
    if isinstance(obj, dict):
        return {key: remove_none_keys(value) for key, value in obj.items() if value is not None}
    elif isinstance(obj, list):
        return [remove_none_keys(item) for item in obj]
    else:
        return obj
            
def get_custom_settings_dict_with_request_headers(archive_name):
    """
    Returns custom scrapy settings with headers
    corresponding with archive_name.
    """
    host_name = host_dict[archive_name]

    return {
        "DEFAULT_REQUEST_HEADERS": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8,sk;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Host": host_name,
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Linux",
        },
        "CONCURRENT_REQUESTS": 1,
        "DOWNLOAD_DELAY": 0,
    }


def get_url_without_params(url):
    """
    Cuts parameters part from the url.
    """

    url_split = url.split("?", 1)
    if url_split:
        return url_split[0]
    else:
        return url


def add_to_item_if_not_none(response, archive_item, field, xpath):
    """
    Adds text gotten from xpath to the archive_items field,
    or adds None to the field if it was not found.
    """

    text = response.xpath(xpath).get()
    archive_item[field] = strip_or_return_none(text)


def strip_or_return_none(text):
    """
    Strips the string.
    Returns None if the resulting string is None/empty.
    """
    empty_string = ['', '-', "---"]

    if text and text.strip().replace('\r', '\n').replace(u'\xa0', '') not in empty_string:
        return text.strip().replace('\r', '\n').replace(u'\xa0', '')
    else:
        return None
