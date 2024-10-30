package com.example.ProjViewAPI.POJO;

import com.example.ProjViewAPI.validator.ValidUsername;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminRegisterRequest {

    @ValidUsername
    private String username;

    private String password;
}
