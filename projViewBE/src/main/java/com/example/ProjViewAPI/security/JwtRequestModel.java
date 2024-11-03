package com.example.ProjViewAPI.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtRequestModel implements Serializable {

    @Serial
    private static final long serialVersionUID = 2636936156391265891L;

    private String username;

    private String password;
}


