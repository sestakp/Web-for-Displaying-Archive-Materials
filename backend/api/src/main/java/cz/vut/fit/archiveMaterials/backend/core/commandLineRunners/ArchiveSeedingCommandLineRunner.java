package cz.vut.fit.archiveMaterials.backend.core.commandLineRunners;


import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.enums.ArchiveState;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ArchiveRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CommandLineRunner implementation for seeding initial data into the {@link ArchiveRepository}.
 *
 * <p>This class is responsible for checking if the archive table is empty and, if so, seeding initial data into it.</p>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ArchiveSeedingCommandLineRunner implements CommandLineRunner {

    private final ArchiveRepository archiveRepository;

    /**
     * Runs the seeding process during the application startup.
     *
     * <p>This method checks if the archive table is empty and, if so, seeds initial data into it. In this example,
     * it adds an entry for "Moravský zemský archiv v Brně" if the table is empty.</p>
     *
     * @param args Command-line arguments passed to the application.
     * @throws Exception If an error occurs during the seeding process.
     */
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Check if the table is empty
        //https://www.portafontium.eu/cbguide/cze
        if (archiveRepository.count() == 0) {
            // Seed your data here
            var mza = new Archive();
            mza.setName("Moravský zemský archiv v Brně");
            mza.setAbbreviation("MZA Brno");
            mza.setState(ArchiveState.CZECH_REPUBLIC);
            mza.setDescription("Moravský zemský archiv v Brně byl zřízen v roce 1839 moravskými stavy. Jeho prvotním cílem, jak se jej snažil naplňovat první stavy jmenovaný zemský archivář Antonín Boček, byl systematický výzkum a vyhledávání archivních pramenů k dějinám Moravy, případně jejich získávání koupí, formou přepisů či výpisů.");
            mza.setAddress("Palachovo nám. 723/1, 625 00 Brno-Starý Lískovec");
            archiveRepository.save(mza);

                    /*var sokaJihlava = new Archive();
                    sokaJihlava.setName("Státní okresní archiv Jihlava");
                    sokaJihlava.setAbbreviation("SOkA Jihlava");
                    sokaJihlava.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaJihlava.setDescription("Základem archiv byl jihlavský městský archiv, který se začal formovat v polovině 19. století. První archivní pomůcky k nejstarším městským písemnostem vytvořil v letech 1853–1871 tehdejší starosta Peter Ernst z Löwenthalu. Další významné uspořádání pochází od Bertholda Bretholze z r. 1907. Místem původního uložení archivních dokumentů byla radnice. V r. 1925 byl archiv přestěhován do původního jezuitského gymnázia, po druhé světové válce potom do budovy vedle radnice. Po vzniku Jednotného národního výboru Jihlava v r. 1949 se městský archiv stal archivem tohoto úřadu a začal plnit funkce okresního archivu pod vedením předního archiváře dr. Františka Hoffmanna. V souvislosti s reorganizací státní správy v r. 1960 se působnost archivu rozšířila i na oblast bývalého okresu Třešť a na oblast Polenska. K poslední změně sídla archivu došlo v r. 1999, kdy byla pro jeho potřeby adaptována stávající budova, doplněná v r. 2004 o další budovu pro depositáře, pořádací místnosti a restaurátorskou dílnu. Po zrušení posledních depositářů v Telči a Sedlejově v r. 2005 byly již všechny archiválie umístěný pouze v sídle archivu.");
                    sokaJihlava.setAddress("Fritzova 19, 586 01 Jihlava");
                    archiveRepository.save(sokaJihlava);

                    var sokaTrebic = new Archive();
                    sokaTrebic.setName("Státní okresní archiv Třebíč");
                    sokaTrebic.setAbbreviation("SOkA Třebíč");
                    sokaTrebic.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaTrebic.setDescription("Základem dnešního okresního archivu v Třebíči je starobylý městský archiv Třebíče. V minulosti vykazoval velkou obsahovou bohatost, ale značně utrpěl požárem města v roce 1822 a neodbornou rozsáhlou skartací v roce 1835. Počátky odborné péče o městské archiválie Třebíče spadají až do čtyřicátých let 19. století a doby pozdější. Ke zřízení okresního archivu došlo v září 1945. Ten pečoval jak o archiválie městské, tak o dokumenty pocházející z několika panství nacházejících se na území okresu. Vedle okresního archivu existoval v třebíčském okrese v této době ještě zemědělsko-lesnický archiv, který vznikl v roce 1949 a sídlil v Moravských Budějovicích. Zanikl v roce 1956 a jeho fondy, které obsahovaly především písemnosti konfiskovaných velkostatků, byly převzaty Moravským zemským archivem v Brně. Po správní reformě v roce 1960 převzal třebíčský okresní archiv také písemnosti z bývalých okresů s centry v Moravských Budějovicích, Velké Bíteši a Velkém Meziříčí. V roce 1994 se archivu podařilo získat a opravit novou budovu, kam byly přestěhovány jeho fondy uložené dosud v nevyhovujících podmínkách. V roce 1997 byla získána i budova v Moravských Budějovicích, kam se přestěhovaly dokumenty uložené do té doby na zámcích v Moravských Budějovicích a Jaroměřicích. Od roku 2002 je okresní archiv v Třebíči součástí Moravského zemského archivu v Brně.");
                    sokaTrebic.setAddress("Na Potoce 21/23, 674 01 Třebíč");
                    archiveRepository.save(sokaTrebic);

                    var sokaUherskeHradiste = new Archive();
                    sokaUherskeHradiste.setName("Státní okresní archiv Uherské Hradiště");
                    sokaUherskeHradiste.setAbbreviation("SOkA Uherské Hradiště");
                    sokaUherskeHradiste.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaUherskeHradiste.setDescription("Okresní archiv v Uherském Hradišti byl ustanoven zdejším okresním národním výborem v roce 1946. V roce 1949 se archiv transformoval v archiv krajský s působností pro tehdejší gottwaldovský kraj, přičemž současně spravoval okresní i dalším místní fondy. Tento stav se však nejevil jako vyhovující a v roce 1955 došlo k obnovení samostatného okresního archivu. V roce 1960 v návaznosti na reformu státní správy byl do tohoto archivu včleněn i původní okresní archiv v Uherském Brodě. Na začátku šedesátých let 20. století usiloval okresní archiv v Uherském Hradišti o nalezení odpovídajících prostor pro zlepšení uložení archiválií. To se podařilo uskutečnit až po zániku krajského archivu a předání jím užívaného objektu v roce 1964. Od roku 2002 se stal archiv organizační jednotkou Moravského zemského archivu v Brně.");
                    sokaUherskeHradiste.setAddress("Velehradská 124, 686 01 Uherské Hradiště");
                    archiveRepository.save(sokaUherskeHradiste);

                    var sokaVsetin = new Archive();
                    sokaVsetin.setName("Státní okresní archiv Vsetín");
                    sokaVsetin.setAbbreviation("SOkA Vsetín");
                    sokaVsetin.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaVsetin.setDescription("Základem dnešního okresního archivu jsou okresní archivy Valašské Meziříčí a Vsetín, které byly založeny v roce 1947. Existence archivu ve Valašském Meziříčí však byla pouze formální. Obě instituce byly sloučeny v rámci reformy státní správy v roce 1960. Již od počátku zápasil archiv s kapacitními i personálními problémy. Jako řešení se jevilo vystavění účelové budovy, projekt z roku 1967 však zůstal nerealizovaný. Ke změně došlo až v roce 1995, kdy tehdejší okresní úřad zakoupil a adaptoval pro potřeby archivu původní budovu závodní jídelny Okresního stavebního podniku. K této budově později přibyl ještě jeden objekt, získaný v roce 2001. Od roku 2002 se stal státní okresní archiv ve Vsetíně vnitřní jednotkou Moravského zemského archivu v Brně.");
                    sokaVsetin.setAddress("4. května 227, 755 01 Vsetín");
                    archiveRepository.save(sokaVsetin);

                    var sokaKromeriz = new Archive();
                    sokaKromeriz.setName("Státní okresní archiv Kroměříž");
                    sokaKromeriz.setAbbreviation("SOkA Kroměříž");
                    sokaKromeriz.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaKromeriz.setDescription("Základem dnešního okresního archivu v Kroměříži jsou dva původní okresní archivy – v Holešově, který byl zřízený v r. 1947, a v Kroměříži, založený v r. 1955. Když v roce 1960 došlo v rámci územní reorganizace státní správy ke sloučení okresů Holešov a Kroměříž do jednoho celku, byl nový okresní archiv umístěn na holešovském zámku. V průběhu následujících desetiletí archiv zápasil s permanentními prostorovými problémy v ukládání archiválií, které byly částečně vyřešeny v r. 1985 přidělením nových místností v budově bývalé holešovské radnice. Nového účelového archivního objektu se archiv dočkal až v r. 1997. Od roku 2002 se okresní archiv v Kroměříži stal vnitřní organizační jednotkou Moravského zemského archivu v Brně.");
                    sokaKromeriz.setAddress("Velehradská 4259, 767 01 Kroměříž");
                    archiveRepository.save(sokaKromeriz);

                    var sokaPelhrimov = new Archive();
                    sokaPelhrimov.setName("Státní okresní archiv Pelhřimov");
                    sokaPelhrimov.setAbbreviation("SOkA Pelhřimov");
                    sokaPelhrimov.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaPelhrimov.setDescription("Počátky rané péče o archivní dokumenty spadají do druhé poloviny 19. století a počátku století dvacátého a souvisí se zájmem místní inteligence o oblast regionální historie. Ačkoliv v oblasti Pelhřimovska v této době nevznikl žádný městský archiv, začala část městských registratur spravovat místní muzea. Výraznou změnu v péči o archiválie znamenala až padesátá léta 20. století. V r. 1952 došlo postupně k zřizování okresních archivů v tehdejších okresech Humpolec, Pacov, Pelhřimov a Kamenice nad Lipou, vedle toho krátkodobě existovaly i archivy při některých místních národních výborech. V souvislosti s reformou státní správy v r. 1960 došlo k zániku archivů v Humpolci, Pacově a Kamenici nad Lipou a archivní péči na nově koncipovaném okrese získal na starost Státní okresní archiv v Pelhřimově se sídlem v Červené Řečici. V průběhu sedmdesátých a osmdesátých let měl archiv problémy s umístěním archivních fondů, protože původní sídlo archivu již přestalo kapacitně stačit. Situace byla napravena výstavbou účelové archivní budovy přímo v Pelhřimově, k níž došlo v letech 1986–1989. Od roku 2002 je okresní archiv v Pelhřimově vnitřní jednotkou Moravského zemského archivu v Brně.");
                    sokaPelhrimov.setAddress("Pražská 1883, 393 01 Pelhřimov");
                    archiveRepository.save(sokaPelhrimov);

                    var sokaRajhrad = new Archive();
                    sokaRajhrad.setName("Státní okresní archiv Brno-venkov");
                    sokaRajhrad.setAbbreviation("SOkA Brno-venkov");
                    sokaRajhrad.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaRajhrad.setDescription("Státní okresní archiv Brno-venkov vznikl v roce 1960 při reformě státní správy, a to sloučením dosavadních okresních archivů v Rosicích, Tišnově a Židlochovicích. Jako místo jeho působení byl zvolen bývalý benediktinský klášter v Rajhradě, kam se postupně přemístily všechny archiválie z oblasti Brněnska, Rosicka a Židlochovicka. Původní prostory v prelatuře kláštera nahradily na začátku sedmdesátých let hospodářské objekty kláštera, které byly v několika fázích upraveny pro potřeby archivního depositáře, badatelny a kanceláří archivářů. Od roku 2002 je archiv začleněn jako organizační jednotka Moravského zemského archivu v Brně.");
                    sokaRajhrad.setAddress("Klášter 81, 664 81 Rajhrad");
                    archiveRepository.save(sokaRajhrad);

                    var sokaBlansko = new Archive();
                    sokaBlansko.setName("Státní okresní archiv Blansko");
                    sokaBlansko.setAbbreviation("SOkA Blansko");
                    sokaBlansko.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaBlansko.setDescription("Ke vzniku archivu došlo v květnu roku 1957. Prvním sídlem byly prostory zadního traktu blanenské radnice. Zde byly uloženy první fondy získané od původců při skartacích v letech 1958–1960, jednalo se především o fondy obecních úřadů a škol. Při reformě státní správy v roce 1960 došlo v souvislosti se začleněním okresu Boskovice do okresu Blansko rovněž ke sloučení dosud samostatných okresních archivů, přičemž centrálou se stal archiv v Blansku, kdežto v Boskovicích, kde se archiv konstituoval již v roce 1942, zůstala zachována funkční pobočka. Prostory archivu v Blansku prošly rekonstrukcí v roce 1982. Novou budovu získal archiv v roce 1991, ovšem tato se záhy ukázala jako nezpůsobilá pro uložení většího množství archiválií. V roce 1999 byl proto archiv přesunut do jiné, stávající budovy. Od roku 2002 je archiv začleněn jako organizační jednotka Moravského zemského archivu v Brně.");
                    sokaBlansko.setAddress("Komenského 9, 678 01 Blansko");
                    archiveRepository.save(sokaBlansko);

                    var sokaHavlickuvBrod = new Archive();
                    sokaHavlickuvBrod.setName("Státní okresní archiv Havlíčkův Brod");
                    sokaHavlickuvBrod.setAbbreviation("SOkA Havlíčkův Brod");
                    sokaHavlickuvBrod.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaHavlickuvBrod.setDescription("Počátky státní okresního archivu souvisí s formováním městského archivu v Havlíčkově Brodě. Městská registratura byla archivně zpracována již v letech 1858–1877. K oficiálnímu ustanovení okresního archivu došlo v r. 1954. Kromě archivu v Havlíčkově Brodě pak fungovaly v rámci tehdejší okresní správy ještě okresní archivy v Chotěboři a v Ledči nad Sázavou. V roce 1960 v souvislosti s územní reorganizací státu došlo ke sloučení těchto třech institucí do Okresního archivu Havlíčkův Brod. Ten dlouhou dobu sídlil v provizorních podmínkách. Teprve v letech 1993–1994 byla pro potřeby archivu získána a stavebně upravena budova bývalého okresního stavebního podniku, kde archiv sídlí dodnes. Od roku 2002 je začleněn jako organizační jednotka Moravského zemského archivu v Brně.");
                    sokaHavlickuvBrod.setAddress("Kyjovská 1125, 580 01 Havlíčkův Brod");
                    archiveRepository.save(sokaHavlickuvBrod);

                    var sokaVyskov = new Archive();
                    sokaVyskov.setName("Státní okresní archiv Vyškov se sídlem ve Slavkově u Brna");
                    sokaVyskov.setAbbreviation("SOkA Vyškov");
                    sokaVyskov.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaVyskov.setDescription("Počátky různorodého zájmu o péči o archivní dokumenty jsou v okrese Vyškov patrné od počátku 20. století. V r. 1927 došlo ke jmenování prvního archiváře městského archivu ve Vyškově, kterým se stal profesor tamního gymnázia Vojtěch Procházka. Ten poprvé utřídil a uspořádal městský archiv. V roce 1951 se tento archiv změnil v archiv okresní a později, v roce 1960 k němu byly v souvislosti s reformou státní správy přičleněny i původní okresní archivy v Bučovicích a Slavkově u Brna. V průběhu dalších desetiletí využíval archiv různé depozitní prostory. Od r. 2002 je organizační součástí Moravského zemského archivu v Brně.");
                    sokaVyskov.setAddress("Palackého náměstí 1, 684 01 Slavkov u Brna");
                    archiveRepository.save(sokaVyskov);

                    var sokaBreclav = new Archive();
                    sokaBreclav.setName("Státní okresní archiv Břeclav se sídlem v Mikulově");
                    sokaBreclav.setAbbreviation("SOkA Břeclav");
                    sokaBreclav.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaBreclav.setDescription("Státní okresní archiv Břeclav je umístěn vzhledem ke starší archivní tradici nikoliv v bývalém okresním městě, ale v Mikulově. Archiv vznikl v r. 1960 po reorganizaci státní správy pro bývalé okresy Hustopeče, Břeclav a Mikulov. Depozitáře a pracovna archivu byly původně umístěny na mikulovském zámku, v šedesátých a sedmdesátých letech pak v kanovnických domech na náměstí. V r. 1995 byla pro potřeby archivu získána a v letech 1998–2000 adaptována nepoužívaná budova určená původně jako obchodní dům, v jejíž zadní části byl vybudován depozitář. Od roku 2002 je archiv začleněn jako organizační jednotka Moravského zemského archivu v Brně.");
                    sokaBreclav.setAddress("Pavlovská 2, 692 24 Mikulov");
                    archiveRepository.save(sokaBreclav);

                    var sokaHodonin = new Archive();
                    sokaHodonin.setName("Státní okresní archiv Hodonín");
                    sokaHodonin.setAbbreviation("SOkA Hodonín");
                    sokaHodonin.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaHodonin.setDescription("Počátky systematické archivní činnosti jsou spojené s osobností zdejšího prvního okresního archiváře Josefa Špičky, který se jím stal v r. 1954. Původní uložení archiválií bylo ve sklepení Okresního národního výboru v Hodoníně, v r. 1959 došlo k jejich přestěhování do prostor hodonínského zámečku. V letech 1962–1694 vznikl adaptací původní strojovny nový depozitář, který byl v letech 1973–1976 rozšířen o další přístavbu s novými depozitními sály a pracovnami archivářů. Budova pak byla opravována na počátku devadesátých let 20. století.");
                    sokaHodonin.setAddress("Koupelní 809/10, 695 01 Hodonín");
                    archiveRepository.save(sokaHodonin);

                    var sokaZnojmo = new Archive();
                    sokaZnojmo.setName("Státní okresní archiv Znojmo");
                    sokaZnojmo.setAbbreviation("SOkA Znojmo");
                    sokaZnojmo.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaZnojmo.setDescription("Archivnictví se v dnešním okrese Znojmo rozvíjelo již od poloviny 19. století především díky městským archivům ve Znojmě a Moravském Krumlově. Znojemský archiv se transformoval v archiv okresní již v roce 1948, v Moravském Krumlově k tomu došlo v roce 1953. Při reorganizaci státní správy v roce 1960 byl okres Moravský Krumlov zrušen a s ním zanikl i jeho okresní archiv. Jeho funkci i archiválie převzal okresní archiv ve Znojmě. Od roku 2002 se Státní okresní archiv ve Znojmě stal vnitřní jednotkou Moravského zemského archivu v Brně.");
                    sokaZnojmo.setAddress("Divišovo nám. 5, 669 02 Znojmo");
                    archiveRepository.save(sokaZnojmo);

                    var sokaZlin = new Archive();
                    sokaZlin.setName("Státní okresní archiv Zlín");
                    sokaZlin.setAbbreviation("SOkA Zlín");
                    sokaZlin.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaZlin.setDescription("Okresní archiv byl ve Zlíně zřízen v roce 1950. Kromě orgánů veřejné správy shromažďoval postupně i další dokumenty významně pro dějiny regionu, například hodnotný soubor fotografií meziválečného Zlína. Zpočátku sídlil archiv v budově okresního národního výboru, od roku 1957 pak ve školní budově ve Štípě. V roce 1960 se archiv rozrostl díky přičlenění bývalého okresního archivu ve Valašských Kloboukách. Od roku 1966 sídlí archiv na zámku v Klečůvce. Od roku 2002 je organizační součástí Moravského zemského archivu v Brně.");
                    sokaZlin.setAddress("Klečůvka – zámek, 763 11 Želechovice nad Dřevnicí");
                    archiveRepository.save(sokaZlin);

                    var sokaZdarNadSazavou = new Archive();
                    sokaZdarNadSazavou.setName("Státní okresní archiv Žďár nad Sázavou");
                    sokaZdarNadSazavou.setAbbreviation("SOkA Žďár nad Sázavou");
                    sokaZdarNadSazavou.setState(ArchiveState.CZECH_REPUBLIC);
                    sokaZdarNadSazavou.setDescription("Počátky systematicky organizované archivní péče na území okresu Žďár nad Sázavou spadají do padesátých let 20. století. Do té doby se péče o písemnosti realizovala v rámci muzeí. V polovině 20. století zde existovaly okresy celkem čtyři – kromě Žďáru nad Sázavou to byla Bystřice nad Pernštejnem, Velké Meziříčí a Velká Bíteš. Nejstarší okresní archiv se zformoval v roce 1950 ve Žďáru nad Sázavou. V následujících letech zdejší archiváři postupně získávali do správy dokumenty jednotlivých obcí a měst. V témže roce vznikl i okresní archiv ve Velkém Meziříčí, a to osamostatněním bývalého krajinského archivu od místního muzea. První prostory získal archiv na zámku ve Velkém Meziříčí. V Bystřici nad Pernštejnem byl první archivář jmenován v roce 1955 a ve Velké Bíteši došlo ke vzniku archivu v roce 1958. Důležitou změnu pro vývoj archivnictví v této oblasti představovala reforma státní správy v roce 1960. Díky ní došlo ke zrušení dosavadních malých okresů a k ustanovení stávajícího okresu Žďár nad Sázavou. Okresní archivy v ostatních zmíněných městech tak byly zrušeny a v jejich sídlech vznikly depozitáře či pobočky okresního archivu ve Žďáře nad Sázavou. Pobočka v Bystřici nad Pernštejnem byla zrušena v letech 1962–1963, další pobočka ve Velkém Meziříčí zde existovala až do roku 1982. V současnosti má archiv pouze depozitáře ve Velké Bíteši a Doubravníku. Pobočka ve Velkém Meziříčí byla obnovena v roce 1991. Archiv ve Žďáře nad Sázavou se v roce 1994 dočkal nové archivní budovy. Od roku 2002 je archiv začleněn jako vnitřní jednotka Moravského zemského archivu v Brně.");
                    sokaZdarNadSazavou.setAddress("591 01, Žďár nad Sázavou");
                    archiveRepository.save(sokaZdarNadSazavou);
                    */

            var zaOpava = new Archive();
            zaOpava.setName("Zemský archiv v Opavě");
            zaOpava.setAbbreviation("ZA Opava");
            zaOpava.setState(ArchiveState.CZECH_REPUBLIC);
            zaOpava.setDescription("Zemský archiv v Opavě je státní oblastní archiv spadající přímo pod ministerstvo vnitra ČR. Nad rámec zbývajících oblastních archivů opavský archiv shromažďuje archiválie samostatné zemské správy Slezska a Moravskoslezské země. Archiv má hlavní sídlo v Opavě a pobočku v Olomouci.");
            zaOpava.setAddress("Sněmovní 2/1, 746 01 Opava 1-Město");
            archiveRepository.save(zaOpava);

            var soaPraha = new Archive();
            soaPraha.setName("Státní Oblastní Archiv v Praze");
            soaPraha.setAbbreviation("SOA Praha");
            soaPraha.setState(ArchiveState.CZECH_REPUBLIC);
            soaPraha.setDescription("Státní oblastní archiv v Praze je státní oblastní archiv s působností pro Středočeský kraj a Hlavní město Praha s hlavním sídlem v Praze. Roku 2002 došlo ke sloučení starého oblastního archivu a okresních archivů na území středních Čech v souvislosti s reformou veřejné správy a zánikem okresních úřadů.");
            soaPraha.setAddress("Archivní 2257/4, 149 00 Praha 4-Chodov");
            archiveRepository.save(soaPraha);

            var ahmp = new Archive();
            ahmp.setName("Archiv hlavního města Prahy");
            ahmp.setAbbreviation("AHM Praha");
            ahmp.setState(ArchiveState.CZECH_REPUBLIC);
            ahmp.setDescription("Archiv hlavního města Prahy je městský archiv zřízený jako odbor Magistrátu hl. m. Prahy. Hlavní sídlo archivu se nachází v samostatné části archivního areálu na Chodovci. Městský archiv má velký význam pro dějiny nejen Prahy, ale i Čech, vzhledem k mimořádné roli hlavního města.");
            ahmp.setAddress("Archivní 1280/6, 149 00 Praha 4-Chodov");
            archiveRepository.save(ahmp);

            var soaHradec = new Archive();
            soaHradec.setName("Státní oblastní archiv v Hradci Králové");
            soaHradec.setAbbreviation("SOA Hradec Králové");
            soaHradec.setState(ArchiveState.CZECH_REPUBLIC);
            soaHradec.setDescription("Státní oblastní archiv v Hradci Králové (SOA v Hradci Králové) je státní oblastní archiv spravující kraje Královéhradecký a Pardubický, který vznikl v roce 1960. Sídlil v Zámrsku, konkrétně v budově místního zámku. V šedesátých letech byla v zámeckém areálu vybudována první účelová hala pro ukládání archiválií, byla zřízena konzervátorská a restaurátorská dílna a bylo zahájeno mikrosnímkování matrik. Po roce 1990 proběhla rekonstrukce zámku, při níž byla např. zřízena badatelna, a celý areál byl zmodernizován.");
            soaHradec.setAddress("Škroupova 695, 500 02 Hradec Králové 2");
            archiveRepository.save(soaHradec);

            var soaLitomerice = new Archive();
            soaLitomerice.setName("Státní oblastní archiv v Litoměřicích");
            soaLitomerice.setAbbreviation("SOA Litoměřice");
            soaLitomerice.setState(ArchiveState.CZECH_REPUBLIC);
            soaLitomerice.setDescription("Státní oblastní archiv v Litoměřicích je státní oblastní archiv s územní působností pro Ústecký kraj a Liberecký kraj. Počátek archivu se odvozuje od roku 1948.");
            soaLitomerice.setAddress("Krajská 48/1, 412 01, Litoměřice");
            archiveRepository.save(soaLitomerice);

            var soaPlzen = new Archive();
            soaPlzen.setName("Státní oblastní archiv v Plzni");
            soaPlzen.setAbbreviation("SOA Plzeň");
            soaPlzen.setState(ArchiveState.CZECH_REPUBLIC);
            soaPlzen.setDescription("Státní oblastní archiv v Plzni (SOA v Plzni) je státní oblastní archiv s působností pro kraje Karlovarský a Plzeňský, který vznikl 1948, respektive 1960 (územní působnost pro Západočeský kraj). Archiv má jednu centrálu v Plzni, pobočku (pracoviště) v Klášteře u Nepomuka a dále do působnosti archivu spadá devět státních okresních archivů.");
            soaPlzen.setAddress("Sedláčkova 22/44, 301 00 Plzeň 3-Vnitřní Město");
            archiveRepository.save(soaPlzen);

            var soaTrebon = new Archive();
            soaTrebon.setName("Státní oblastní archiv v Třeboni");
            soaTrebon.setAbbreviation("SOA Třeboň");
            soaTrebon.setState(ArchiveState.CZECH_REPUBLIC);
            soaTrebon.setDescription("Státní oblastní archiv v Třeboni je státní oblastní archiv s působností pro Jihočeský kraj s hlavním sídlem v Třeboni a pobočkami v Českých Budějovicích, Českém Krumlově a dříve v Jindřichově Hradci.");
            soaTrebon.setAddress("Husova 143, 379 01 Třeboň I");
            archiveRepository.save(soaTrebon);


            log.info("Database seeded with initial archive data.");
            //System.out.println("Database seeded with initial archive data.");
        }
    }
}
