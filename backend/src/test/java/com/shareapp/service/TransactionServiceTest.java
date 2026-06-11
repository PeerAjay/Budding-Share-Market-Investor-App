package com.shareapp.service;

import com.shareapp.model.Holding;
import com.shareapp.model.Stock;
import com.shareapp.model.StockPriceHistory;
import com.shareapp.model.TradingAccount;
import com.shareapp.repository.HoldingRepository;
import com.shareapp.repository.StockPriceHistoryRepository;
import com.shareapp.repository.StocksRepository;
import com.shareapp.repository.TradingAccountRepository;
import com.shareapp.repository.TransactionRepository;
import com.shareapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private StocksRepository stocksRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HoldingRepository holdingRepository;

    @Mock
    private TradingAccountRepository tradingAccountRepository;

    @Mock
    private StockPriceHistoryRepository stockPriceHistoryRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void buyShare_success() {
        TradingAccount account = new TradingAccount();
        account.setBalance(new BigDecimal("1000.00"));

        Stock stock = new Stock("AAPL", "Apple Inc.");
        StockPriceHistory priceHistory = mock(StockPriceHistory.class);

        when(tradingAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(stocksRepository.findBySymbol("AAPL")).thenReturn(stock);
        when(stockPriceHistoryRepository.findTopByStockSymbolOrderByTimestampDesc("AAPL"))
                .thenReturn(priceHistory);
        when(priceHistory.getPrice()).thenReturn(100.0);
        when(holdingRepository.findByAccountAndStock(account, stock)).thenReturn(null);

        Object result = transactionService.buyShare(1L, "AAPL", 2);

        assertNotNull(result);
        verify(holdingRepository).save(any(Holding.class));
        verify(transactionRepository).save(any());
        verify(tradingAccountRepository).save(account);
    }

    @Test
    void buyShare_insufficientBalance_throwsException() {
        TradingAccount account = new TradingAccount();
        account.setBalance(new BigDecimal("100.00"));

        Stock stock = new Stock("AAPL", "Apple Inc.");
        StockPriceHistory priceHistory = mock(StockPriceHistory.class);

        when(tradingAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(stocksRepository.findBySymbol("AAPL")).thenReturn(stock);
        when(stockPriceHistoryRepository.findTopByStockSymbolOrderByTimestampDesc("AAPL"))
                .thenReturn(priceHistory);
        when(priceHistory.getPrice()).thenReturn(100.0);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.buyShare(1L, "AAPL", 2);
        });

        assertEquals("Insufficient balance", exception.getMessage());
        verify(holdingRepository, never()).save(any());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void sellShare_success() {
        TradingAccount account = new TradingAccount();
        account.setBalance(new BigDecimal("1000.00"));

        Stock stock = new Stock("AAPL", "Apple Inc.");
        Holding holding = new Holding(account, stock, 5, 80.0);
        StockPriceHistory priceHistory = mock(StockPriceHistory.class);

        when(tradingAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(stocksRepository.findBySymbol("AAPL")).thenReturn(stock);
        when(holdingRepository.findByAccountAndStock(account, stock)).thenReturn(holding);
        when(stockPriceHistoryRepository.findTopByStockSymbolOrderByTimestampDesc("AAPL"))
                .thenReturn(priceHistory);
        when(priceHistory.getPrice()).thenReturn(100.0);

        Object result = transactionService.sellShare(1L, "AAPL", 2);

        assertNotNull(result);
        verify(holdingRepository).save(holding);
        verify(transactionRepository).save(any());
        verify(tradingAccountRepository).save(account);
    }

    @Test
    void sellShare_notEnoughShares_throwsException() {
        TradingAccount account = new TradingAccount();
        account.setBalance(new BigDecimal("1000.00"));

        Stock stock = new Stock("AAPL", "Apple Inc.");
        Holding holding = new Holding(account, stock, 1, 80.0);
        StockPriceHistory priceHistory = mock(StockPriceHistory.class);

        when(tradingAccountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(stocksRepository.findBySymbol("AAPL")).thenReturn(stock);
        when(holdingRepository.findByAccountAndStock(account, stock)).thenReturn(holding);
        when(stockPriceHistoryRepository.findTopByStockSymbolOrderByTimestampDesc("AAPL"))
                .thenReturn(priceHistory);
        when(priceHistory.getPrice()).thenReturn(100.0);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.sellShare(1L, "AAPL", 3);
        });

        assertEquals("Not enough shares to sell", exception.getMessage());
        verify(transactionRepository, never()).save(any());
    }
}