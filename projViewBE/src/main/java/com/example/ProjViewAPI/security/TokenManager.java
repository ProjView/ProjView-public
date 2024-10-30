package com.example.ProjViewAPI.security;


import com.example.ProjViewAPI.entity.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class TokenManager implements Serializable {

    @Serial
    private static final long serialVersionUID = 7008375124389347049L;

    //10 minutes
    public static final long TOKEN_VALIDITY = 10 * 60;

    //1 day
    public static final long REFRESH_TOKEN_VALIDITY = 24 * 60 * 60;

    @Value("${jwt.auth.converter.secret}")
    private String jwtSecret;

    public String generateJwtToken(String refreshToken) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", userAccount.getId());
        return Jwts.builder().setClaims(claims).setSubject(userAccount.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    public String generateRefreshToken(UserAccount userAccount) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", userAccount.getId());
        return Jwts.builder().setClaims(claims).setSubject(userAccount.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    public Boolean validateJwtToken(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
//        SecretKey secret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(token));
        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
//        Claims claims = Jwts.parser().verifyWith(secret).build().parseSignedClaims(token).getPayload();
        boolean isTokenExpired = claims.getExpiration().before(new Date());
        return (username.equals(userDetails.getUsername()) && !isTokenExpired);
    }

    public String getUsernameFromToken(String token) {
        final Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}
