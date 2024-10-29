package com.example.ProjViewAPI;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@OpenAPIDefinition(
        info = @Info(title = "API Documentation", version = "1.0", description = "API documentation with JWT authorization"),
        security = @SecurityRequirement(name = "bearerAuthorization")
)
@SecurityScheme(
        name = "bearerAuthorization",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenAPIConfig {
}
