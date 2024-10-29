package com.example.ProjViewAPI.exception;

import lombok.Getter;

import java.io.Serial;

@Getter
public class LoginException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1824128295862130244L;

    private int status = -1;

    public LoginException(String message, int status) {
        super(message);
        this.status = status;
    }

    public LoginException(String message, Throwable cause, int status) {
        super(message, cause);
        this.status = status;
    }

}