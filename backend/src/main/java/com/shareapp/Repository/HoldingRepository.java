package com.shareapp.Repository;
import com.shareapp.Model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import com.shareapp.Model.Stock;
import com.shareapp.Model.TradingAccount;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Holding findByAccountAndStock(TradingAccount account, Stock stock);
    java.util.List<Holding> findAllByAccount(TradingAccount account);
}
