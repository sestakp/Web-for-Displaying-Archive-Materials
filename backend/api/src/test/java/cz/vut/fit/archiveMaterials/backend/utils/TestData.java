package cz.vut.fit.archiveMaterials.backend.utils;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.AuthUser;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.Fund;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.Originator;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.TimeRange;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Bookmark;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Language;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Note;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ScanPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordCreateDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchiveCreateDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchiveDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchiveTypeEnum;
import cz.vut.fit.archiveMaterials.backend.api.dto.AuthRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.BookmarkRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.NoteRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.PasswordResetDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.RegisterRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.RegisterResponseDto;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

@RequiredArgsConstructor
public class TestData {

    private final ScanPersistenceService scanPersistenceService;

    public static final Long ID = ThreadLocalRandom.current().nextLong();

    public static ArchivalRecordCreateDto createArchivalRecordDto() {

        Archive archive = new Archive();
        archive.setName("Zemský archiv v Opavě");

        ArchivalRecordCreateDto dto = new ArchivalRecordCreateDto();
        dto.setTypeOfRecord(ArchivalRecordTypeEnum.MATRIKA);
        dto.setArchive(archive.getName());
        dto.setFundName("Test fund name");
        dto.setFundCode("Test fund code");
        dto.setSignature("Test signature");
        dto.setInventoryNumber("Test inventory number");
        dto.setNumberOfScans(10);
        dto.setOtherNote("Test other note");
        dto.setLink("https://digi.archives.cz/da/permalink?xid=be844330-f13c-102f-8255-0050568c0263");
        dto.setDescription("Test description");
        dto.setOriginatorName("Test originator name");
        dto.setOriginatorType("Test originator type");
        dto.setOriginatorNote("Test originator note");
        dto.setYearBornFrom(1900);
        dto.setYearBornTo(2000);
        dto.setYearBornIndexFrom(1950);
        dto.setYearBornIndexTo(1970);
        dto.setYearMarriedFrom(1950);
        dto.setYearMarriedTo(1990);
        dto.setYearMarriedIndexFrom(1960);
        dto.setYearMarriedIndexTo(1980);
        dto.setYearDeceasedFrom(1980);
        dto.setYearDeceasedTo(2020);
        dto.setYearDeceasedIndexFrom(1990);
        dto.setYearDeceasedIndexTo(2010);
        dto.setRegisterNote("Test register note");
        dto.setYearTaken(2022);
        dto.setJudicialDistrict("Test judicial district");
        dto.setLandRegistryNrs("Test land registry numbers");
        dto.setOriginalName("Test original name");
        dto.setName("Test name");
        return dto;
    }

    public static ArchivalRecord createArchivalRecord() {
        ArchivalRecord archivalRecord = new ArchivalRecord();
        archivalRecord.setId(1L);
        archivalRecord.setTypeOfRecord(ArchivalRecordTypeEnum.MATRIKA);
        archivalRecord.setArchive(createArchive());
        archivalRecord.setSignature("Sample Signature");
        archivalRecord.setNad(123);
        archivalRecord.setInventoryNumber("Sample Inventory Number");
        archivalRecord.setLanguages(new ArrayList<>());
        archivalRecord.setNumberOfScans(10);
        archivalRecord.setOtherNote("Sample Other Note");
        archivalRecord.setLink("Sample Link");
        archivalRecord.setLocations(new ArrayList<>());
        archivalRecord.setYear(createSampleTimeRange());
        archivalRecord.setContent("Sample Content");
        archivalRecord.setDescription("Sample Description");
        archivalRecord.setDigitalized(true);
        archivalRecord.setOriginator(createSampleOriginator());
        archivalRecord.setFund(createSampleFund());
        archivalRecord.setYearBorn(createSampleTimeRange());
        archivalRecord.setYearBornIndex(createSampleTimeRange());
        archivalRecord.setYearMarried(createSampleTimeRange());
        archivalRecord.setYearMarriedIndex(createSampleTimeRange());
        archivalRecord.setYearDeceased(createSampleTimeRange());
        archivalRecord.setYearDeceasedIndex(createSampleTimeRange());
        archivalRecord.setRegisterNote("Sample Register Note");
        archivalRecord.setYearTaken(2022);
        archivalRecord.setJudicialDistrict("Sample Judicial District");
        archivalRecord.setLandRegistryNrs("Sample Land Registry Numbers");
        archivalRecord.setIndexOnly(false);
        archivalRecord.setSpecificType("Sample Specific Type");
        archivalRecord.setRecordMethod("Sample Record Method");
        archivalRecord.setOriginalName("Sample Original Name");
        archivalRecord.setName("Sample Name");
        archivalRecord.setLastUpdated(LocalDateTime.now());
        archivalRecord.setNotes(new ArrayList<>());
        //archivalRecord.setFavouritesByUsers(new ArrayList<>());
        archivalRecord.setBookmarks(new ArrayList<>());
        //archivalRecord.setScans(scans());
        return archivalRecord;
    }

    public static Archive createArchive() {
        Archive archive = new Archive();
        archive.setId(1L);
        archive.setName("Testovaci archiv");
        archive.setAddress("Testovaci adresa");
        archive.setDescription("Testovaci popis archivu");
        archive.setAbbreviation("TEST");
        return archive;
    }

