package com.shareapp.DataTransferObjects;
import java.math.BigDecimal;

import java.util.List;

public class LeaderboardResponseDTO {
    private List<LeaderboardDTO> leaderboard;
    private int yourRank;
    private BigDecimal yourTotalValue;

    public LeaderboardResponseDTO(List<LeaderboardDTO> leaderboard, int yourRank, BigDecimal yourTotalValue) {
        this.leaderboard = leaderboard;
        this.yourRank = yourRank;
        this.yourTotalValue = yourTotalValue;
    }

    public List<LeaderboardDTO> getLeaderboard() { 
        return leaderboard; 
    }

    public int getYourRank() { 
        return yourRank; 
    }

    public BigDecimal getYourTotalValue() { 
        return yourTotalValue;
    }

}
