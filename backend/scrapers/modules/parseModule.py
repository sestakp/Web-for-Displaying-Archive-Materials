"""
@file
@brief Module with parsing functions for mergins datasets
@author Pavel Sestak
@date 27.1.2024
@University VUT FIT BRNO
"""

import argparse
import re

def parse_arguments():
    parser = argparse.ArgumentParser(description='Process records.')
    parser.add_argument('--parallel', action='store_true', help='Run in parallel')
    return parser.parse_args()

def extract_first_number(s):
    """
    @brief Extract the first integer from a given string.

    @param s: The input string.
    @return: The first integer found in the string or None if no integer is found.

    This function uses regular expression to find the first occurrence of an integer in the input string.
    If a match is found, the matched integer is returned. If no integer is found, None is returned.

    Example:
    ```python
    result = extract_first_number("abc 123 xyz")
    print(result)  # Output: 123
    ```
    """
    # Use regular expression to find the first number in the string
    match = re.search(r'\b\d+\b', str(s))

    if match:
        # Convert the matched number to an integer and return it
        return int(match.group())

    # Return None if no number is found
    return None

def extract_numbers(input_string):
    """
    @brief Extract all integers from a given string.

    @param input_string: The input string.
    @return: A list containing all integers found in the string or [None, None] if no integers are found.

    This function uses regular expression to find all occurrences of integers in the input string.
    The extracted integers are returned in a list. If no integers are found, the function returns [None, None].

    Example:
    ```python
    result = extract_numbers("abc 123 xyz 456")
    print(result)  # Output: [123, 456]
    ```
    """

    if input_string is None:
        return [None, None]
    # Use regular expression to find all numbers in the string
    numbers = [int(match) for match in re.findall(r'\b\d+\b', input_string)]

    padded_array = (numbers + [None] * (2 - len(numbers)))[:2]

    return padded_array

def parseAddress(address):
    """
    @brief Parse address information from a OpenStreetMap Nominatium geocoding response.

    @param address: The address information obtained from OpenStreetMap Nominatium geocoding response.
    @return: A dictionary containing parsed address information.

    This function takes the address information obtained from a OpenStreetMap Nominatium geocoding response
    and extracts relevant components such as region, municipality, country, borough, and district.
    The parsed information is returned as a dictionary.

    Example:
    ```python
    geocoding_result = {
        "address": {
            "county": "Example County",
            "village": "Example Village",
            "country": "Example Country",
            "suburb": "Example Suburb",
            "municipality": "Example Municipality"
        }
    }

    parsed_address = parse_address(geocoding_result)
    print(parsed_address)
    # Output: {'region': 'Example County', 'municipality': 'Example Village', 'country': 'Example Country', 'borough': 'Example Suburb', 'district': 'Example Municipality'}
    ```
    
    """

    try:
        if address["address"]["country"] == "Česko":
            return {
                "country": address["address"]["country"],  # Země
                "region": address["address"].get("county", None),  # Kraj
                "district": address["address"].get("municipality", None),  # Okres
                "municipality": address["address"].get("village", address["address"].get("town",  address["address"].get("city", None))),  # Obec
                "borough": address["address"].get("suburb", None),  # Část obce
                "latitude": address["lat"],
                "longitude": address["lon"]
            }
        elif (address["address"]["country"] == "Polsko") or (address["address"]["country"] == "Slovensko"):
            return {
                "country": address["address"]["country"],  # Země
                "region": address["address"].get("state", None),  # Kraj
                "district": address["address"].get("county", None),  # Okres
                "municipality": address["address"].get("village", address["address"].get("town", None)),  # Obec
                "borough": address["address"].get("suburb", None),  # Část obce
                "latitude": address["lat"],
                "longitude": address["lon"]
            }
        """
        return {
                "region": address["address"].get("county", address["address"].get("state", None)),
                "municipality": address["address"].get("village", address["address"].get("town", None)),
                "country": address["address"]["country"],
                "borough": address["address"].get("suburb", None),
                "district": address["address"].get("municipality", address["address"].get("state", None)),
            }
        """
    except Exception as e: 
        print("error while parsing: ", address["address"])
        print("error while parsing: ", e)
        return None

def parseDeseasedIndex(param):
    """
    @brief Parse deceased index information.

    @param param: A list of strings containing deceased index information.
    @return: A list of two integers representing the start and end values of the deceased index.

    This function takes a list of strings containing deceased index information, extracts
    the relevant numbers associated with the index range, and returns a padded list of two integers
    representing the start and end values of the deceased index.

    Example:
    ```python
    index_info = ["I-Z 123", "Some other text", "I-Z 456"]
    
    parsed_index = parse_deceased_index(index_info)
    print(parsed_index)
    # Output: [123]
    ```
    
    @warning: This function stops processing after finding the first match.
    """
    
    if param is None:
        return [None, None]
    
    numbers = []
    for text in param:
        if "I-Z" in text:
            numbers = extract_numbers(text)
            break
    padded_array = (numbers + [None] * (2 - len(numbers)))[:2]

    return padded_array

