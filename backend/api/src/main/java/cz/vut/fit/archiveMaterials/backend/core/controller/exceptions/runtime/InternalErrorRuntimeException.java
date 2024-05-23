package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime;

public class InternalErrorRuntimeException extends ObjectRuntimeException{

    public InternalErrorRuntimeException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public InternalErrorRuntimeException(String message, String objectId) {
        super(message, objectId);
    }

    public InternalErrorRuntimeException(String message) {
        super(message);
    }
}
