package com.shareapp;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

import com.shareapp.model.Stock;
import com.shareapp.model.StockPriceHistory;
import com.shareapp.repository.StocksRepository; 
import com.shareapp.repository.StockPriceHistoryRepository;   

@Component
public class DummyData implements CommandLineRunner{
    private final StocksRepository stocksRepository;
    private final StockPriceHistoryRepository stocksPriceHistoryRepository;

    public DummyData(StocksRepository stocksRepository , StockPriceHistoryRepository stocksPriceHistoryRepository) {
        this.stocksRepository = stocksRepository;
        this.stocksPriceHistoryRepository = stocksPriceHistoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if(stocksRepository.count() == 0) {
            // Adding some dummy stocks
            stocksRepository.save(new Stock("XJO", "ASX 200"));
            stocksPriceHistoryRepository.save(new StockPriceHistory(stocksRepository.findBySymbol("XJO"), 7000.0, LocalDateTime.now().minusDays(1)));

            stocksRepository.save(new Stock("CBA",  "COMMONWEALTH BANK OF AUSTRALIA"));
            stocksPriceHistoryRepository.save(new StockPriceHistory(stocksRepository.findBySymbol("CBA"), 100.0, LocalDateTime.now().minusDays(1)));

            stocksRepository.save(new Stock("BHP", "BHB GROUP LIMITED   "));
            stocksPriceHistoryRepository.save(new StockPriceHistory(stocksRepository.findBySymbol("BHP"), 150.0, LocalDateTime.now().minusDays(1)));
        }
        
    }

}
