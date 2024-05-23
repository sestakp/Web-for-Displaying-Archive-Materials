#!/bin/bash

#Author: Pavel Sestak

cd /app
scrapy crawl archives_land_books
scrapy crawl archives_registers_olomouc
scrapy crawl archives_registers_opava
scrapy crawl archives_urbariums
scrapy crawl aron_registers
scrapy crawl ceskearchivy_census
scrapy crawl ceskearchivy_land_books
scrapy crawl ceskearchivy_registers
scrapy crawl ceskearchivy_urbariums
scrapy crawl ebadatelna_census
scrapy crawl ebadatelna_registers
scrapy crawl mza_census
scrapy crawl mza_land_registrations
scrapy crawl mza_rectification_files
scrapy crawl mza_registers
scrapy crawl mza_urbariums_transcriptions
scrapy crawl mza_urbariums
scrapy crawl portafontium_census
scrapy crawl portafontium_land_books
scrapy crawl portafontium_registers
scrapy crawl portafontium_urbariums
scrapy crawl pragapublica_census_A
scrapy crawl pragapublica_census_B
scrapy crawl pragapublica_census_C
scrapy crawl pragapublica_census_D
scrapy crawl pragapublica_census_E
scrapy crawl pragapublica_census_F
scrapy crawl pragapublica_census_G
scrapy crawl pragapublica_registers_A
scrapy crawl pragapublica_registers_B
scrapy crawl vademecum_census
scrapy crawl vademecum_land_books
scrapy crawl vademecum_registers
scrapy crawl vademecum_urbariums