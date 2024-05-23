"""
@file
@brief Module with clustering functions for mergins datasets
@author Pavel Sestak
@date 27.1.2024
@University VUT FIT BRNO
"""

from geopy.distance import geodesic
from geopy.point import Point
def compute_center(points):
    """
    @brief Computes the center of a list of points.

    @param points: A list of Point objects.
    @return: The center point or None, when invalid argument passed.
    """
    if not points:
        return None
    center = Point(
        sum(point.latitude for point in points) / len(points), 
        sum(point.longitude for point in points) / len(points)
    )

    return center

def remove_farthest(points, center):
    """
    @brief Removes the farthest point from a list of points relative to a center point.

    @param points: A list of Point objects.
    @param center: The center Point to calculate distances from.
    """
    distances = [geodesic((point.latitude, point.longitude), (center["latitude"], center["longitude"])) for point in points]
    
    farthest_index = distances.index(max(distances))
    del points[farthest_index]

def find_nearest_point(center, points):
    """
    @brief Finds the nearest point to a given center point among a list of points.

    @param center: The center Point to calculate distances from.
    @param points: A list of Point objects.

    @return: The nearest Point to the center.
    """
    distances = [geodesic((point.latitude, point.longitude), (center.latitude, center.longitude)).kilometers for point in points]
    
    # Find the index of the nearest point
    nearest_index = distances.index(min(distances))
    
    # Return the nearest point
    return points[nearest_index]

def iterative_clustering(covered_areas, center):
    """
    @brief Iteratively refines the cluster center by removing the farthest points from each covered area.

    @param covered_areas: A list of dictionaries, each containing a 'locations' key with a list of Point objects.
    @param center: The central location (Point) around which clustering is performed.

    @return: center (Modifies the input covered_areas in-place by updating the locations to contain only nearest points to center.)
    """

    all_points = [center]
    for area in covered_areas:
        all_points.extend(area["locations"])
    
    # Iterativní odstraňování nejvzdálenějších bodů
    while any(len(area["locations"]) > 1 for area in covered_areas):
        
        center = compute_center(all_points)

        for i, area in enumerate(covered_areas):
            if len(area["locations"]) > 1:
                remove_farthest(area["locations"], center)
    return center

def iterative_clustering2(covered_areas, center):
    """
    @brief Iteratively refines the cluster center by updating the midpoint based on the nearest points from each covered area.

    @param covered_areas: A list of dictionaries, each containing a 'locations' key with a list of Point objects.
    @param center: The central location (Point) around which clustering is performed.

    @return: None (Modifies the input covered_areas in-place by updating the locations to contain only nearest points.)
    """
    currentMidpoint = center
    previousMidpoint = None

    while currentMidpoint != previousMidpoint:
        previousMidpoint = currentMidpoint
        
        nearestPoints = [center]
        for area in covered_areas:
            if len(area["locations"]) > 0:
                nearest_point = find_nearest_point(currentMidpoint, area["locations"])
                nearestPoints.append(nearest_point)
            #elif len(area["locations"]) == 1:
            #    nearestPoints.append(area["locations"][0])

        currentMidpoint = compute_center(nearestPoints)

    for area in covered_areas:
        if len(area["locations"]) > 1:
            area["locations"] = [find_nearest_point(currentMidpoint, area["locations"])]


def get_nearest_points(covered_areas, center):
    """
    @brief Finds the nearest points in each covered area to the specified central location.

    @param covered_areas: A list of dictionaries, each containing a 'locations' key with a list of Point objects.
    @param center: The central location (Point) to which nearest points in each area will be computed.

    @return: None (Modifies the input covered_areas in-place by updating the locations to contain only nearest points.)
    """
    for area in covered_areas:
        if len(area["locations"]) > 1:
            area["locations"] = [find_nearest_point(center, area["locations"])]


