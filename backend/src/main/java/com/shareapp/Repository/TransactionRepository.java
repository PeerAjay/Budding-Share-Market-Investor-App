package com.shareapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shareapp.model.Transaction;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountId(Long accountId);
    List<Transaction> findByStockSymbol(String stockSymbol);
}
