package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNotFoundException;

public class ArchiveNotFoundException extends ObjectNotFoundException {

    public ArchiveNotFoundException(String message) {
        super(message);
    }

}
