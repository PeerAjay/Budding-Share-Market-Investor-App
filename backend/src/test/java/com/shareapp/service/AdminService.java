package com.shareapp.service;

import com.shareapp.model.Stock;
import com.shareapp.model.User;
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

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TradingAccountRepository tradingAccountRepository;

    @Mock
    private HoldingRepository holdingRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private StocksRepository stocksRepository;

    @Mock
    private StockPriceHistoryRepository stockPriceHistoryRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void banUser_success() {
        User user = new User();
        user.setUsername("standarduser");
        user.setRole("ROLE_USER");
        user.setBanned(false);

        when(userRepository.findByid(1L)).thenReturn(user);

        adminService.banUser(1L);

        assertTrue(user.isBanned());
        verify(userRepository).save(user);
    }

    @Test
    void banUser_admin_throwsException() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setRole("ROLE_ADMIN");

        when(userRepository.findByid(1L)).thenReturn(admin);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adminService.banUser(1L);
        });

        assertEquals("Cannot ban an admin", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void unbanUser_success() {
        User user = new User();
        user.setUsername("banneduser");
        user.setRole("ROLE_USER");
        user.setBanned(true);

        when(userRepository.findByid(1L)).thenReturn(user);

        adminService.unbanUser(1L);

        assertFalse(user.isBanned());
        verify(userRepository).save(user);
    }

    @Test
    void deleteStock_success() {
        Stock stock = new Stock("AAPL", "Apple Inc.");

        when(stocksRepository.findBySymbol("AAPL")).thenReturn(stock);
        when(holdingRepository.findAllByStock(stock)).thenReturn(Collections.emptyList());
        when(stockPriceHistoryRepository.findByStockOrderByTimestampAsc(stock)).thenReturn(Collections.emptyList());

        adminService.deleteStock("AAPL");

        verify(transactionRepository).nullifyStock(stock);
        verify(holdingRepository).deleteAll(Collections.emptyList());
        verify(stockPriceHistoryRepository).deleteAll(Collections.emptyList());
        verify(stocksRepository).delete(stock);
    }
}