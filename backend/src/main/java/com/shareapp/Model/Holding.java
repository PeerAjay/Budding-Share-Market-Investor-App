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
    private Stock stock;
    private int quantity;
    private LocalDateTime purchaseDate;
    private Double buyPrice;

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

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public Double getBuyPrice() {
        return buyPrice;
    }

}
