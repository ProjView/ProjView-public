package com.example.ProjViewAPI.exception;

import lombok.Getter;

@Getter
public class RegisterException extends RuntimeException {

    private int status = -1;

    public RegisterException(String message, int status) {
        super(message);
        this.status = status;
    }

    public RegisterException(String message, Throwable cause, int status) {
        super(message, cause);
        this.status = status;
    }
}
