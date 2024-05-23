"""
Author: Jan Valušek (xvalus03)
Description: Module with Scrapy items.
"""

from scrapy import Item, Field


class ArchiveItem(Item):
    # General info
    typeOfRecord = Field()
    archive = Field()
    fundName = Field()
    fundCode = Field()
    signature = Field()
    nad = Field()
    inventoryNumber = Field()
    languages = Field()  # Array
    numberOfScans = Field()
    otherNote = Field()
    link = Field()
    locations = Field()  # Array of dictionaries
    yearFrom = Field()
    yearTo = Field()
    content = Field()
    description = Field()
    scans = Field()

    # Registers specifics
    originatorName = Field()
    originatorType = Field()
    yearBornFrom = Field()
    yearBornTo = Field()
    yearBornIndexFrom = Field()
    yearBornIndexTo = Field()
    yearMarriedFrom = Field()
    yearMarriedTo = Field()
    yearMarriedIndexFrom = Field()
    yearMarriedIndexTo = Field()
    yearDeceasedFrom = Field()
    yearDeceasedTo = Field()
    yearDeceasedIndexFrom = Field()
    yearDeceasedIndexTo = Field()
    registerNote = Field()
    originatorNote = Field()

    # Census specifics
    yearTaken = Field()
    judicialDistrict = Field()
    landRegistryNrs = Field()
    #persons_counted = Field()  # Array (not used)

    # Land registrations / urbariums / list of subjects specifics
    indexOnly = Field()  # Pouze index u urbářů a pozemkových knih v archivesu
    specificType = Field()  # Typ knihy u pozemkovych knih v Archivesu
    recordMethod = Field()  # Způsob zápisu u urbářů a pozemkových knih v Archives
    originalName = Field()
    name = Field()
