package com.supermarket.api.service.impl;

import com.supermarket.api.dto.AuthResponse;
import com.supermarket.api.dto.LoginRequest;
import com.supermarket.api.dto.RegisterRequest;
import com.supermarket.api.dto.UserResponseDto;
import com.supermarket.api.entity.Role;
import com.supermarket.api.entity.User;
import com.supermarket.api.exception.BadRequestException;
import com.supermarket.api.exception.UnauthorizedException;
import com.supermarket.api.repository.UserRepository;
import com.supermarket.api.security.JwtService;
import com.supermarket.api.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public UserResponseDto register(RegisterRequest request) {
        // 1. Verificar si el email ya existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }

        // 2. Determinar rol por defecto
        Role role = request.getRole() != null ? request.getRole() : Role.CLIENTE;

        // 3. Validar regla de negocio específica: employeeId obligatorio para ADMIN y CAJERO
        if ((role == Role.ADMIN || role == Role.CAJERO) && 
                (request.getEmployeeId() == null || request.getEmployeeId().trim().isEmpty())) {
            throw new BadRequestException("El employeeId es requerido para cajeros y administradores");
        }

        // 4. Si se proporcionó employeeId, verificar que no esté duplicado
        if (request.getEmployeeId() != null && !request.getEmployeeId().trim().isEmpty()) {
            if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
                throw new BadRequestException("El employeeId ya está en uso");
            }
        }

        // 5. Encriptar contraseña
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // 6. Crear usuario
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordHash)
                .name(request.getName())
                .role(role)
                .employeeId(request.getEmployeeId() != null && !request.getEmployeeId().trim().isEmpty() ? request.getEmployeeId() : null)
                .loyaltyPoints(0)
                .build();

        User savedUser = userRepository.save(user);

        return UserResponseDto.fromEntity(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 1. Buscar usuario
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        // 2. Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        // 3. Generar Token JWT
        String token = jwtService.generateToken(user.getId().toString(), user.getRole().name());

        // 4. Retornar DTO con token y datos de usuario
        AuthResponse.AuthUserDto userDto = AuthResponse.AuthUserDto.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userDto)
                .build();
    }
}
