

# ArchiveScraper
## Installation
1. Create a virtual environment via `python3 -m venv venv`.
2. Activate the virtual environment via `source venv/bin/activate`.
3. Install the requirements via `pip3 install -r requirements.txt`.
4. Install playwright via `playwright install`.

## Usage
All of the scripts should be run within the newly created virtual environment.

### Scrapy spiders
#### Initial datasets
To download the initial datasets, use batch downloaders (scrapers).
To do that, use `scrapy crawl name_of_scraper`, where `name_of_scraper` 
is a name of one of the files in `spiders/batch_downloaders` directory.

Warning: Some of the batch_downloaders (`archives_registers`, `mza_registers`, 
and `pragapublica_census`) require to have just one of the `start_urls` 
selected at a time. Use that accordingly.

#### Scan-downloader
The spider for downloading scans requires the `json_filepath` argument to 
pass a JSON filepath. The scrapy command line tool allows arguments to be 
specified with a switch `-a`. 

Example usage: `scrapy crawl scan_downloader -a json_filepath=/home/d.json`.

#### Script for downloading registers updates and its scans
A single run of downloading registers updates and newly added registers can 
be started by running the `download_new_registers.py` script. 
Without specifying any arguments, this script downloads only text data. 
Downloading of registers scans can be forced by the `---mode both` argument. 

It is recommended to use the Unix Cron task scheduler to automatically run the script. 
The project contains a script `get_cron_command.py`, which generates a command for 
the user that can be added to the Cron job scheduler configuration file. This command 
will run the update script once a week, always at midnight from Sunday to Monday.

Before working with scripts providing automatic downloading of registers updates,
it is recommended to check and correctly set the date of the last update in the 
file `ad_config.ini`.

### Output 
The output files of the tools are always available in the `ArchiveScraperOutput` folder, 
which is created in the root directory of the project after processing the scripts.
