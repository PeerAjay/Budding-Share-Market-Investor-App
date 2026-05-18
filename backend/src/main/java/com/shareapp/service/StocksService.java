package com.shareapp.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.shareapp.model.Stock;
import com.shareapp.model.StockPriceHistory;
import com.shareapp.repository.StocksRepository;
import com.shareapp.repository.StockPriceHistoryRepository;

@Service
public class StocksService {
    private final StocksRepository stocksRepository;
    private final StockPriceHistoryRepository stockPriceHistoryRepository;

    public StocksService(StocksRepository stocksRepository, StockPriceHistoryRepository stockPriceHistoryRepository) {
        this.stocksRepository = stocksRepository;
        this.stockPriceHistoryRepository = stockPriceHistoryRepository;
    }
    
    public List<Stock> getAllStocks() {
        return stocksRepository.findAll();
    }

    public Stock getStockBySymbol(String symbol) {
        return stocksRepository.findBySymbol(symbol);
    }

    @Transactional
    public Stock addStock(Stock stock) {
        if (stocksRepository.existsBySymbol(stock.getSymbol())) {
            throw new RuntimeException("Stock with symbol already exists: " + stock.getSymbol());
        }
        return stocksRepository.save(stock);
    }

    public List<StockPriceHistory> getStockPriceHistory(String symbol) {
        Stock stock = stocksRepository.findBySymbol(symbol);
        if (stock == null) {
            throw new RuntimeException("Stock not found");
        }
        return stockPriceHistoryRepository.findByStockOrderByTimestampAsc(stock);
    }

    
}
