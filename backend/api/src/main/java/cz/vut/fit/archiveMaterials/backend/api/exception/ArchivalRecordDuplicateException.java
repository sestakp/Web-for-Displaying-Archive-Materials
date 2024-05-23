package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectConflictException;

public class ArchivalRecordDuplicateException extends ObjectConflictException {

    public ArchivalRecordDuplicateException(String message) {
        super(message);
    }
}
