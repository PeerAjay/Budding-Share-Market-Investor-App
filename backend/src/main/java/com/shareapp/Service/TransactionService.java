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
import com.shareapp.DataTransferObjects.TransactionResponseDTO;


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
    public TransactionResponseDTO buyShare(Long accountId, String stockSymbol, int quantity) {
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

        Holding holding = holdingRepository.findByAccountAndStock(account, stock);

        if (holding == null) {
            holding = new Holding(account, stock, quantity, latestPrice.getPrice());
        } 
        else {
            holding.setAverageBuyPrice((holding.getAverageBuyPrice() * holding.getQuantity() + latestPrice.getPrice() * quantity) / (holding.getQuantity() + quantity));
            holding.setQuantity(holding.getQuantity() + quantity);
        }   

        // Add the holding
        holdingRepository.save(holding);

        // Add the BUY Transaction
        transactionRepository.save(new Transaction("BUY", account, stock, quantity, latestPrice.getPrice(), BROKERAGE_FEE));

        //Saving the account
        tradingAccountRepository.save(account);

        return new TransactionResponseDTO("Stock purchased successfully", account.getBalance());
    }

    @Transactional
    public TransactionResponseDTO sellShare(Long accountId, String stockSymbol, int quantity) {
        TradingAccount account = tradingAccountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        Stock stock = stocksRepository.findBySymbol(stockSymbol);
        if (stock == null) {
            throw new RuntimeException("Stock not found");
        }
        Holding holding = holdingRepository.findByAccountAndStock(account, stock);

        //Getting the latest price of the stock
        StockPriceHistory latestPrice = stocksPriceHistoryRepository.findTopByStockSymbolOrderByTimestampDesc(stock.getSymbol());

        if(holding == null || holding.getQuantity() < quantity) {
            throw new RuntimeException("Not enough shares to sell");
        }

        //Adding the funds from selling back intot he account, minus the brokerage fee
        account.setBalance(account.getBalance().add(new java.math.BigDecimal(quantity * latestPrice.getPrice() - BROKERAGE_FEE)));

        //Deleitng the holding object if all the shares are sold, if theres some left then update the quantity and save
        if (holding.getQuantity() == quantity) {
            holdingRepository.delete(holding);
        } else {
            holding.setQuantity(holding.getQuantity() - quantity);
            holdingRepository.save(holding);
        }

        //Adding the SELL transaction
        transactionRepository.save(new Transaction("SELL", account, stock, quantity, latestPrice.getPrice(), BROKERAGE_FEE));

        //Saving the account
        tradingAccountRepository.save(account);
        return new TransactionResponseDTO("Stock sold successfully", account.getBalance());
    }
    

}
