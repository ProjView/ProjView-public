package com.example.ProjViewAPI.security;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class JwtResponseModel implements Serializable {

    private String token;

    private String refreshToken;

    private boolean isAdmin;

    public <T> JwtResponseModel(String token, boolean admin, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.isAdmin = admin;
    }
}

