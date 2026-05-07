package com.shareapp.repository;
import com.shareapp.model.StockPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockPriceHistoryRepository extends JpaRepository<StockPriceHistory, Long> {
    StockPriceHistory findTopByStockSymbolOrderByTimestampDesc(String symbol);

}
