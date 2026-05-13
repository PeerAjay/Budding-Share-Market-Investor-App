package com.shareapp.service;

import java.time.LocalDateTime;

import com.shareapp.DataTransferObjects.EodhdStockPriceDTO;
import com.shareapp.model.Stock;
import com.shareapp.model.StockPriceHistory;
import com.shareapp.repository.StocksRepository;
import com.shareapp.repository.StockPriceHistoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class EodhdService {

    private static final List<String> TRACKED_STOCK_SYMBOLS = List.of(
            "AAPL.US",
            "MSFT.US",
            "GOOGL.US",
            "AMZN.US",
            "META.US",
            "TSLA.US",
            "NVDA.US",
            "NFLX.US",
            "JPM.US",
            "BAC.US",
            "V.US",
            "MA.US",
            "DIS.US",
            "KO.US",
            "PEP.US",
            "MCD.US",
            "WMT.US",
            "COST.US",
            "NKE.US",
            "XOM.US"
    );

    private final RestTemplate restTemplate = new RestTemplate();
    private final StocksRepository stocksRepository;
    private final StockPriceHistoryRepository stockPriceHistoryRepository;

    @Value("${eodhd.api.key}")
    private String apiKey;

    @Value("${eodhd.base-url}")
    private String baseUrl;

    public EodhdService(
            StocksRepository stocksRepository,
            StockPriceHistoryRepository stockPriceHistoryRepository
    ) {
        this.stocksRepository = stocksRepository;
        this.stockPriceHistoryRepository = stockPriceHistoryRepository;
    }

    public EodhdStockPriceDTO fetchStockPrice(String symbol) {
        String url = baseUrl + "/real-time/" + symbol + "?api_token=" + apiKey + "&fmt=json";

        return restTemplate.getForObject(url, EodhdStockPriceDTO.class);
    }


    private String toEodhdSymbol(String symbol) {
        if (symbol.contains(".")) {
            return symbol;
        }

        return symbol + ".US";
    }

    @Scheduled(cron = "${stock-price-update.cron}", zone = "Australia/Sydney")
    public void updateTrackedStockPrices() {
        for (String symbol : TRACKED_STOCK_SYMBOLS) {
            updateStockPrice(symbol);
        }
    }


    private void updateStockPrice(String symbol) {
        try {
            EodhdStockPriceDTO priceData = fetchStockPrice(symbol);

            if (priceData == null || priceData.getClose() == null) {
                System.err.println("No price data returned for stock: " + symbol);
                return;
            }

            String localSymbol = symbol.replace(".US", "");
            double latestPrice = priceData.getClose().doubleValue();

            Stock stock = stocksRepository.findBySymbol(localSymbol);

            if (stock == null) {
                stock = new Stock();
                stock.setSymbol(localSymbol);
                stock.setCompanyName(localSymbol);
            }

            stock.setCurrentPrice(latestPrice);
            Stock savedStock = stocksRepository.save(stock);

            StockPriceHistory priceHistory = new StockPriceHistory(
                    savedStock,
                    latestPrice,
                    LocalDateTime.now()
            );

            stockPriceHistoryRepository.save(priceHistory);
        } catch (Exception exception) {
            System.err.println("Failed to fetch/save stock: " + symbol);
            System.err.println(exception.getMessage());
        }
    }
}
