package cz.vut.fit.archiveMaterials.backend.api.controller;

import cz.vut.fit.archiveMaterials.backend.api.BookmarkControllerApi;
import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.BookmarkDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.BookmarkPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.BookmarkDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.BookmarkRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.service.BookmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookmarkController  implements BookmarkControllerApi {

    private final BookmarkService service;
    private final BookmarkPersistenceService persistenceService;

    private final BookmarkDtoMapper mapper;


    /**
     * Retrieve bookmarks for a specific archival record.
     *
     * @param archivalRecordId The ID of the archival record for which bookmarks are to be retrieved.
     * @return A ResponseEntity containing a list of BookmarkDetailDto objects representing the bookmarks.
     */
    @Override
    public ResponseEntity<List<BookmarkDetailDto>> getBookmarksForArchivalRecord(Long archivalRecordId) {
        var bookmarks = persistenceService.getBookmarksForArchivalRecord(archivalRecordId);
        var bookmarksDto = mapper.mapCollectionOfBookmarks(bookmarks);
        return ResponseEntity.status(HttpStatus.OK).body(bookmarksDto);
    }

    /**
     * Upsert a bookmark based on the provided bookmark request DTO.
     *
     * @param bookmarkDto The bookmark request DTO containing the data for the bookmark.
     * @return A ResponseEntity containing the updated bookmark detail DTO.
     * @throws Exception If an error occurs during the upsert operation.
     */
    @Override
    public ResponseEntity<BookmarkDetailDto> upsert(@Valid BookmarkRequestDto bookmarkDto) throws Exception {
        var bookmark = mapper.map(bookmarkDto);
        var updatedBookmark = service.upsert(bookmark);
        var responseDto = mapper.map(updatedBookmark);

        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    /**
     * Delete a bookmark based on its ID.
     *
     * @param id The ID of the bookmark to be deleted.
     * @return A ResponseEntity representing a successful deletion operation.
     * @throws Exception If an error occurs during the deletion process.
     */
    @Override
    public ResponseEntity<Void> deleteBookmark(Long id) throws Exception {
        log.info("delete bookmark {}",id);
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