    public static Archive updateArchive(){
        Archive archive = createArchive();
        archive.setName("Testovaci archiv update");
        archive.setAddress("Testovaci adresa update");
        archive.setDescription("Testovaci popis archivu update");
        archive.setAbbreviation("TEST update");
        return archive;
    }

    private static TimeRange createSampleTimeRange() {
        TimeRange timeRange = new TimeRange();
        timeRange.setFrom(1800);
        timeRange.setTo(1900);
        return timeRange;
    }

    private static Originator createSampleOriginator() {
        Originator originator = new Originator();
        originator.setName("Test originator");
        originator.setNote("Test note originator");
        originator.setType("Test type originator");
        return originator;
    }

    private static Fund createSampleFund() {
        Fund fund = new Fund();
        fund.setName("Test fund");
        fund.setCode("sdf68");
        return fund;
    }

    public static Scan createScan() {
        Scan scan = new Scan();
        scan.setUrl("http://images.soalitomerice.cz/mrimage/matriky/proxy/cz/archives/CZ-214000010/NAD-856/dao/images/0117/0024af93-9e79-4fc3-943c-28ff5c7e56f1.jpg");
        scan.setOrderNumber(1);
        scan.setPreFetchUrl("");
        return scan;
    }

    public static Collection<Scan> scans(){
        Collection<Scan> scans = new ArrayList<>();
        Scan scan = createScan();
        scan.setArchivalRecord(createArchivalRecord());
        scans.add(scan);
        return scans;
    }

    public static Note createNote(){
        Note note = new Note();
        note.setId(1L);
        note.setText("Test note");
        note.setScan(createScan());
        note.setUser(createUser());
        note.setArchivalRecord(createArchivalRecord());
        note.setLastUpdated(LocalDateTime.now());
        return note;
    }

    public static Bookmark createBookmark(){
        Bookmark bookmark = new Bookmark();
        bookmark.setId(1L);
        bookmark.setText("Test text bookmark");
        bookmark.setScan(createScan());
        bookmark.setUser(createUser());
        bookmark.setArchivalRecord(createArchivalRecord());
        bookmark.setLastUpdated(LocalDateTime.now());
        return bookmark;
    }

    public static Authentication createAuthenticationWithUser() {
        User user = createUser();
        return new UsernamePasswordAuthenticationToken(user, null, ((UserDetails) user).getAuthorities());
    }

    public static List<Note> createListOfNotes() {
        List<Note> notes = new ArrayList<>();
        notes.add(createNote());
        notes.add(createNote());
        return notes;
    }

    private Collection<Note> notes(){
        Collection<Note> notes = new ArrayList<>();
        Note note = new Note();
        note.setId(1L);
        note.setText("Test note");
        note.setScan(createScan());
        note.setScanNumber(1);
        note.setUser(createUser());
        note.setArchivalRecord(createArchivalRecord());
        return notes;
    }

    public static ArchiveCreateDto archiveCreateDto(){
        ArchiveCreateDto dto = new ArchiveCreateDto();
        dto.setName("Test archive");
        dto.setDescription("Test Description");
        dto.setType(ArchiveTypeEnum.SOA);
        dto.setAddress("Testovaci adresa");
        return dto;
    }

    public static BookmarkRequestDto bookmarkRequestDto(){
        ArchivalRecord archivalRecord = createArchivalRecord();
        BookmarkRequestDto dto = new BookmarkRequestDto();
        dto.setText("Text bookmark");
        dto.setArchivalRecordId(archivalRecord.getId());
        dto.setScanNumber(1);
        dto.setScanUrl("http://www.example.com");
        return dto;
    }

    public static NoteRequestDto noteCreateDto(){
        NoteRequestDto dto = new NoteRequestDto();
        dto.setText("Test text note");
        dto.setArchivalRecordId(1L);
        dto.setScanUrl(createScan().getUrl());
        return dto;
    }

    public static BookmarkRequestDto bookmarkCreateDto(){
        BookmarkRequestDto dto = new BookmarkRequestDto();
        dto.setText("Test text bookmark");
        dto.setArchivalRecordId(1L);
        dto.setScanUrl(createScan().getUrl());
        return dto;
    }

    public static User createUser(){
        User user = new User();
        user.setId(1L);
        user.setName("Jozko Mrkvicka");
        user.setEmail("jozko@mrkvicka.cz");
        user.setPassword("pass");
        user.setVerified(true);
        user.setVerifyHash("verifyHashForTest");
        user.setPasswordResetHash("ResetHashForTest");
        return user;
    }

    public static RegisterRequestDto registerDto(){
        RegisterRequestDto dto = new RegisterRequestDto();
        dto.setEmail("test@test.sk");
        dto.setName("test");
        dto.setPassword("123456");
        return dto;
    }

    public static AuthRequestDto loginRequestDto(){
        AuthRequestDto dto = new AuthRequestDto();
        dto.setEmail("jozko@mrkvicka.cz");
        dto.setPassword("pass");
        return dto;
    }

    public static AuthUser authUser(){
        AuthUser authUser = new AuthUser();
        authUser.setEmail("jozko@mrkvicka.cz");
        authUser.setPassword("pass");
        return authUser;
    }

    public static PasswordResetDto passwordResetDto(){
        PasswordResetDto dto = new PasswordResetDto();
        dto.setPassword("pass");
        dto.setHash("verifyHashForTest");
        return dto;
    }

}
