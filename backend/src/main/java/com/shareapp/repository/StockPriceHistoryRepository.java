package com.shareapp.repository;
import com.shareapp.model.Stock;
import com.shareapp.model.StockPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockPriceHistoryRepository extends JpaRepository<StockPriceHistory, Long> {
    StockPriceHistory findTopByStockSymbolOrderByTimestampDesc(String symbol);

    List<StockPriceHistory> findByStockOrderByTimestampAsc(Stock stock);
}
