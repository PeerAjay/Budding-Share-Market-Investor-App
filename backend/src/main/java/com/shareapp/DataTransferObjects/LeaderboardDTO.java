package com.shareapp.DataTransferObjects;
import java.math.BigDecimal;

public class LeaderboardDTO {
    String userName;
    BigDecimal totalValue;
    int rank;

    public LeaderboardDTO(String username, BigDecimal totalValue, int rank){
        this.userName = username;
        this.totalValue = totalValue;
        this.rank = rank;
    }
}
