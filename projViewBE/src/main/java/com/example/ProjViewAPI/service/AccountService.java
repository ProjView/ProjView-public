package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.AdminRegisterRequest;
import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.entity.User;
import com.example.ProjViewAPI.enumeration.Role;
import com.example.ProjViewAPI.security.JwtRequestModel;
import com.example.ProjViewAPI.security.JwtResponseModel;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface AccountService {

    ResponseEntity<JwtResponseModel> registerUser(JwtRequestModel jwtRequestModel);

    ResponseEntity<JwtResponseModel> registerAdmin(AdminRegisterRequest registerRequest);

    List<User> getAllUsers();

    void deleteUser(String jwtToken);

    ResponseEntity<JwtResponseModel> generateJwtResponse(String username);

    ResponseEntity<JwtResponseModel> refreshAccessToken(String refreshToken);

    Set<Role> getUserAuthorities(String username);

    void removeAuthorityFromUser(String username, Role authority);
}
