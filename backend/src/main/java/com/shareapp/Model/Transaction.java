package com.shareapp.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.shareapp.model.TradingAccount;
import com.shareapp.model.Stock;    

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private TradingAccount account;

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;

    private String type; // "BUY" or "SELL"
    private int quantity;
    private Double price_at_transaction;
    private Double brokerage_fee;
    private Double total_value;
    private LocalDateTime timestamp;

    public Transaction() {}

    public Transaction(TradingAccount account, Stock stock, int quantity, Double price_at_transaction, double brokerage_fee) {
        this.account = account;
        this.stock = stock;
        this.quantity = quantity;
        this.price_at_transaction = price_at_transaction;
        this.brokerage_fee = brokerage_fee;
        this.total_value = quantity * price_at_transaction + brokerage_fee;
        this.timestamp = LocalDateTime.now();
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
    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Double getPrice_at_transaction() {
        return price_at_transaction;
    }
    public void setPrice_at_transaction(Double price_at_transaction) {
        this.price_at_transaction = price_at_transaction;
    }

    public Double getBrokerage_fee() {
        return brokerage_fee;
    }
    public void setBrokerage_fee(Double brokerage_fee) {
        this.brokerage_fee = brokerage_fee;
    }

    public Double getTotal_value() {
        return total_value;
    }
    public void setTotal_value(Double total_value) {
        this.total_value = total_value;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

}
