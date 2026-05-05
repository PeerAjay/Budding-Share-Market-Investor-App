package com.shareapp.DataTransferObjects;

public class HoldingResponseDTO {
    private String stockSymbol;
    private String companyName;
    private int quantity;
    private Double averageBuyPrice;
    private Double currentPrice;
    private Double currentValue;
    private Double profitLoss;

    public HoldingResponseDTO(String stockSymbol, String companyName, int quantity,
            Double averageBuyPrice, Double currentPrice, Double currentValue, Double profitLoss) {
        this.stockSymbol = stockSymbol;
        this.companyName = companyName;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
        this.currentPrice = currentPrice;
        this.currentValue = currentValue;
        this.profitLoss = profitLoss;
    }

    public String getStockSymbol() { return stockSymbol; }
    public String getCompanyName() { return companyName; }
    public int getQuantity() { return quantity; }
    public Double getAverageBuyPrice() { return averageBuyPrice; }
    public Double getCurrentPrice() { return currentPrice; }
    public Double getCurrentValue() { return currentValue; }
    public Double getProfitLoss() { return profitLoss; }
}
