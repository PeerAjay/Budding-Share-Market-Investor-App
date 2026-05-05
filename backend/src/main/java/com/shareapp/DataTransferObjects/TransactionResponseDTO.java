package com.shareapp.DataTransferObjects;

import java.math.BigDecimal;

public class TransactionResponseDTO {
    private String message;
    private BigDecimal remainingBalance;

    public TransactionResponseDTO(String message, BigDecimal remainingBalance) {
        this.message = message;
        this.remainingBalance = remainingBalance;
    }

    public String getMessage() { return message; }
    public BigDecimal getRemainingBalance() { return remainingBalance; }
}
