package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNotFoundException;

public class ScanNotFoundException extends ObjectNotFoundException {
    public ScanNotFoundException(String message) {
        super(message);
    }
}
