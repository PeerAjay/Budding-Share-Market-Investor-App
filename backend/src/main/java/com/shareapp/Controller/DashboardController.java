package com.shareapp.controller;

import com.shareapp.DataTransferObjects.TradingAccountRequestDTO;
import com.shareapp.DataTransferObjects.TradingAccountResponseDTO;
import com.shareapp.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<TradingAccountResponseDTO>> getTradingAccounts(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(dashboardService.getTradingAccounts(email));
    }

    @PostMapping("/accounts")
    public ResponseEntity<TradingAccountResponseDTO> openTradingAccount(
            Authentication authentication,
            @RequestBody TradingAccountRequestDTO requestDTO) {
        String email = authentication.getName();
        return ResponseEntity.ok(dashboardService.openTradingAccount(email, requestDTO));
    }
}
