package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.AdminRegisterRequest;
import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.entity.Admin;
import com.example.ProjViewAPI.entity.User;
import com.example.ProjViewAPI.exception.LoginException;
import com.example.ProjViewAPI.exception.RegisterException;
import com.example.ProjViewAPI.repository.AdminRepository;
import com.example.ProjViewAPI.repository.UserRepository;
import com.example.ProjViewAPI.security.JwtResponseModel;
import com.example.ProjViewAPI.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final PasswordEncoder passwordEncoder;

    private final TokenManager tokenManager;

    private final AdminRepository adminRepository;

    private final UserRepository userRepository;

    @Override
    public ResponseEntity<JwtResponseModel> registerUser(UserRegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RegisterException("Username is already taken", 409);
        }

        registerRequest.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        User user = new User(registerRequest);
        user = userRepository.save(user);
        String jwtToken = tokenManager.generateJwtToken(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponseModel(jwtToken));
    }


    @Override
    public ResponseEntity<JwtResponseModel> registerAdmin(AdminRegisterRequest registerRequest) {
        registerRequest.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        Admin admin = new Admin(registerRequest);
        admin = adminRepository.save(admin);
        String jwtToken = tokenManager.generateJwtToken(admin);

        return ResponseEntity.status(201).body(new JwtResponseModel(jwtToken));
    }

    @Override
    public void deleteUser(String jwtToken) {
        String username = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new LoginException("User was not found", 400);
        }
        userRepository.delete(userOptional.get());
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
