package com.shareapp.DataTransferObjects;

public class LeaderboardDTO {
    String userName;
    Double totalValue;
    int rank;

    public LeaderboardDTO(String username, Double totalValue, int rank){
        this.userName = username;
        this.totalValue = totalValue;
        this.rank = rank;
    }
}
