package com.shareapp.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shareapp.DataTransferObjects.TransactionDTO;
import com.shareapp.DataTransferObjects.UserResponseDTO;
import com.shareapp.DataTransferObjects.TransactionResponseDTO;
import com.shareapp.Service.TransactionService;


import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buyShare(@Valid @RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionResponseDTO response = transactionService.buyShare(transactionDTO.getAccountId(), transactionDTO.getStockSymbol(), transactionDTO.getQuantity());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellShare(@Valid @RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionResponseDTO response = transactionService.sellShare(transactionDTO.getAccountId(), transactionDTO.getStockSymbol(), transactionDTO.getQuantity());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
