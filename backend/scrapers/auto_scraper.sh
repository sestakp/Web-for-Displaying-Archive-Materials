#!/bin/bash

# List of spiders to crawl
spiders=(
    "archives_land_books"
    "archives_registers_olomouc"
    "archives_registers_opava"
    "archives_urbariums"
    "aron_registers"
    "ceskearchivy_census"
    "ceskearchivy_land_books"
    "ceskearchivy_registers"
    "ceskearchivy_urbariums"
    "ebadatelna_census"
    "ebadatelna_registers"
    "mza_census"
    "mza_land_registrations"
    "mza_rectification_files"
    "mza_registers"
    "mza_urbariums"
    "mza_urbariums_transcriptions"
    "portafontium_census"
    "portafontium_land_books"
    "portafontium_registers"
    "portafontium_urbariums"
    "pragapublica_census_A"
    "pragapublica_census_B"
    "pragapublica_census_C"
    "pragapublica_census_D"
    "pragapublica_census_E"
    "pragapublica_census_F"
    "pragapublica_census_G"
    "pragapublica_registers_A"
    "pragapublica_registers_B"
    "vademecum_census"
    "vademecum_land_books"
    "vademecum_registers"
    "vademecum_urbariums"
)

# Loop through each spider and run the scrapy crawl command
for spider in "${spiders[@]}"; do
    echo "Starting crawl for spider: $spider"
    scrapy crawl "$spider"  # Execute the scrapy crawl command
done
