package com.shareapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stock_id;

    private String symbol;
    private String companyName;

    @Column(name = "current_price")
    private Double currentPrice;

    public Stock() {}

    public Stock(String symbol, String companyName) {
        this.symbol = symbol;
        this.companyName = companyName;
    }

    public Stock(String symbol, String companyName, Double currentPrice) {
        this.symbol = symbol;
        this.companyName = companyName;
        this.currentPrice = currentPrice;
    }

    public Long getStock_id() {
        return stock_id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(Double currentPrice) {
        this.currentPrice = currentPrice;
    }
}
