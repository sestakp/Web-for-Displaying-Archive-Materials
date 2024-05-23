package cz.vut.fit.archiveMaterials.backend.core.controller;

import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.runtime.*;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import lombok.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Global exception handler for handling runtime exceptions in the application.
 */
@RestControllerAdvice
public class CommonResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Description template for creating error details.
     */
    private static final String DESCRIPTION = "This error occurred when uri %s was called by user %s.";

    public CommonResponseEntityExceptionHandler() {
    }

    /**
     * Handles the exception when there is a conflict with an existing object.
     *
     * @param ex      The exception to handle.
     * @param request The HTTP servlet request.
     * @return ResponseEntity containing error details and HTTP status.
     */
    @ExceptionHandler({ObjectConflictRuntimeException.class})
    public final ResponseEntity<ErrorDetails> handleObjectWithoutIdentifierException(ObjectConflictRuntimeException ex,
            HttpServletRequest request) {
        return this.performResponseException(ex, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    /**
     * Handles the exception when an object is not found.
     *
     * @param ex      The exception to handle.
     * @param request The HTTP servlet request.
     * @return ResponseEntity containing error details and HTTP status.
     */
    @ExceptionHandler({ObjectNotFoundRuntimeException.class})
    public final ResponseEntity<ErrorDetails> handleObjectNotFoundException(ObjectNotFoundRuntimeException ex,
            HttpServletRequest request) {
        return this.performResponseException(ex, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    /**
     * Handles the exception when there is no content for an object.
     *
     * @param ex      The exception to handle.
     * @param request The HTTP servlet request.
     * @return ResponseEntity containing error details and HTTP status.
     */
    @ExceptionHandler({ObjectNoContentRuntimeException.class})
    public final ResponseEntity<ErrorDetails> handleObjectNoContentException(ObjectNoContentRuntimeException ex,
            HttpServletRequest request) {
        return this.performResponseException(ex, new HttpHeaders(), HttpStatus.NO_CONTENT, request);
    }

    /**
     * Handles the exception when there is an internal server error.
     *
     * @param ex      The exception to handle.
     * @param request The HTTP servlet request.
     * @return ResponseEntity containing error details and HTTP status.
     */
    @ExceptionHandler({InternalErrorRuntimeException.class})
    public final ResponseEntity<ErrorDetails> handleInternalErrorException(InternalErrorRuntimeException ex,
            HttpServletRequest request) {
        return this.performResponseException(ex, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    /**
     * Handles the validation errors for method arguments.
     *
     * @param ex      The exception to handle.
     * @param headers The HTTP headers.
     * @param status  The HTTP status.
     * @param request The WebRequest.
     * @return ResponseEntity containing error details and HTTP status.
     */
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, @NonNull HttpHeaders headers, @NonNull HttpStatus status,
            @NonNull WebRequest request) {
        if (headers == null) {
            throw new NullPointerException("headers is marked non-null but is null");
        } else if (status == null) {
            throw new NullPointerException("status is marked non-null but is null");
        } else if (request == null) {
            throw new NullPointerException("request is marked non-null but is null");
        } else {
            HttpServletRequest servletRequest = ((ServletWebRequest) request).getRequest();
            return new ResponseEntity(
                    this.createErrorDetails(ex.getMessage(), (String) null, (String) null, servletRequest),
                    new HttpHeaders(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Performs the response for handling runtime exceptions.
     *
     * @param exception The runtime exception.
     * @param headers   The HTTP headers.
     * @param status    The HTTP status.
     * @param request   The HTTP servlet request.
     * @return ResponseEntity containing error details and HTTP status.
     */
    private ResponseEntity<ErrorDetails> performResponseException(ObjectRuntimeException exception, HttpHeaders headers,
                                                                  HttpStatus status, HttpServletRequest request) {
        return new ResponseEntity(
                this.createErrorDetails(exception.getMessage(), exception.getObjectId(), exception.getInternalCode(),
                        request), headers, status);
    }

    /**
     * Creates an ErrorDetails object based on the provided parameters.
     *
     * @param message     The error message.
     * @param objectId    The object identifier.
     * @param internalCode The internal error code.
     * @param request     The HTTP servlet request.
     * @return ErrorDetails object.
     */
    private ErrorDetails createErrorDetails(String message, String objectId, String internalCode,
            HttpServletRequest request) {
        String userName = "";

        try {
            userName = SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception var7) {
            var7.printStackTrace();
        }

        return new ErrorDetails(LocalDateTime.now(), message, objectId,
                String.format("This error occurred when uri %s was called by user %s.", request.getRequestURI(),
                        userName), internalCode);
    }
}
