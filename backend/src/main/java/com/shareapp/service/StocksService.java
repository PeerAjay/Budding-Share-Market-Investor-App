package com.shareapp.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.shareapp.model.Stock;
import com.shareapp.repository.StocksRepository;

@Service
public class StocksService {
    private final StocksRepository stocksRepository;

    public StocksService(StocksRepository stocksRepository) {
        this.stocksRepository = stocksRepository;
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

    
}
