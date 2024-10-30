package com.example.ProjViewAPI.POJO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RefreshResponse {

    private String accessToken;

    private Boolean isAdmin;
}
