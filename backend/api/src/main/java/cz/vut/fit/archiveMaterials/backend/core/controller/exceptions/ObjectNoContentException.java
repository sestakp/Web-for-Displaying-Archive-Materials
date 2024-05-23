package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions;

public class ObjectNoContentException extends ObjectException{

    public ObjectNoContentException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public ObjectNoContentException(String message, String objectId) {
        super(message, objectId);
    }

    public ObjectNoContentException(String message) {
        super(message);
    }
}
