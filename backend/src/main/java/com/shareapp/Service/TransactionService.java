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
import com.shareapp.model.StockPriceHistory;
import com.shareapp.repository.StockPriceHistoryRepository;
import com.shareapp.model.Transaction;
import com.shareapp.repository.TransactionRepository;

@Service
public class TransactionService {
    private final StocksRepository stocksRepository;
    private final UserRepository userRepository;
    private final HoldingRepository holdingRepository;
    private final TradingAccountRepository tradingAccountRepository;
    private final StockPriceHistoryRepository stocksPriceHistoryRepository;
    private final TransactionRepository transactionRepository;

    //Hardcoded brokerage fee CHANGE IF NEEDED
    private static final double BROKERAGE_FEE = 10.0;

    public TransactionService(StocksRepository stocksRepository, UserRepository userRepository, 
        HoldingRepository holdingRepository, TradingAccountRepository tradingAccountRepository, 
        StockPriceHistoryRepository stocksPriceHistoryRepository, TransactionRepository transactionRepository) {

        this.stocksRepository = stocksRepository;
        this.userRepository = userRepository;
        this.holdingRepository = holdingRepository;
        this.tradingAccountRepository = tradingAccountRepository;
        this.stocksPriceHistoryRepository = stocksPriceHistoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void buyStock(Long accountId, String stockSymbol, int quantity) {
        TradingAccount account = tradingAccountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        Stock stock = stocksRepository.findBySymbol(stockSymbol);
        if (stock == null) {
            throw new RuntimeException("Stock not found");
        }

        //Getting the latest price of the stock
        StockPriceHistory latestPrice = stocksPriceHistoryRepository.findTopByStockSymbolOrderByTimestampDesc(stock.getSymbol());

        double totalCost = quantity * latestPrice.getPrice() + BROKERAGE_FEE;

        if (account.getBalance().doubleValue() < totalCost) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct the cost from the account balance
        account.setBalance(account.getBalance().subtract(new java.math.BigDecimal(totalCost)));

        Holding holding = holdingRepository.findByTradingAccountAndStock(account, stock);

        if (holding == null) {
            holding = new Holding(account, stock, quantity, latestPrice.getPrice());
        } 
        else {
             // TODO: HANDLE THIS CASE
        }


        // Add the holding
        holdingRepository.save(holding);

        // Add the Transaction
        transactionRepository.save(new Transaction(account, stock, quantity, latestPrice.getPrice(), BROKERAGE_FEE));

    }
}
