import berniRulaImg from "../assets/archivalCategoryIcons/berni_rula.png"
import lanoveRejstrikyImg from "../assets/archivalCategoryIcons/lanove_rejstriky.png"
import matrikyImg from "../assets/archivalCategoryIcons/matriky.png"
import rektifikacniAktaImg from "../assets/archivalCategoryIcons/rektifikacni_akta.png"
import pozemkoveKnihyImg from "../assets/archivalCategoryIcons/pozemkove_knihy.png"
import scitaciOperatyImg from "../assets/archivalCategoryIcons/scitaci_operaty.png"
import soupisPoddanychDleViryImg from "../assets/archivalCategoryIcons/soupis_poddanych_dle_viry.png"
import urbareImg from "../assets/archivalCategoryIcons/urbare.png"
import obceImg from "../assets/archivalCategoryIcons/obce.png"
import ArchivalCategory from "../models/ArchivalCategory"
import TypeOfRecordEnum from "../models/TypeOfRecordEnum"


const categories: ArchivalCategory[] = [
    {
        name: "Berní rula",
        icon: berniRulaImg,
        description: "Berní rula je soupis daňových povinností poddaných a jejich majetku z území Čech.",
        type: TypeOfRecordEnum.BERNI_RULA,
        linkName: "berni-rula"
    },
    {
        name: "Lánové rejstříky",
        icon: lanoveRejstrikyImg,
        description: "Lánové rejstříky jsou soupis daňových povinností poddaných a jejich majetku z území Moravy.",
        type: TypeOfRecordEnum.LANOVY_REJSTRIK,
        linkName: "lanove-rejstriky"
    },    
    {
        name: "Matriky",
        icon: matrikyImg,
        description: "Matriky jsou veřejné úřední seznamy narození, sňatků a úmrtí.",
        type: TypeOfRecordEnum.MATRIKA,
        linkName: "matriky"
    },
    {
        name: "Rektifikační akta",
        icon: rektifikacniAktaImg,
        description: "Rektifikační akta jsou zdrojem informací o vlastnictví a výměře pozemků na Moravě v 18. století.",
        type: TypeOfRecordEnum.REKTIFIKACNI_AKTA,
        linkName: "rektifikacni-akta"
    },
    {
        name: "Pozemkové knihy",
        icon: pozemkoveKnihyImg,
        description: "Pozemkové knihy jsou úřední seznamy o nemovitostech a jejich příslušných právech.",
        type: TypeOfRecordEnum.POZEMKOVA_KNIHA,
        linkName: "pozemkove-knihy"
    },
    {
        name: "Sčítací operáty",
        icon: scitaciOperatyImg,
        description: "Sčítací operáty jsou soupisy obyvatel, které sloužily především k vojenským a daňovým účelům.",
        type: TypeOfRecordEnum.SCITACI_OPERATOR,
        linkName: "scitaci-operaty"
    },
    {
        name: "Soupis poddaných dle víry",
        icon: soupisPoddanychDleViryImg,
        description: "Soupis poddaných dle víry je soupis poddaných z území Čech podle jejich náboženské příslušnosti.",
        type: TypeOfRecordEnum.SOUPIS_PODDANYCH_DLE_VIRY,
        linkName: "soupis-poddanych-dle-viry"
    },
    {
        name: "Urbáře",
        icon: urbareImg,
        description: "Urbáře jsou soupisy povinností a práv poddaných vůči jejich vrchnosti.",
        type: TypeOfRecordEnum.URBAR,
        linkName: "urbare"
    },
    {
        name: "Obce",
        icon: obceImg,
        description: "Vyhledávání všech typů archiválií dle zvolené obce.",
        type: TypeOfRecordEnum.OBEC,
        linkName: "vyhledat"
    }
    
]

export default categories