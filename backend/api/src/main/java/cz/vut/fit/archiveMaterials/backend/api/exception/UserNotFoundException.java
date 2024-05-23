package cz.vut.fit.archiveMaterials.backend.api.exception;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNotFoundException;

public class UserNotFoundException extends ObjectNotFoundException {

    public UserNotFoundException(String message) {
        super(message);
    }
}
