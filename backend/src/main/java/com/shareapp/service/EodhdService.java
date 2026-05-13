package com.shareapp.service;

import com.shareapp.DataTransferObjects.EodhdStockPriceDTO;
import com.shareapp.model.Stock;
import com.shareapp.repository.StocksRepository;
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


    @Value("${eodhd.api.key}")
    private String apiKey;

    @Value("${eodhd.base-url}")
    private String baseUrl;

    public EodhdService(StocksRepository stocksRepository) {
        this.stocksRepository = stocksRepository;
    }

    public EodhdStockPriceDTO fetchStockPrice(String symbol) {
        String url = baseUrl + "/real-time/" + symbol + "?api_token=" + apiKey + "&fmt=json";

        return restTemplate.getForObject(url, EodhdStockPriceDTO.class);
    }

    @Scheduled(cron = "0 0 18 * * MON-FRI", zone = "America/New_York")
    public void updateStockPricesEveryNinetyMinutes() {
        List<Stock> stocks = stocksRepository.findAll();

        for (Stock stock : stocks) {
            try {
                String eodhdSymbol = toEodhdSymbol(stock.getSymbol());
                EodhdStockPriceDTO priceData = fetchStockPrice(eodhdSymbol);

                if (priceData != null && priceData.getClose() != null) {
                    stock.setCurrentPrice(priceData.getClose().doubleValue());
                    stocksRepository.save(stock);
                }
            } catch (Exception exception) {
                System.err.println("Failed to update price for stock: " + stock.getSymbol());
                System.err.println(exception.getMessage());
            }
        }
    }

    private String toEodhdSymbol(String symbol) {
        if (symbol.contains(".")) {
            return symbol;
        }

        return symbol + ".US";
    }

    @Scheduled(cron = "0 0 18 * * MON-FRI", zone = "Australia/Sydney")
    public void updateTrackedStockPricesOncePerDay() {
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
            Stock stock = stocksRepository.findBySymbol(localSymbol);

            if (stock == null) {
                stock = new Stock();
                stock.setSymbol(localSymbol);
                stock.setCompanyName(localSymbol);
            }

            stock.setCurrentPrice(priceData.getClose().doubleValue());
            stocksRepository.save(stock);
        } catch (Exception exception) {
            System.err.println("Failed to fetch/save stock: " + symbol);
            System.err.println(exception.getMessage());
        }
    }
}
