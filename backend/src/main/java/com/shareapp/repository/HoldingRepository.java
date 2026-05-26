package com.shareapp.repository;
import com.shareapp.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import com.shareapp.model.Stock;
import com.shareapp.model.TradingAccount;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Holding findByAccountAndStock(TradingAccount account, Stock stock);
    java.util.List<Holding> findAllByAccount(TradingAccount account);
    java.util.List<Holding> findAllByStock(Stock stock);
}
