package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime;

public class ObjectConflictRuntimeException extends ObjectRuntimeException{

    public ObjectConflictRuntimeException(String message, String objectId, String internalCode) {
        super(message, objectId, internalCode);
    }

    public ObjectConflictRuntimeException(String message) {
        super(message);
    }

    public ObjectConflictRuntimeException(String message, String employeeId) {
        super(message, employeeId);
    }
}
