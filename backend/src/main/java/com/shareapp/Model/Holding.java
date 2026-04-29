package com.shareapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.shareapp.model.Stock;
import com.shareapp.model.User;

@Entity
@Table(name = "shares")
public class Holding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private Stock stock;
    private int quantity;
    private LocalDateTime purchaseDate;
    private Double buyPrice;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
