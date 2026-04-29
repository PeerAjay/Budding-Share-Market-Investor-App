package com.shareapp.Repository;

import com.shareapp.Model.TradingAccount;
import com.shareapp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradingAccountRepository extends JpaRepository<TradingAccount, Long> {

    List<TradingAccount> findByUser(User user);
}
