package com.shareapp.Repository;
import com.shareapp.Model.StockPriceHistory;
import com.shareapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockPriceHistoryRepository extends JpaRepository<StockPriceHistory, Long> {
    StockPriceHistory findTopByStockSymbolOrderByTimestampDesc(String symbol);

}
