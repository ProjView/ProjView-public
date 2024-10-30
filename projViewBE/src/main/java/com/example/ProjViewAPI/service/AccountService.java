package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.AdminRegisterRequest;
import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.security.JwtResponseModel;
import org.springframework.http.ResponseEntity;

public interface AccountService {

    ResponseEntity<JwtResponseModel> registerUser(UserRegisterRequest registerRequest);

    ResponseEntity<JwtResponseModel> registerAdmin(AdminRegisterRequest registerRequest);


    void deleteUser(String jwtToken);
}
