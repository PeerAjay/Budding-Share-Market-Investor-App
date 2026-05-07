package com.shareapp.Repository;
import com.shareapp.Model.Stock;
import com.shareapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StocksRepository extends JpaRepository<Stock, Long> {
    Stock findBySymbol(String symbol);

    boolean existsBySymbol(String symbol);

    //TODO: Add more methods later if needed for things like filtering by company namek or price range, etc.
}
