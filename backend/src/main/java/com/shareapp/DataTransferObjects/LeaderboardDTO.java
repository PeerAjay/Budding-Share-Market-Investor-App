package com.shareapp.DataTransferObjects;

import java.math.BigDecimal;

public class LeaderboardDTO {
    private String userName;
    private BigDecimal totalValue;
    private int rank;

    public LeaderboardDTO(String username, BigDecimal totalValue, int rank) {
        this.userName = username;
        this.totalValue = totalValue;
        this.rank = rank;
    }

    public String getUserName() {
        return userName;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public int getRank() {
        return rank;
    }
}