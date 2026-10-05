package com.supermarket.api.config;

import com.supermarket.api.entity.Role;
import com.supermarket.api.entity.User;
import com.supermarket.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Limpiar la base de datos para arrancar desde cero
            userRepository.deleteAll();

            // 1. Usuario ADMINISTRADOR por defecto
            User admin = User.builder()
                    .name("Administrador General")
                    .email("admin@correo.com")
                    .passwordHash(passwordEncoder.encode("Password123"))
                    .role(Role.ADMIN)
                    .employeeId("EMP-001")
                    .loyaltyPoints(0)
                    .build();
            userRepository.save(admin);

            // 2. Usuario CAJERO por defecto
            User cashier = User.builder()
                    .name("Carlos Mendoza")
                    .email("cajero@correo.com")
                    .passwordHash(passwordEncoder.encode("Password123"))
                    .role(Role.CAJERO)
                    .employeeId("EMP-002")
                    .loyaltyPoints(0)
                    .build();
            userRepository.save(cashier);

            // 3. Usuario CLIENTE por defecto (con puntos acumulados para probar en POS)
            User client = User.builder()
                    .name("Juan Pérez")
                    .email("cliente@correo.com")
                    .passwordHash(passwordEncoder.encode("Password123"))
                    .role(Role.CLIENTE)
                    .employeeId(null)
                    .loyaltyPoints(1450)
                    .build();
            userRepository.save(client);

            System.out.println("=================================================================");
            System.out.println(">>> [SupermarketApi] Base de datos inicializada desde cero:");
            System.out.println(">>> 1. ADMIN   : admin@correo.com   / Password123 (EMP-001)");
            System.out.println(">>> 2. CAJERO  : cajero@correo.com  / Password123 (EMP-002)");
            System.out.println(">>> 3. CLIENTE : cliente@correo.com / Password123 (1450 Puntos Fresh)");
            System.out.println("=================================================================");
        };
    }
}
