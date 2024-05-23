package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime;

public class ObjectNotFoundRuntimeException extends ObjectRuntimeException{
    public ObjectNotFoundRuntimeException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public ObjectNotFoundRuntimeException(String message, String employeeId) {
        super(message, employeeId);
    }

    public ObjectNotFoundRuntimeException(String message) {
        super(message);
    }
}
