"""
@file
@brief Module with location functions for mergins datasets
@author Pavel Sestak
@date 27.1.2024
@University VUT FIT BRNO
"""

from geopy.geocoders import Nominatim
import os
import requests
from diskcache import Cache
from geopy.point import Point
import sys

CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache", "location")
cache = Cache(CACHE_DIR)
os.makedirs(CACHE_DIR, exist_ok=True)

geolocator = Nominatim(user_agent="my_geocoder")

@cache.memoize()
def mapy_cz_geocode(address, center = None):
    """
    @brief Geocode the specified address using Mapy.cz API.

    @param address: The address to be geocoded.
    @param center: Point location of archive
    @return: Geocoding result in JSON format or None in case of an error.

    This function performs geocoding using the Mapy.cz API. It requires an API key, which should be stored
    in the environment variable 'SEZNAM_API_KEY'. Ensure that your API key is correctly set in your '.env' file.

    The function utilizes diskcache (@cache.memoize()) to cache the geocoding results. Cached results are stored
    based on the input address, and subsequent requests with the same address will retrieve the result from the cache,
    reducing the need for repeated API calls.

    @note: Make sure to replace 'YOUR_API_KEY' with your actual API key from Mapy.cz in the 'SEZNAM_API_KEY' environment variable.
    """

    # Replace 'YOUR_API_KEY' with your actual API key from Mapy.cz
    api_key = os.getenv("SEZNAM_API_KEY")
    base_url = 'https://api.mapy.cz/geocode'


    preferNear = None
    if center is not None:
        preferNear = [center.latitude, center.longitude]

    params = {
        'query': address,
        'format': 'json',
        'key': api_key,
        'limit': 5,
        'lang': 'cs',
        'type': 'regional',
        'preferNear': preferNear,
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        result_data = response.json()
        return result_data
    else:
        print(f"Error: {response.status_code}")
        return None
    
@cache.memoize()
def get_location_info(address, center = None):
    """
    @brief Retrieve location information for the specified address using geocoding.

    @param address: The address for which location information is requested.
    @param center: Point location of archive
    @return: A list of location results or an empty list if the location is not found.

    This function utilizes geocoding to retrieve location information for the given address.
    The geocoding is performed using the Nominatim geocoding service with the 'geopy' library.

    The function includes caching functionality provided by diskcache (@cache.memoize()).
    Cached results are stored based on the input address, and subsequent requests with the same address
    will retrieve the result from the cache, reducing the need for repeated geocoding requests.

    """
    address = address.replace('<#manual>', '')
    try:

        viewbox = None
        if center is not None:
            #todo... set to archive
            reference_point = Point(center.latitude, center.longitude)

            # Bounding box dimensions (degrees of latitude and longitude)
            bbox_size = 3  # Adjust as needed

            # Calculate the viewbox
            viewbox = [
                Point(
                    latitude=reference_point.latitude - bbox_size,
                    longitude=reference_point.longitude - bbox_size
                ),
                Point(
                    latitude=reference_point.latitude + bbox_size,
                    longitude=reference_point.longitude + bbox_size
                ),
            ]


        #featuretype='settlement'
        location_results = geolocator.geocode(address, exactly_one=False, timeout=60, language='cs', viewbox=viewbox, bounded=True, addressdetails=True)
    
    except Exception as e:
        print(f"Geocoding request error: {e} for location: {address}", file=sys.stderr)
        location_results = None

    if location_results:
        return location_results
    else:
        print(f"Location not found for: {address}", file=sys.stderr)
        
        return []