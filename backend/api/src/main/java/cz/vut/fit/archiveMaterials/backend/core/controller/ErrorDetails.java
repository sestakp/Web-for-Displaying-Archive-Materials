package cz.vut.fit.archiveMaterials.backend.core.controller;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorDetails {

    public ErrorDetails() {
    }

    private LocalDateTime timestamp;
    private String message;
    private String objectId;
    private String details;
    private String internalCode;

    /*public LocalDateTime getTimestamp() {
        return this.timestamp;
    }

    public String getMessage() {
        return this.message;
    }

    public String getObjectId() {
        return this.objectId;
    }

    public String getDetails() {
        return this.details;
    }

    public String getInternalCode() {
        return this.internalCode;
    }

    public void setTimestamp(final LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public void setObjectId(final String objectId) {
        this.objectId = objectId;
    }

    public void setDetails(final String details) {
        this.details = details;
    }

    public void setInternalCode(final String internalCode) {
        this.internalCode = internalCode;
    }*/

    public boolean equals(final Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof ErrorDetails)) {
            return false;
        } else {
            ErrorDetails other = (ErrorDetails)o;
            if (!other.canEqual(this)) {
                return false;
            } else {
                label71: {
                    Object this$timestamp = this.getTimestamp();
                    Object other$timestamp = other.getTimestamp();
                    if (this$timestamp == null) {
                        if (other$timestamp == null) {
                            break label71;
                        }
                    } else if (this$timestamp.equals(other$timestamp)) {
                        break label71;
                    }

                    return false;
                }

                Object this$message = this.getMessage();
                Object other$message = other.getMessage();
                if (this$message == null) {
                    if (other$message != null) {
                        return false;
                    }
                } else if (!this$message.equals(other$message)) {
                    return false;
                }

                label57: {
                    Object this$objectId = this.getObjectId();
                    Object other$objectId = other.getObjectId();
                    if (this$objectId == null) {
                        if (other$objectId == null) {
                            break label57;
                        }
                    } else if (this$objectId.equals(other$objectId)) {
                        break label57;
                    }

                    return false;
                }

                Object this$details = this.getDetails();
                Object other$details = other.getDetails();
                if (this$details == null) {
                    if (other$details != null) {
                        return false;
                    }
                } else if (!this$details.equals(other$details)) {
                    return false;
                }

                Object this$internalCode = this.getInternalCode();
                Object other$internalCode = other.getInternalCode();
                if (this$internalCode == null) {
                    if (other$internalCode == null) {
                        return true;
                    }
                } else if (this$internalCode.equals(other$internalCode)) {
                    return true;
                }

                return false;
            }
        }
    }

    protected boolean canEqual(final Object other) {
        return other instanceof ErrorDetails;
    }

    public int hashCode() {
        int PRIME = 1;
        int result = 1;
        Object $timestamp = this.getTimestamp();
        result = result * 59 + ($timestamp == null ? 43 : $timestamp.hashCode());
        Object $message = this.getMessage();
        result = result * 59 + ($message == null ? 43 : $message.hashCode());
        Object $objectId = this.getObjectId();
        result = result * 59 + ($objectId == null ? 43 : $objectId.hashCode());
        Object $details = this.getDetails();
        result = result * 59 + ($details == null ? 43 : $details.hashCode());
        Object $internalCode = this.getInternalCode();
        result = result * 59 + ($internalCode == null ? 43 : $internalCode.hashCode());
        return result;
    }

    public ErrorDetails(final LocalDateTime timestamp, final String message, final String objectId, final String details, final String internalCode) {
        this.timestamp = timestamp;
        this.message = message;
        this.objectId = objectId;
        this.details = details;
        this.internalCode = internalCode;
    }

    public String toString() {
        LocalDateTime var10000 = this.getTimestamp();
        return "ErrorDetails(timestamp=" + var10000 + ", message=" + this.getMessage() + ", objectId=" + this.getObjectId() + ", details=" + this.getDetails() + ", internalCode=" + this.getInternalCode() + ")";
    }

}
