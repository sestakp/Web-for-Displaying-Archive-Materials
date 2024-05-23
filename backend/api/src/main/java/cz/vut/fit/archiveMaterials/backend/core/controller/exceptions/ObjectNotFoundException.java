package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions;

public class ObjectNotFoundException extends ObjectException{

    public ObjectNotFoundException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public ObjectNotFoundException(String message, String objectId) {
        super(message, objectId);
    }

    public ObjectNotFoundException(String message) {
        super(message);
    }
}
