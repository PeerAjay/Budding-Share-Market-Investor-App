package com.shareapp.DataTransferObjects;

public class TransactionDTO {
    private Long accountId;
    private String stockSymbol;
    private int quantity;

    public Long getAccountId() { return accountId; }
    public String getStockSymbol() { return stockSymbol; }
    public int getQuantity() { return quantity; }

    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public void setStockSymbol(String stockSymbol) { this.stockSymbol = stockSymbol; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
