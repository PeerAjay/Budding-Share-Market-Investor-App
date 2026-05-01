package com.shareapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.shareapp.model.Stock;
import com.shareapp.model.User;
import com.shareapp.model.TradingAccount;

@Entity
@Table(name = "shares")
public class Holding {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private TradingAccount account;
    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;
    private int quantity;
    private Double averageBuyPrice;

    public Holding() {}

    public Holding(TradingAccount account, Stock stock, int quantity, Double price) {
        this.account = account;
        this.stock = stock;
        this.quantity = quantity;
        this.averageBuyPrice = price;
    }

    public Long getId() {
        return id;
    }

    public TradingAccount getAccount() {
        return account;
    }

    public void setAccount(TradingAccount account) {
        this.account = account;
    }

    public Stock getStock() {
        return stock;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    } 

    public Double getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public void setAverageBuyPrice(Double averageBuyPrice) {
        this.averageBuyPrice = averageBuyPrice;
    }

}
