package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNotFoundException;

public class BookmarkNotFoundException extends ObjectNotFoundException {

    public BookmarkNotFoundException(String message) {
        super(message);
    }
}
