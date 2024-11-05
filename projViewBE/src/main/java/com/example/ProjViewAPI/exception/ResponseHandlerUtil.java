package com.example.ProjViewAPI.exception;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class ResponseHandlerUtil {

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<String> handleException(LoginException exception) {
        return ResponseEntity.status(exception.getStatus()).body(exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleException(MethodArgumentNotValidException exception) {
        return ResponseEntity
                .status(exception.getStatusCode())
                .body(exception.getBindingResult().getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).collect(Collectors.toList()));
    }

    @ExceptionHandler(RegisterException.class)
    public ResponseEntity<Map<String, String>> handleException(RegisterException exception) {
        return ResponseEntity.status(exception.getStatus()).body(Map.of("message", exception.getMessage()));
    }
}
