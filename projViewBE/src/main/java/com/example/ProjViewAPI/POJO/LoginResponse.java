package com.example.ProjViewAPI.POJO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String token;

    private String refreshToken;

    private boolean isAdmin;

    public <T> LoginResponse(String token, boolean admin, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.isAdmin = admin;
    }
}