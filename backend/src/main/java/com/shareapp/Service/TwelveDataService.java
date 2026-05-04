package com.shareapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class TwelveDataService {

    @Value("${twelvedata.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL = "https://api.twelvedata.com";

    public Double getCurrentPrice(String symbol) {
        String url = BASE_URL + "/price?symbol=" + symbol + "&apikey=" + apiKey;
        @SuppressWarnings("unchecked")
        Map<String, String> response = restTemplate.getForObject(url, Map.class);
        if (response == null || !response.containsKey("price")) {
            throw new RuntimeException("Could not fetch price for symbol: " + symbol);
        }
        return Double.parseDouble(response.get("price"));
    }
}
