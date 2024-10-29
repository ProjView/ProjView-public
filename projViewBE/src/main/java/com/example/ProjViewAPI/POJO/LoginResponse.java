package com.example.ProjViewAPI.POJO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String token;

    private boolean isAdmin;

    public <T> LoginResponse(String token, boolean admin) {
        this.token = token;
        this.isAdmin = admin;
    }
}