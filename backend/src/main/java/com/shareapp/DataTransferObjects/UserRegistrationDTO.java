package com.shareapp.DataTransferObjects;

import jakarta.validation.constraints.Email;

public class UserRegistrationDTO {
    private String username;

    @Email(message = "Email must be a valid email address")
    private String email;

    // TODO: add password validation (e.g. minimum length, uppercase, special character requirements)
    private String password;
    private String confirmPassword;

    // Getters
    public String getUsername() {
        return username; 
    }

    public String getEmail() {
        return email; 
    }

    public String getPassword() { 
        return password;
    }

    public String getConfirmPassword() { 
        return confirmPassword; 
    }

    // Setters
    public void setUsername(String username) { 
        this.username = username; 
    }

    public void setEmail(String email) { 
        this.email = email; 
    }

    public void setPassword(String password) { 
        this.password = password; 
    }

    public void setConfirmPassword(String confirmPassword) { 
        this.confirmPassword = confirmPassword; 
    }

}
    