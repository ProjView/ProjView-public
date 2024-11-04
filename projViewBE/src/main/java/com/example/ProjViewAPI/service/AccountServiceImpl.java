package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.AdminRegisterRequest;
import com.example.ProjViewAPI.entity.Admin;
import com.example.ProjViewAPI.entity.User;
import com.example.ProjViewAPI.entity.UserAccount;
import com.example.ProjViewAPI.enumeration.Role;
import com.example.ProjViewAPI.exception.LoginException;
import com.example.ProjViewAPI.exception.RegisterException;
import com.example.ProjViewAPI.repository.AdminRepository;
import com.example.ProjViewAPI.repository.UserRepository;
import com.example.ProjViewAPI.security.JwtRequestModel;
import com.example.ProjViewAPI.security.JwtResponseModel;
import com.example.ProjViewAPI.security.JwtUserDetailsService;
import com.example.ProjViewAPI.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final PasswordEncoder passwordEncoder;

    private final TokenManager tokenManager;

    private final AdminRepository adminRepository;

    private final UserRepository userRepository;

    private final JwtUserDetailsService jwtUserDetailsService;

    @Override
    public ResponseEntity<JwtResponseModel> registerUser(JwtRequestModel jwtRequestModel) {
        if (userRepository.findByUsername(jwtRequestModel.getUsername()).isPresent()) {
            throw new RegisterException("Username is already taken", 409);
        }

        jwtRequestModel.setPassword(passwordEncoder.encode(jwtRequestModel.getPassword()));
        User user = new User(jwtRequestModel);
        user = userRepository.save(user);
        String jwtToken = tokenManager.generateJwtToken(user);
        String refreshToken = tokenManager.generateRefreshToken(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponseModel(
                jwtToken,
                user.getAuthorities().contains(Role.ADMIN),
                refreshToken));
    }


    @Override
    public ResponseEntity<JwtResponseModel> registerAdmin(AdminRegisterRequest registerRequest) {
        registerRequest.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        Admin admin = new Admin(registerRequest);
        admin = adminRepository.save(admin);
        String jwtToken = tokenManager.generateJwtToken(admin);
        String refreshToken = tokenManager.generateRefreshToken(admin);

        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponseModel(
                jwtToken,
                admin.getAuthorities().contains(Role.ADMIN),
                refreshToken));
    }

    @Override
    public void deleteUser(String jwtToken) {
        String username = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new LoginException("User was not found", 403);
        }
        userRepository.delete(userOptional.get());
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Set<Role> getUserAuthorities(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            return userOptional.get().getAuthorities();
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void removeAuthorityFromUser(String username, Role authority) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove the authority from the user
        user.getAuthorities().remove(authority);
        userRepository.save(user); // Save the updated user back to the database
    }


    @Override
    public ResponseEntity<JwtResponseModel> generateJwtResponse(String username) {
        final UserAccount userAccount = jwtUserDetailsService.loadUserByUsername(username);
        final String jwtToken = tokenManager.generateJwtToken(userAccount);
        final String refreshToken = tokenManager.generateRefreshToken(userAccount);
        return ResponseEntity.status(HttpStatus.OK).body(new JwtResponseModel(
                jwtToken,
                userAccount.getAuthorities().contains(Role.ADMIN),
                refreshToken));
    }

    @Override
    public ResponseEntity<JwtResponseModel> refreshAccessToken(String refreshToken) {
        String username = this.tokenManager.getUsernameFromToken(refreshToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new LoginException("User was not found", 403);
        }
        String jwtToken = tokenManager.generateJwtToken(userOptional.get());
        return ResponseEntity.status(HttpStatus.OK).body(new JwtResponseModel(
                jwtToken,
                userOptional.get().getAuthorities().contains(Role.ADMIN),
                refreshToken));
    }
}
