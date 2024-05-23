"""
Author: Jan Valušek (xvalus03)
Description: Module with constants.
"""

import pathlib
import os
# Output paths
current_script_directory = os.path.dirname(os.path.realpath(__file__))
output_directory_name = os.path.join(current_script_directory, '..', 'ArchiveScraperOutput')

# Auto downloader
sn_auto_downloader = "auto_downloader"
auto_downloader_config_filepath = pathlib.Path(__file__).parent.resolve() / "ad_config.ini"
ad_archives = "https://digi.archives.cz/da/archiv.jsp#archiv_aktualizaci"
ad_ceske_archivy = "https://digi.ceskearchivy.cz/tree.php?doctree=11&id=&menu=0&start=0&hledat=&newsearch=0&mtyph=2&all=all&start1=1"
ad_mza = "https://www.mza.cz/actapublica/aktuality?page=1"
ad_portafontium = "https://www.portafontium.eu/"
ad_pragapublica = "http://katalog.ahmp.cz/pragapublica/pages/aktuality.jsp"

# Scan downloader
sn_scan_downloader = "scan_downloader"
sd_temp_folder_prefix = ".TEMP_"

# Spider names
sn_archives_registers = "archives_registers"
sn_archives_urbariums = "archives_urbariums"
sn_archives_land_books = "archives_land_books"
sn_aron_registers = "aron_registers"
sn_ceskearchivy_registers = "ceskearchivy_registers"
sn_ceskearchivy_census = "ceskearchivy_census"
sn_ceskearchivy_urbariums = "ceskearchivy_urbariums"
sn_ceskearchivy_land_books = "ceskearchivy_land_books"
sn_ebadatelna_registers = "ebadatelna_registers"
sn_ebadatelna_census = "ebadatelna_census"
sn_mza_registers = "mza_registers"
sn_mza_land_registrations = "mza_land_registrations"
sn_mza_urbariums = "mza_urbariums"
sn_mza_urbariums_transcriptions = "mza_urbariums_transcriptions"
sn_mza_census = "mza_census"
sn_mza_rectification_files = "mza_rectification_files"
sn_mza_not_scraped = "mza_not_scraped"
sn_portafontium_registers = "portafontium_registers"
sn_portafontium_urbariums = "portafontium_urbariums"
sn_portafontium_land_books = "portafontium_land_books"
sn_portafontium_census = "portafontium_census"
sn_pragapublica_census = "pragapublica_census"
sn_pragapublica_registers = "pragapublica_registers"
sn_vademecum_registers = "vademecum_registers"
sn_vademecum_urbariums = "vademecum_urbariums"
sn_vademecum_land_books = "vademecum_land_books"
sn_vademecum_census = "vademecum_census"

# Types of archives
t_register = "MATRIKA"
t_land_registration = "LANOVY_REJSTRIK"
t_urbarium = "URBAR"
t_census = "SCITACI_OPERATOR"
t_rectification_file = "REKTIFIKACNI_AKTA"
t_land_book = "POZEMKOVA_KNIHA"

# Name of archives
a_archives = "Zemský archiv v Opavě"
a_aron = "Státní oblastní archiv v Hradci Králové"
a_ceskearchivy = "Státní oblastní archiv v Třeboni"
a_ebadatelna = "Státní oblastní archiv v Praze"
a_mza = "Moravský zemský archiv v Brně"
a_portafontium = "Státní oblastní archiv v Plzni"
a_pragapublica = "Archiv hlavního města Prahy"
a_vademecum = "Státní oblastní archiv v Litoměřicích"

# Host dict
host_dict = {
    a_archives: "digi.archives.cz",
    a_aron: "aron.vychodoceskearchivy.cz",
    a_ceskearchivy: "digi.ceskearchivy.cz",
    a_ebadatelna: "ebadatelna.soapraha.cz",
    a_mza: "www.mza.cz",
    a_portafontium: "www.portafontium.eu",
    a_pragapublica: "katalog.ahmp.cz",
    a_vademecum: "vademecum.soalitomerice.cz",
}

# Languages
czech_set = {"Česky", "česky", "Čeština", "čeština", "CZ", "Cz", "cz", "CZE", "Cze", "cze", "čes"}
l_czech = "čeština"
latin_set = {"Latinsky", "latinsky", "Latina", "latina", "LA", "La", "la", "LAT", "Lat", "lat"}
l_latin = "latina"
german_set = {"Německy", "německy", "Němčina", "němčina", "DE", "De", "de", "GER", "Ger", "ger", "něm"}
l_german = "němčina"
polish_set = {"Polsky", "polsky", "Polština", "polština", "PL", "Pl", "pl", "POL", "Pol", "pol", }
l_polish = "polština"
languages_dict = {
    **dict.fromkeys(czech_set, l_czech),
    **dict.fromkeys(latin_set, l_latin),
    **dict.fromkeys(german_set, l_german),
    **dict.fromkeys(polish_set, l_polish),
}
