package com.shareapp.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.shareapp.model.Stock;
import com.shareapp.repository.StocksRepository;
import com.shareapp.model.User;
import com.shareapp.repository.UserRepository;
import com.shareapp.model.Holding;
import com.shareapp.repository.HoldingRepository;
import com.shareapp.model.TradingAccount;
import com.shareapp.repository.TradingAccountRepository;

public class TransactionService {
    private final StocksRepository stocksRepository;
    private final UserRepository userRepository;
    private final HoldingRepository holdingRepository;
    private final TradingAccountRepository tradingAccountRepository;

    public TransactionService(StocksRepository stocksRepository, UserRepository userRepository, HoldingRepository holdingRepository, TradingAccountRepository tradingAccountRepository) {
        this.stocksRepository = stocksRepository;
        this.userRepository = userRepository;
        this.holdingRepository = holdingRepository;
        this.tradingAccountRepository = tradingAccountRepository;
    }

    @Transactional
    public void buyStock(Long userId, String stockSymbol, int quantity) {
        //TODO: Implement buy stock logic
    }
}
