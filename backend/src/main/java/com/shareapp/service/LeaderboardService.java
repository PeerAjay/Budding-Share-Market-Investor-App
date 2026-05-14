package com.shareapp.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.shareapp.DataTransferObjects.LeaderboardDTO;
import com.shareapp.model.Holding;
import com.shareapp.model.TradingAccount;
import com.shareapp.model.User;
import com.shareapp.repository.HoldingRepository;
import com.shareapp.repository.TradingAccountRepository;
import com.shareapp.repository.UserRepository;

@Service
public class LeaderboardService {
    private final TradingAccountRepository tradingAccountRepository;
    private final HoldingRepository holdingRepository;
    private final UserRepository userRepository;

    public LeaderboardService(
            TradingAccountRepository tradingAccountRepository,
            HoldingRepository holdingRepository,
            UserRepository userRepository) {
        this.tradingAccountRepository = tradingAccountRepository;
        this.holdingRepository = holdingRepository;
        this.userRepository = userRepository;
    }

    public List<LeaderboardDTO> getLeaderboard() {
        List<UserPortfolioValue> userTotals = new ArrayList<>();

        for (User user : userRepository.findAll()) {
            List<TradingAccount> accounts = tradingAccountRepository.findByUser(user);

            if (accounts.isEmpty()) {
                continue;
            }

            BigDecimal totalPortfolioValue = BigDecimal.ZERO;

            for (TradingAccount account : accounts) {
                if (account.getBalance() != null) {
                    totalPortfolioValue = totalPortfolioValue.add(account.getBalance());
                }

                List<Holding> holdings = holdingRepository.findAllByAccount(account);

                for (Holding holding : holdings) {
                    Double currentPriceDouble = holding.getStock() != null
                            ? holding.getStock().getCurrentPrice()
                            : null;

                    Double fallbackPriceDouble = holding.getAverageBuyPrice();

                    BigDecimal price = BigDecimal.valueOf(
                            currentPriceDouble != null
                                    ? currentPriceDouble
                                    : (fallbackPriceDouble != null ? fallbackPriceDouble : 0.0)
                    );

                    BigDecimal holdingValue = price.multiply(BigDecimal.valueOf(holding.getQuantity()));
                    totalPortfolioValue = totalPortfolioValue.add(holdingValue);
                }
            }

            userTotals.add(new UserPortfolioValue(user.getUsername(), totalPortfolioValue));
        }

        userTotals.sort(Comparator.comparing(UserPortfolioValue::getTotalValue).reversed());

        List<LeaderboardDTO> leaderboard = new ArrayList<>();
        for (int i = 0; i < userTotals.size(); i++) {
            UserPortfolioValue entry = userTotals.get(i);
            leaderboard.add(new LeaderboardDTO(entry.getUsername(), entry.getTotalValue(), i + 1));
        }

        return leaderboard;
    }

    private static class UserPortfolioValue {
        private final String username;
        private final BigDecimal totalValue;

        public UserPortfolioValue(String username, BigDecimal totalValue) {
            this.username = username;
            this.totalValue = totalValue;
        }

        public String getUsername() {
            return username;
        }

        public BigDecimal getTotalValue() {
            return totalValue;
        }
    }
}