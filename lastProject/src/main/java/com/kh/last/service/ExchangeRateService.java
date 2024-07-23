package com.kh.last.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;

@Service
public class ExchangeRateService {

    @Value("${exchange.api.url}")
    private String apiUrl;

    @Value("${exchange.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public ExchangeRateService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double getUsdToKrwRate() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", apiKey);

        HttpEntity<String> request = new HttpEntity<>(headers);

        Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);

        Map<String, Double> rates = (Map<String, Double>) response.get("conversion_rates");
        return rates.get("KRW");
    }
}
