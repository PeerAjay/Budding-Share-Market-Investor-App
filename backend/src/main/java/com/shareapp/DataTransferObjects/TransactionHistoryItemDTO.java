package com.shareapp.DataTransferObjects;

import java.time.LocalDateTime;

public class TransactionHistoryItemDTO {
    private Long id;
    private String stockSymbol;
    private String companyName;
    private String type;
    private int quantity;
    private Double priceAtTransaction;
    private Double brokerageFee;
    private Double totalValue;
    private LocalDateTime timestamp;

    public TransactionHistoryItemDTO(
            Long id,
            String stockSymbol,
            String companyName,
            String type,
            int quantity,
            Double priceAtTransaction,
            Double brokerageFee,
            Double totalValue,
            LocalDateTime timestamp
    ) {
        this.id = id;
        this.stockSymbol = stockSymbol;
        this.companyName = companyName;
        this.type = type;
        this.quantity = quantity;
        this.priceAtTransaction = priceAtTransaction;
        this.brokerageFee = brokerageFee;
        this.totalValue = totalValue;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public String getStockSymbol() { return stockSymbol; }
    public String getCompanyName() { return companyName; }
    public String getType() { return type; }
    public int getQuantity() { return quantity; }
    public Double getPriceAtTransaction() { return priceAtTransaction; }
    public Double getBrokerageFee() { return brokerageFee; }
    public Double getTotalValue() { return totalValue; }
    public LocalDateTime getTimestamp() { return timestamp; }
}