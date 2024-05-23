package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNotFoundException;

public class NoteNotFoundException extends ObjectNotFoundException {

    public NoteNotFoundException(String message) {
        super(message);
    }
}
