package com.shareapp.controller;

import com.shareapp.model.Stock;
import com.shareapp.model.StockPriceHistory;
import com.shareapp.service.EodhdService;
import com.shareapp.service.StocksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StocksController {

    private final StocksService stocksService;
    private final EodhdService eodhdService;

    public StocksController(StocksService stocksService, EodhdService eodhdService) {
        this.stocksService = stocksService;
        this.eodhdService = eodhdService;
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stocksService.getAllStocks());
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshStocks() {
        eodhdService.updateTrackedStockPrices();
        return ResponseEntity.ok("Stocks updated successfully.");
    }

    @GetMapping("/{symbol}/history")
    public ResponseEntity<List<StockPriceHistory>> getStockHistory(@PathVariable String symbol) {
        try {
            return ResponseEntity.ok(stocksService.getStockPriceHistory(symbol));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
