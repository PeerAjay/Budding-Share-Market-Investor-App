package com.shareapp.Service;

import com.shareapp.DataTransferObjects.TradingAccountRequestDTO;
import com.shareapp.DataTransferObjects.TradingAccountResponseDTO;
import com.shareapp.Model.TradingAccount;
import com.shareapp.Model.User;
import com.shareapp.Repository.TradingAccountRepository;
import com.shareapp.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final TradingAccountRepository tradingAccountRepository;

    public DashboardService(UserRepository userRepository, TradingAccountRepository tradingAccountRepository) {
        this.userRepository = userRepository;
        this.tradingAccountRepository = tradingAccountRepository;
    }

    public List<TradingAccountResponseDTO> getTradingAccounts(String email) {
        User user = userRepository.findByEmail(email);
        return tradingAccountRepository.findByUser(user).stream()
                .map(account -> new TradingAccountResponseDTO(
                        account.getId(),
                        account.getAccountName(),
                        account.getBalance(),
                        account.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public TradingAccountResponseDTO openTradingAccount(String email, TradingAccountRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email);
        TradingAccount account = new TradingAccount();
        account.setAccountName(requestDTO.getAccountName());
        account.setUser(user);
        TradingAccount saved = tradingAccountRepository.save(account);
        return new TradingAccountResponseDTO(
                saved.getId(),
                saved.getAccountName(),
                saved.getBalance(),
                saved.getCreatedAt()
        );
    }
}
