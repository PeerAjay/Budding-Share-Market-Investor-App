package com.shareapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shareapp.DataTransferObjects.TransactionDTO;
import com.shareapp.DataTransferObjects.TransactionResponseDTO;
import com.shareapp.service.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getTransactionsByAccount(@PathVariable Long accountId) {
        try {
            return ResponseEntity.ok(transactionService.getTransactionsByAccount(accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buyShare(@Valid @RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionResponseDTO response = transactionService.buyShare(
                    transactionDTO.getAccountId(),
                    transactionDTO.getStockSymbol(),
                    transactionDTO.getQuantity()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellShare(@Valid @RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionResponseDTO response = transactionService.sellShare(
                    transactionDTO.getAccountId(),
                    transactionDTO.getStockSymbol(),
                    transactionDTO.getQuantity()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}