package cz.vut.fit.archiveMaterials.backend.core.controller;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.InternalErrorException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectConflictException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNoContentException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectNotFoundException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime.InternalErrorRuntimeException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime.ObjectConflictRuntimeException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime.ObjectNoContentRuntimeException;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime.ObjectNotFoundRuntimeException;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * A utility class to handle exceptions thrown in a REST controller.
 * It provides a mechanism to convert specific checked exceptions into corresponding runtime exceptions
 * for consistent error handling in the application.
 */
@Slf4j
public class RestControllerExceptionHandler {

    public RestControllerExceptionHandler() {
    }

    /**
     * Handles the specified {@link ObjectException} by converting it into a corresponding runtime exception.
     *
     * @param exception The {@code ObjectException} to be handled.
     * @param <T>       The type of response entity to be returned.
     * @return A {@code ResponseEntity} containing the appropriate runtime exception or an internal server error response.
     * @throws ObjectNotFoundRuntimeException      If the original exception is an instance of {@link ObjectNotFoundException}.
     * @throws ObjectNoContentRuntimeException     If the original exception is an instance of {@link ObjectNoContentException}.
     * @throws ObjectConflictRuntimeException      If the original exception is an instance of {@link ObjectConflictException}.
     * @throws InternalErrorRuntimeException       If the original exception is an instance of {@link InternalErrorException}.
     * @throws InternalErrorRuntimeException       If the original exception is not one of the specified checked exceptions.
     */
    public static <T> ResponseEntity<T> handleException(ObjectException exception) {

        if (exception instanceof ObjectNotFoundException) {
            log.warn("Object not found exception occurs: {}, objectId: {}, internalCode: {}", exception.getMessage(),
                    exception.getObjectId(), exception.getInternalCode());
            throw new ObjectNotFoundRuntimeException(exception.getMessage(), exception.getObjectId(), exception.getInternalCode());
        } else if (exception instanceof ObjectNoContentException) {
            log.warn("Object no content exception occurs: {}, objectId: {}, internalCode: {}", exception.getMessage(),
                    exception.getObjectId(), exception.getInternalCode());
            throw new ObjectNoContentRuntimeException(exception.getMessage(), exception.getObjectId(), exception.getInternalCode());
        } else if (exception instanceof ObjectConflictException) {
            log.warn("Object conflict exception occurs: {}, objectId: {}, internalCode: {}", exception.getMessage(),
                    exception.getObjectId(), exception.getInternalCode());
            throw new ObjectConflictRuntimeException(exception.getMessage(), exception.getObjectId(), exception.getInternalCode());
        } else if (exception instanceof InternalErrorException) {
            log.warn("Internal error exception occurs: {}, objectId: {}, internalCode: {}", exception.getMessage(),
                    exception.getObjectId(), exception.getInternalCode());
            throw new InternalErrorRuntimeException(exception.getMessage(), exception.getObjectId(), exception.getInternalCode());
        } else if (exception != null) {
            log.error("Exception occurs: {}", exception.getMessage());
            throw new InternalErrorRuntimeException(exception.getMessage());
        } else {
            log.error("Undefined exception occurs.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
