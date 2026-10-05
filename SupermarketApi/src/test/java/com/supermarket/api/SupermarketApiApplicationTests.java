package com.supermarket.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.supermarket.api.dto.LoginRequest;
import com.supermarket.api.dto.RegisterRequest;
import com.supermarket.api.entity.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class SupermarketApiApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Contexto de Spring carga correctamente")
    void contextLoads() {
    }

    @Test
    @DisplayName("GET /health responde 200 OK y estado correcto")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("OK")))
                .andExpect(jsonPath("$.message", is("API funcionando correctamente")));
    }

    @Test
    @DisplayName("POST /api/auth/register registra cliente exitosamente")
    void testRegisterClientSuccess() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("cliente@correo.com")
                .password("Password123")
                .name("Juan Perez")
                .role(Role.CLIENTE)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.message", is("Usuario registrado exitosamente")))
                .andExpect(jsonPath("$.data.email", is("cliente@correo.com")))
                .andExpect(jsonPath("$.data.name", is("Juan Perez")))
                .andExpect(jsonPath("$.data.role", is("CLIENTE")))
                .andExpect(jsonPath("$.data.loyaltyPoints", is(0)));
    }

    @Test
    @DisplayName("POST /api/auth/register rechaza ADMIN sin employeeId")
    void testRegisterAdminWithoutEmployeeIdFails() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("admin@correo.com")
                .password("Password123")
                .name("Admin User")
                .role(Role.ADMIN)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.message", is("El employeeId es requerido para cajeros y administradores")));
    }

    @Test
    @DisplayName("POST /api/auth/register registra ADMIN con employeeId exitosamente")
    void testRegisterAdminWithEmployeeIdSuccess() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("admin@correo.com")
                .password("Password123")
                .name("Admin User")
                .role(Role.ADMIN)
                .employeeId("EMP-001")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.employeeId", is("EMP-001")));
    }

    @Test
    @DisplayName("POST /api/auth/login genera token JWT y permite acceso a endpoints protegidos")
    void testLoginAndProtectedEndpoints() throws Exception {
        // 1. Registrar un Admin
        RegisterRequest adminReq = RegisterRequest.builder()
                .email("boss@correo.com")
                .password("AdminPass123")
                .name("Jefe Admin")
                .role(Role.ADMIN)
                .employeeId("EMP-999")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminReq)))
                .andExpect(status().isCreated());

        // 2. Iniciar sesión con Admin
        LoginRequest loginReq = LoginRequest.builder()
                .email("boss@correo.com")
                .password("AdminPass123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andReturn();

        JsonNode responseJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = responseJson.get("data").get("token").asText();

        // 3. Probar /api/auth/profile con el token
        mockMvc.perform(get("/api/auth/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Perfil de usuario")))
                .andExpect(jsonPath("$.user.role", is("ADMIN")));

        // 4. Probar /api/auth/admin-only con el token
        mockMvc.perform(get("/api/auth/admin-only")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Bienvenido, Administrador")));

        // 5. Probar /api/auth/cashier-area con el token
        mockMvc.perform(get("/api/auth/cashier-area")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Área de facturación y validación")));

        // 6. Probar /api/auth/profile sin token -> 401 Unauthorized
        mockMvc.perform(get("/api/auth/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Cliente autenticado no puede acceder a /api/auth/admin-only (403 Forbidden)")
    void testClientForbiddenOnAdminOnly() throws Exception {
        // 1. Registrar cliente
        RegisterRequest clientReq = RegisterRequest.builder()
                .email("cliente2@correo.com")
                .password("Password123")
                .name("Cliente Regular")
                .role(Role.CLIENTE)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(clientReq)))
                .andExpect(status().isCreated());

        // 2. Login
        LoginRequest loginReq = LoginRequest.builder()
                .email("cliente2@correo.com")
                .password("Password123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = responseJson.get("data").get("token").asText();

        // 3. Acceder a admin-only -> 403 Forbidden
        mockMvc.perform(get("/api/auth/admin-only")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("error")));
    }
}
