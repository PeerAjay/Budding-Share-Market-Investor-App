package com.shareapp.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.shareapp.DataTransferObjects.LeaderboardDTO;
import com.shareapp.DataTransferObjects.LeaderboardResponseDTO;
import com.shareapp.model.User;
import com.shareapp.repository.TradingAccountRepository;

@Service
public class LeaderboardService {
    private final TradingAccountRepository tradingAccountRepository;

    public LeaderboardService(TradingAccountRepository tradingAccountRepository) {
        this.tradingAccountRepository = tradingAccountRepository;
    }

    public LeaderboardResponseDTO getLeaderboard(Long userId) {
        List<Object[]> users = tradingAccountRepository.findUserTotalBalancesRanked();
        List<LeaderboardDTO> leaderboard = new ArrayList<>();

        int yourRank = 0;
        BigDecimal yourTotalValue = BigDecimal.ZERO;

        for (int i = 0; i < users.size(); i++) {
            User user = (User) users.get(i)[0];
            BigDecimal totalBalance = (BigDecimal) users.get(i)[1];

            leaderboard.add(new LeaderboardDTO(user.getUsername(), totalBalance, i + 1));

            if (user.getId().equals(userId)) {
                yourRank = i + 1;
                yourTotalValue = totalBalance;
            }
        }

        return new LeaderboardResponseDTO(leaderboard, yourRank, yourTotalValue);
    }

}