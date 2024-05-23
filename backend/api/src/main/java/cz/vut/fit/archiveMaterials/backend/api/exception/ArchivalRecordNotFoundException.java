package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNotFoundException;

public class ArchivalRecordNotFoundException extends ObjectNotFoundException {

    public ArchivalRecordNotFoundException(String message) {
        super(message);
    }

}
