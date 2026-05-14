package com.shareapp.repository;

import com.shareapp.model.TradingAccount;
import com.shareapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TradingAccountRepository extends JpaRepository<TradingAccount, Long> {

    List<TradingAccount> findByUser(User user);

    @Query("SELECT ta.user, SUM(ta.balance) as totalBalance " + "FROM TradingAccount ta " + "GROUP BY ta.user " + "ORDER BY totalBalance DESC")
    List<Object[]> findUserTotalBalancesRanked();
}
