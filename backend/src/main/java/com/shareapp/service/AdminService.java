package com.shareapp.service;

import com.shareapp.model.*;
import com.shareapp.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TradingAccountRepository tradingAccountRepository;
    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;
    private final StocksRepository stocksRepository;
    private final StockPriceHistoryRepository stockPriceHistoryRepository;

    public AdminService(UserRepository userRepository,
                        TradingAccountRepository tradingAccountRepository,
                        HoldingRepository holdingRepository,
                        TransactionRepository transactionRepository,
                        StocksRepository stocksRepository,
                        StockPriceHistoryRepository stockPriceHistoryRepository) {
        this.userRepository = userRepository;
        this.tradingAccountRepository = tradingAccountRepository;
        this.holdingRepository = holdingRepository;
        this.transactionRepository = transactionRepository;
        this.stocksRepository = stocksRepository;
        this.stockPriceHistoryRepository = stockPriceHistoryRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void banUser(Long userId) {
        User user = userRepository.findByid(userId);
        if (user == null) throw new RuntimeException("User not found");
        if ("ROLE_ADMIN".equals(user.getRole())) throw new RuntimeException("Cannot ban an admin");
        user.setBanned(true);
        userRepository.save(user);
    }

    @Transactional
    public void unbanUser(Long userId) {
        User user = userRepository.findByid(userId);
        if (user == null) throw new RuntimeException("User not found");
        user.setBanned(false);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findByid(userId);
        if (user == null) throw new RuntimeException("User not found");
        if ("ROLE_ADMIN".equals(user.getRole())) throw new RuntimeException("Cannot delete an admin");

        List<TradingAccount> accounts = tradingAccountRepository.findByUser(user);
        for (TradingAccount account : accounts) {
            transactionRepository.deleteAll(transactionRepository.findByAccountId(account.getId()));
            holdingRepository.deleteAll(holdingRepository.findAllByAccount(account));
        }
        tradingAccountRepository.deleteAll(accounts);
        userRepository.delete(user);
    }

    @Transactional
    public void deleteStock(String symbol) {
        Stock stock = stocksRepository.findBySymbol(symbol);
        if (stock == null) throw new RuntimeException("Stock not found: " + symbol);

        // Nullify stock FK in transactions to preserve transaction history
        transactionRepository.nullifyStock(stock);
        holdingRepository.deleteAll(holdingRepository.findAllByStock(stock));
        stockPriceHistoryRepository.deleteAll(stockPriceHistoryRepository.findByStockOrderByTimestampAsc(stock));
        stocksRepository.delete(stock);
    }
}
