package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.AdminRegisterRequest;
import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.entity.User;
import com.example.ProjViewAPI.security.JwtResponseModel;

import java.util.List;

import org.springframework.http.ResponseEntity;

public interface AccountService {

    ResponseEntity<JwtResponseModel> registerUser(UserRegisterRequest registerRequest);

    ResponseEntity<JwtResponseModel> registerAdmin(AdminRegisterRequest registerRequest);

    List<User> getAllUsers();

    void deleteUser(String jwtToken);
}
