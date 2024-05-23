package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions;

public class ObjectConflictException extends ObjectException{

    public ObjectConflictException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public ObjectConflictException(String message, String objectId) {
        super(message, objectId);
    }

    public ObjectConflictException(String message) {
        super(message);
    }
}
