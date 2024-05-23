package cz.vut.fit.archiveMaterials.backend.core.controller.exceptions;

public class ObjectException extends Exception{

    private String objectId;
    private String internalCode;

    public ObjectException(String message, String objectId, String internalCode) {
        super(message);
        this.objectId = objectId;
        this.internalCode = internalCode;
    }

    public ObjectException(String message, String objectId) {
        super(message);
        this.objectId = objectId;
    }

    public ObjectException(String message) {
        super(message);
    }

    public String getObjectId() {
        return this.objectId;
    }

    public String getInternalCode() {
        return this.internalCode;
    }
}
