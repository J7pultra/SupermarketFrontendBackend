package com.supermarket.api.service;

import com.supermarket.api.dto.AuthResponse;
import com.supermarket.api.dto.LoginRequest;
import com.supermarket.api.dto.RegisterRequest;
import com.supermarket.api.dto.UserResponseDto;

public interface AuthService {
    UserResponseDto register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
