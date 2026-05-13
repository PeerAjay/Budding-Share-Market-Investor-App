package com.shareapp;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

import com.shareapp.model.Stock;
import com.shareapp.model.StockPriceHistory;
import com.shareapp.repository.StocksRepository;
import com.shareapp.repository.StockPriceHistoryRepository;
import com.shareapp.model.User;
import com.shareapp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DummyData implements CommandLineRunner{
    private final StocksRepository stocksRepository;
    private final StockPriceHistoryRepository stocksPriceHistoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DummyData(
            StocksRepository stocksRepository,
            StockPriceHistoryRepository stocksPriceHistoryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.stocksRepository = stocksRepository;
        this.stocksPriceHistoryRepository = stocksPriceHistoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
//        seedStocks();
        seedUsers();
    }

    private void seedStocks() {
        if (stocksRepository.count() == 0) {
            // Adding some dummy stocks
            stocksRepository.save(new Stock("XJO", "ASX 200", 7000.0));
            stocksPriceHistoryRepository.save(new StockPriceHistory(stocksRepository.findBySymbol("XJO"), 7000.0, LocalDateTime.now().minusDays(1)));

            stocksRepository.save(new Stock("CBA", "COMMONWEALTH BANK OF AUSTRALIA", 100.0));
            stocksPriceHistoryRepository.save(new StockPriceHistory(stocksRepository.findBySymbol("CBA"), 100.0, LocalDateTime.now().minusDays(1)));

            stocksRepository.save(new Stock("BHP", "BHB GROUP LIMITED", 150.0));
            stocksPriceHistoryRepository.save(new StockPriceHistory(stocksRepository.findBySymbol("BHP"), 150.0, LocalDateTime.now().minusDays(1)));
        }
    }

    private void seedUsers() {
        createUserIfNotExists("john", "john@example.com", "password123", "USER");
        createUserIfNotExists("jane", "jane@example.com", "password123", "USER");
        createUserIfNotExists("admin", "admin@example.com", "admin123", "ADMIN");
    }

    private void createUserIfNotExists(String username, String email, String rawPassword, String role) {
        if (userRepository.findByEmail(email) != null) {
            return;
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);

        userRepository.save(user);
    }
}
