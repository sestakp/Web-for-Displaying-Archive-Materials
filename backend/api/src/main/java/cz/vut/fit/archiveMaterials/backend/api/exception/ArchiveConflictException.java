package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectConflictException;

public class ArchiveConflictException extends ObjectConflictException {

    public ArchiveConflictException(String message) {
        super(message);
    }
}
