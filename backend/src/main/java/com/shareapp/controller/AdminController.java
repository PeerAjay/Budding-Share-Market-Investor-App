package com.shareapp.controller;

import com.shareapp.model.User;
import com.shareapp.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<String> banUser(@PathVariable Long id) {
        try {
            adminService.banUser(id);
            return ResponseEntity.ok("User banned successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<String> unbanUser(@PathVariable Long id) {
        try {
            adminService.unbanUser(id);
            return ResponseEntity.ok("User unbanned successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/stocks/{symbol}")
    public ResponseEntity<String> deleteStock(@PathVariable String symbol) {
        try {
            adminService.deleteStock(symbol);
            return ResponseEntity.ok("Stock deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
