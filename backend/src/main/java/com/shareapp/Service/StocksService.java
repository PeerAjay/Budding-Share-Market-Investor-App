package com.shareapp.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.shareapp.Model.Stock;
import com.shareapp.Repository.StocksRepository;
import com.shareapp.Model.User;
import com.shareapp.Repository.UserRepository;

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
