package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.AdminRegisterRequest;
import com.example.ProjViewAPI.security.JwtRequestModel;
import com.example.ProjViewAPI.security.JwtResponseModel;
import org.springframework.http.ResponseEntity;

public interface AccountService {

    ResponseEntity<JwtResponseModel> registerUser(JwtRequestModel jwtRequestModel);

    ResponseEntity<JwtResponseModel> registerAdmin(AdminRegisterRequest registerRequest);


    void deleteUser(String jwtToken);

    ResponseEntity<JwtResponseModel> generateJwtResponse(String username);

    ResponseEntity<JwtResponseModel> refreshAccessToken(String refreshToken);
}
