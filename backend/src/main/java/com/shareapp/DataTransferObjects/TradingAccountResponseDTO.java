package com.shareapp.DataTransferObjects;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TradingAccountResponseDTO {
    private Long id;
    private String accountName;
    private BigDecimal balance;
    private LocalDateTime createdAt;

    public TradingAccountResponseDTO(Long id, String accountName, BigDecimal balance, LocalDateTime createdAt) {
        this.id = id;
        this.accountName = accountName;
        this.balance = balance;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getAccountName() { return accountName; }
    public BigDecimal getBalance() { return balance; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
