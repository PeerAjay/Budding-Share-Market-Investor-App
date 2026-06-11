package com.shareapp.service;

import com.shareapp.DataTransferObjects.UserRegistrationDTO;
import com.shareapp.model.User;
import com.shareapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void registerUser_success() {
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setUsername("testuser");
        dto.setEmail("test@example.com");
        dto.setPassword("Test123!");
        dto.setConfirmPassword("Test123!");

        when(userRepository.findByUsername("testuser")).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(null);
        when(passwordEncoder.encode("Test123!")).thenReturn("hashedPassword");

        User savedUser = new User();
        savedUser.setUsername("testuser");
        savedUser.setEmail("test@example.com");
        savedUser.setPassword("hashedPassword");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.registerUser(dto);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_passwordsDoNotMatch_throwsException() {
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setUsername("testuser");
        dto.setEmail("test@example.com");
        dto.setPassword("Test123!");
        dto.setConfirmPassword("Wrong123!");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(dto);
        });

        assertEquals("Passwords do not match", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_duplicateUsername_throwsException() {
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setUsername("testuser");
        dto.setEmail("test@example.com");
        dto.setPassword("Test123!");
        dto.setConfirmPassword("Test123!");

        when(userRepository.findByUsername("testuser")).thenReturn(new User());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(dto);
        });

        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_duplicateEmail_throwsException() {
        UserRegistrationDTO dto = new UserRegistrationDTO();
        dto.setUsername("testuser");
        dto.setEmail("test@example.com");
        dto.setPassword("Test123!");
        dto.setConfirmPassword("Test123!");

        when(userRepository.findByUsername("testuser")).thenReturn(null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(new User());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(dto);
        });

        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}