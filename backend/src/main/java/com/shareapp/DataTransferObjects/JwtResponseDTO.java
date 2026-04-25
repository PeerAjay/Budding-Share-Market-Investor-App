package com.shareapp.DataTransferObjects;

public class JwtResponseDTO {
    private String token;
    private String username;

    public JwtResponseDTO(String token, String username) {
        this.token = token;
        this.username = username;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
}
