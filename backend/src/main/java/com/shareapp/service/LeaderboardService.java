package com.shareapp.service;

import com.shareapp.DataTransferObjects.LeaderboardDTO;
import com.shareapp.model.TradingAccount;
import com.shareapp.model.User;
import com.shareapp.repository.TradingAccountRepository;
import com.shareapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {
    private final UserRepository userRepository;
    private final TradingAccountRepository tradingAccountRepository;

    public LeaderboardService(UserRepository userRepository, TradingAccountRepository tradingAccountRepository) {
        this.userRepository = userRepository;
        this.tradingAccountRepository = tradingAccountRepository;
    }

    // public List<LeaderboardDTO> getLeaderboard() {
        
    // }

}
