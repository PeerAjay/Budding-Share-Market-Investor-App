package com.shareapp.service;

import org.springframework.stereotype.Service;

import com.shareapp.DataTransferObjects.HoldingResponseDTO;
import com.shareapp.model.Holding;
import com.shareapp.model.TradingAccount;
import com.shareapp.repository.HoldingRepository;
import com.shareapp.repository.TradingAccountRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    private final HoldingRepository holdingRepository;
    private final TradingAccountRepository tradingAccountRepository;

    public PortfolioService(HoldingRepository holdingRepository,
            TradingAccountRepository tradingAccountRepository) {
        this.holdingRepository = holdingRepository;
        this.tradingAccountRepository = tradingAccountRepository;
    }

    public List<HoldingResponseDTO> getHoldings(Long accountId) {
        TradingAccount account = tradingAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Holding> holdings = holdingRepository.findAllByAccount(account);

        return holdings.stream().map(holding -> {
            String symbol = holding.getStock().getSymbol();
            Double currentPrice = holding.getStock().getCurrentPrice();

            if (currentPrice == null) {
                currentPrice = holding.getAverageBuyPrice();
            }

            Double currentValue = currentPrice * holding.getQuantity();
            Double profitLoss = (currentPrice - holding.getAverageBuyPrice()) * holding.getQuantity();

            return new HoldingResponseDTO(
                    symbol,
                    holding.getStock().getCompanyName(),
                    holding.getQuantity(),
                    holding.getAverageBuyPrice(),
                    currentPrice,
                    currentValue,
                    profitLoss
            );
        }).collect(Collectors.toList());
    }
}
