package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime;

public class ObjectNoContentRuntimeException extends ObjectRuntimeException{

    public ObjectNoContentRuntimeException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public ObjectNoContentRuntimeException(String message, String objectId) {
        super(message, objectId);
    }

    public ObjectNoContentRuntimeException(String message) {
        super(message);
    }
}
