package com.shareapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.shareapp.model.Stock;
import com.shareapp.model.Transaction;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountId(Long accountId);
    List<Transaction> findByStockSymbol(String stockSymbol);
    List<Transaction> findByAccountIdAndTimestampBetween(Long accountId, LocalDateTime start, LocalDateTime end);
    List<Transaction> findAllByAccount_Id(Long accountId);

    @Modifying
    @Query("UPDATE Transaction t SET t.stock = null WHERE t.stock = :stock")
    void nullifyStock(@Param("stock") Stock stock);
}
