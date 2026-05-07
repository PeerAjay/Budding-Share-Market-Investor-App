package com.shareapp.repository;

import com.shareapp.model.TradingAccount;
import com.shareapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradingAccountRepository extends JpaRepository<TradingAccount, Long> {

    List<TradingAccount> findByUser(User user);
}
