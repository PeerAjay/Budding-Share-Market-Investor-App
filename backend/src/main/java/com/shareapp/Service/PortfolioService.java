package com.shareapp.Service;

import org.springframework.stereotype.Service;

import com.shareapp.DataTransferObjects.HoldingResponseDTO;
import com.shareapp.Model.Holding;
import com.shareapp.Model.TradingAccount;
import com.shareapp.Repository.HoldingRepository;
import com.shareapp.Repository.TradingAccountRepository;
import com.shareapp.Service.TwelveDataService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    private final HoldingRepository holdingRepository;
    private final TradingAccountRepository tradingAccountRepository;
    private final TwelveDataService twelveDataService;

    public PortfolioService(HoldingRepository holdingRepository,
            TradingAccountRepository tradingAccountRepository,
            TwelveDataService twelveDataService) {
        this.holdingRepository = holdingRepository;
        this.tradingAccountRepository = tradingAccountRepository;
        this.twelveDataService = twelveDataService;
    }

    public List<HoldingResponseDTO> getHoldings(Long accountId) {
        TradingAccount account = tradingAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Holding> holdings = holdingRepository.findAllByAccount(account);

        return holdings.stream().map(holding -> {
            String symbol = holding.getStock().getSymbol();
            Double currentPrice = twelveDataService.getCurrentPrice(symbol);
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
