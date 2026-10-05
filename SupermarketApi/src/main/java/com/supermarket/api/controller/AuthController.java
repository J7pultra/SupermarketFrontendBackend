package com.supermarket.api.controller;

import com.supermarket.api.dto.*;
import com.supermarket.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponseDto user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario registrado exitosamente", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse result = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Autenticación exitosa", result));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> !auth.startsWith("ROLE_"))
                .findFirst()
                .orElse("CLIENTE");

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("userId", userId);
        userMap.put("role", role);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Perfil de usuario");
        response.put("user", userMap);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin-only")
    public ResponseEntity<Map<String, String>> adminOnly() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Bienvenido, Administrador");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cashier-area")
    public ResponseEntity<Map<String, String>> cashierArea() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Área de facturación y validación");
        return ResponseEntity.ok(response);
    }
}
