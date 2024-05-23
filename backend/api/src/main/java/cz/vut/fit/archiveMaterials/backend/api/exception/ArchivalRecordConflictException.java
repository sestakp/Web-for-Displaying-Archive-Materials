package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectConflictException;

public class ArchivalRecordConflictException extends ObjectConflictException {

    public ArchivalRecordConflictException(String message) {
        super(message);
    }

}

