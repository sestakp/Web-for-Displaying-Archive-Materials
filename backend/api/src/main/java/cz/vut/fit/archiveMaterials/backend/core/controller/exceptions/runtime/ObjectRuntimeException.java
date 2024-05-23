package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime;

public class ObjectRuntimeException extends RuntimeException{

    private String objectId;
    private String internalCode;

    public ObjectRuntimeException(String message, String objectId, String internalCode) {
        super(message);
        this.objectId = objectId;
        this.internalCode = internalCode;
    }

    public ObjectRuntimeException(String message, String objectId) {
        super(message);
        this.objectId = objectId;
    }

    public ObjectRuntimeException(String message) {
        super(message);
    }

    public String getObjectId() {
        return this.objectId;
    }

    public String getInternalCode() {
        return this.internalCode;
    }
}
