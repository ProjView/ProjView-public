package com.example.ProjViewAPI.validator;

import com.example.ProjViewAPI.security.JwtUserDetailsService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RequiredArgsConstructor
public class UsernameValidator implements ConstraintValidator<ValidUsername, String> {

    private final JwtUserDetailsService userDetailsService;

    @Override
    public void initialize(ValidUsername constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        try {
            userDetailsService.loadUserByUsername(value);
        } catch (UsernameNotFoundException e) {
            return true;
        }
        return false;
    }
}
