package com.example.ProjViewAPI.exception;

import lombok.Getter;

@Getter
public class ProjectException extends RuntimeException {

    private int status = -1;

    public ProjectException(String message, int status) {
        super(message);
        this.status = status;
    }

    public ProjectException(String message, Throwable cause, int status) {
        super(message, cause);
        this.status = status;
    }
}