def parseBorn(param):
    """
    @brief Parse birth information.

    @param param: A list of strings containing birth information.
    @return: A list of two integers representing the start and end values of the birth information.

    This function takes a list of strings containing birth information, extracts the relevant numbers
    associated with the birth range, and returns a padded list of two integers representing the start
    and end values of the birth information.

    Example:
    ```python
    birth_info = ["N 123", "Some other text", "N 456"]
    
    parsed_birth = parse_born(birth_info)
    print(parsed_birth)
    # Output: [123]
    ```
    
    @warning: This function stops processing after finding the first match.
    """
    if param is None:
        return [None, None]
    
    numbers = []
    for text in param:
        if "N" in text and "I-N" not in text:
            numbers = extract_numbers(text)
            break

    padded_array = (numbers + [None] * (2 - len(numbers)))[:2]

    return padded_array

def parseBornIndex(param):
    """
    @brief Parse birth index information.

    @param param: A list of strings containing birth index information.
    @return: A list of two integers representing the start and end values of the birth index information.

    This function takes a list of strings containing birth index information, extracts the relevant numbers
    associated with the birth index range, and returns a padded list of two integers representing the start
    and end values of the birth index information.

    Example:
    ```python
    born_index_info = ["I-N 123", "Some other text", "I-N 456"]
    
    parsed_born_index = parse_born_index(born_index_info)
    print(parsed_born_index)
    # Output: [123]
    ```
    
    @warning: This function stops processing after finding the first match.
    """
     
    if param is None:
        return [None, None]
    
    
    numbers = []
    for text in param:
        if "I-N" in text:
            numbers = extract_numbers(text)
            break
    
    padded_array = (numbers + [None] * (2 - len(numbers)))[:2]
    return padded_array

def parseDeseased(param):
    """
    @brief Parse deceased information.

    @param param: A list of strings containing deceased information.
    @return: A list of two integers representing the start and end values of the deceased information.

    This function takes a list of strings containing deceased information, extracts the relevant numbers
    associated with the deceased range, and returns a padded list of two integers representing the start
    and end values of the deceased information.

    Example:
    ```python
    deceased_info = ["Z 123", "Some other text", "Z 456"]
    
    parsed_deceased = parse_deceased(deceased_info)
    print(parsed_deceased)
    # Output: [123]
    ```

    @warning: This function stops processing after finding the first match.
    """
    if param is None:
        return [None, None]
    
    numbers = []
    for text in param:
        if "Z" in text and "I-Z" not in text:
            numbers = extract_numbers(text)
            break
    
    padded_array = (numbers + [None] * (2 - len(numbers)))[:2]
    return padded_array

def parseMarried(param):
    """
    @brief Parse married information.

    @param param: A list of strings containing married information.
    @return: A list of two integers representing the start and end values of the married information.

    This function takes a list of strings containing married information, extracts the relevant numbers
    associated with the married range, and returns a padded list of two integers representing the start
    and end values of the married information.

    Example:
    ```python
    married_info = ["O 123", "Some other text", "O 456"]
    
    parsed_married = parse_married(married_info)
    print(parsed_married)
    # Output: [123]
    ```

    @warning: This function stops processing after finding the first match.
    """
    if param is None:
        return [None, None]
    
    numbers = []
    for text in param:
        if "O" in text and "I-O" not in text:
            numbers = extract_numbers(text)
            break
    
    padded_array = (numbers + [None] * (2 - len(numbers)))[:2]
    return padded_array

def parseMarriedIndex(param):
    """
    @brief Parse married index information.

    @param param: A list of strings containing married index information.
    @return: A list of two integers representing the start and end values of the married index information.

    This function takes a list of strings containing married index information, extracts the relevant numbers
    associated with the married index range, and returns a padded list of two integers representing the start
    and end values of the married index information.

    Example:
    ```python
    married_index_info = ["I-O 123", "Some other text", "I-O 456"]
    
    parsed_married_index = parse_married_index(married_index_info)
    print(parsed_married_index)
    # Output: [123]
    ```

    @warning: This function stops processing after finding the first match.
    """
    
    if param is None:
        return [None, None]
    
    numbers = []
    for text in param:
        if "I-O" in text:
            numbers = extract_numbers(text)
            break
    
    padded_array = (numbers + [None] * (2 - len(numbers)))[:2]
    return padded_array


def remove_roman_prefix(input_string):
    """
    @brief Removes the substring "<roman_number>-" from the given string.

    @param input_string: The input string from which to remove the substring.
    @return: The input string with the "<roman_number>-" substring removed.
    """
    # Define the pattern for matching "<roman_number>-"
    pattern = re.compile(r'<[IVXLCDM]+>-', re.IGNORECASE)
    
    # Use sub() method to remove the matched pattern
    result_string = re.sub(pattern, '', input_string)
    
    return result_string

def remove_substring_country(country_string):
    """
    @brief Remove a specific substring from the given country string.

    @param country_string: The input string representing a country.
    @return: The modified string after removing the specified substring.
    """
    substrings_to_remove = [" : nižší sídelní jednotka", " : zaniklo"]
    for substring in substrings_to_remove:
        country_string = country_string.replace(substring, '')
    return country_string