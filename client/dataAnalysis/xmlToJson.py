
#from lxml import etree
import xml.etree.ElementTree as ET
import json

def xml_to_json(xml_string):
    root = ET.fromstring(xml_string)

    result = {"zdroj": root.attrib.get("zdroj", "")}
    matriky_list = []

    for kniha_elem in root.findall("kniha"):
        matrika = {"puvodce": kniha_elem.find("puvodce").attrib.get("jmeno", ""),
                   "signatura": kniha_elem.attrib.get("signatura", ""),
                   "obsah": {},
                   "snimky": {},
                   "obce_seznam": []}

        for typ_elem in kniha_elem.findall(".//typ"):
            typ_name = typ_elem.attrib.get("nazev", "")

            if typ_elem.find("rozsah") is not None:
                matrika["obsah"][typ_name] = { "od": typ_elem.find("rozsah").attrib.get("od", ""),
                                            "do": typ_elem.find("rozsah").attrib.get("do", "")}

        snimky_elem = kniha_elem.find("snimky")
        if snimky_elem is not None:
            matrika["snimky"]["jmeno"] = f"{matrika['signatura']}_{snimky_elem.attrib.get('pocet', '')}"
            matrika["snimky"]["url"] = [snimek.text for snimek in snimky_elem.findall("snimek")]

        obce_elem = kniha_elem.find("obce")
        if obce_elem is not None:
            obce_list = [obec.text for obec in obce_elem.findall("obec")]
            matrika["obce_seznam"] = obce_list


        matriky_list.append(matrika)

    result["matriky"] = matriky_list
    return result

absPath = r'C:\Users\Pavel\Desktop\projects\but-fit-master-thesis\data\datasets\matriky\actapublica\actapublica.xml'
# Parse the XML file
#tree = etree.parse(absPath)
#root = tree.getroot()

#json_data = xml2dict(root)
with open(absPath, 'r', encoding='utf-8') as xml_file:
    xml_string = xml_file.read()

#print(xml_string)
json_data = xml_to_json(xml_string)
with open('actapublica.json', 'w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, indent=4, ensure_ascii=False)
