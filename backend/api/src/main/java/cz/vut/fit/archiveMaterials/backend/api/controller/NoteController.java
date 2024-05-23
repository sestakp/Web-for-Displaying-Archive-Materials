package cz.vut.fit.archiveMaterials.backend.api.controller;

import cz.vut.fit.archiveMaterials.backend.api.NoteControllerApi;
import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.NoteDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.NotePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.NoteDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.NoteRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ScanNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.NoteService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NoteController implements NoteControllerApi {

    private final NoteService service;
    private final NotePersistenceService persistenceService;
    private final NoteDtoMapper mapper;

    /**
     * Retrieve all notes associated with a specific archival record.
     *
     * @param archivalRecordId The ID of the archival record for which notes are to be retrieved.
     * @return A ResponseEntity containing a list of NoteDetailDto objects representing the notes.
     */
    @Override
    public ResponseEntity<List<NoteDetailDto>> getNotesForArchivalRecord(Long archivalRecordId) {

        var notes = service.getAllScansByArchivalRecord(archivalRecordId);
        var notesDto = mapper.mapCollectionOfNotes(notes);
        return ResponseEntity.status(HttpStatus.OK).body(notesDto);
    }

    /**
     * Upsert a note based on the provided note request DTO.
     *
     * @param noteDto The note request DTO containing the data for the note.
     * @return A ResponseEntity containing the updated note detail DTO.
     * @throws ArchivalRecordNotFoundException If the associated archival record is not found.
     * @throws ScanNotFoundException           If the associated scan is not found.
     */
    @Override
    public ResponseEntity<NoteDetailDto> upsert(@Valid NoteRequestDto noteDto)
            throws ArchivalRecordNotFoundException, ScanNotFoundException {
        var note = mapper.map(noteDto);
        var updatedNote = service.upsert(note);
        var responseDto = mapper.map(updatedNote);

        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    /**
     * Delete a note based on its ID.
     *
     * @param id The ID of the note to be deleted.
     * @return A ResponseEntity representing a successful deletion operation.
     * @throws Exception If an error occurs during the deletion process.
     */
    @Override
    public ResponseEntity<Void> deleteNote(Long id) throws Exception {
        log.info("delete note {}", id);
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
