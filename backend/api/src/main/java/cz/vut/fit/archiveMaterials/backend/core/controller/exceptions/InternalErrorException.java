package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions;

public class InternalErrorException extends ObjectException{

    public InternalErrorException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public InternalErrorException(String message, String objectId) {
        super(message, objectId);
    }

    public InternalErrorException(String message) {
        super(message);
    }

}
