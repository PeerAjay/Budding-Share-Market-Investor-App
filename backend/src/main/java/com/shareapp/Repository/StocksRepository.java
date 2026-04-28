package com.shareapp.repository;
import com.shareapp.model.Stock;
import com.shareapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StocksRepository extends JpaRepository<Stock, Long> {
    Stock findBySymbol(String symbol);

    boolean existsBySymbol(String symbol);

    //TODO: Add more methods later if needed for things like filtering by company namek or price range, etc.
}
