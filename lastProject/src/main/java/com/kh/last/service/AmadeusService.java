package com.kh.last.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AmadeusService {

    @Value("${amadeus.api.key}")
    private String apiKey;

    @Value("${amadeus.api.secret}")
    private String apiSecret;

    private final RestTemplate restTemplate;
    private final ExchangeRateService exchangeRateService;

    @Autowired
    public AmadeusService(RestTemplate restTemplate, ExchangeRateService exchangeRateService) {
        this.restTemplate = restTemplate;
        this.exchangeRateService = exchangeRateService;
    }

    private String getAccessToken() {
        String authUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = "grant_type=client_credentials&client_id=" + apiKey + "&client_secret=" + apiSecret;
        
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        
        Map<String, Object> response = restTemplate.postForObject(authUrl, request, Map.class);
        return response.get("access_token").toString();
    }

    public List<Map<String, Object>> searchFlights(String origin, String destination, String departureDate) {
        String accessToken = getAccessToken();

        String url = UriComponentsBuilder.fromHttpUrl("https://test.api.amadeus.com/v2/shopping/flight-offers")
                .queryParam("originLocationCode", origin)
                .queryParam("destinationLocationCode", destination)
                .queryParam("departureDate", departureDate)
                .queryParam("adults", 1)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        Map<String, Object> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class).getBody();
        List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");

        double usdToKrwRate = exchangeRateService.getUsdToKrwRate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        return data.stream()
                .filter(flight -> {
                    Map<String, Object> itineraries = ((List<Map<String, Object>>) flight.get("itineraries")).get(0);
                    Map<String, Object> segment = ((List<Map<String, Object>>) itineraries.get("segments")).get(0);
                    String flightOrigin = (String) ((Map<String, Object>) segment.get("departure")).get("iataCode");
                    String flightDestination = (String) ((Map<String, Object>) segment.get("arrival")).get("iataCode");
                    return flightOrigin.equals(origin) && flightDestination.equals(destination);
                })
                .map(flight -> {
                    Map<String, Object> itineraries = ((List<Map<String, Object>>) flight.get("itineraries")).get(0);
                    Map<String, Object> segment = ((List<Map<String, Object>>) itineraries.get("segments")).get(0);
                    Map<String, Object> price = (Map<String, Object>) flight.get("price");

                    String originCode = (String) ((Map<String, Object>) segment.get("departure")).get("iataCode");
                    String destinationCode = (String) ((Map<String, Object>) segment.get("arrival")).get("iataCode");
                    String departureAt = (String) ((Map<String, Object>) segment.get("departure")).get("at");
                    LocalDateTime departureDateTime = LocalDateTime.parse(departureAt);
                    String formattedDepartureAt = departureDateTime.format(formatter);
                    int totalPrice = (int) Math.round(Double.parseDouble((String) price.get("total")) * usdToKrwRate);

                    Map<String, Object> result = new HashMap<>();
                    result.put("origin", originCode);
                    result.put("destination", destinationCode);
                    result.put("departureDate", formattedDepartureAt);
                    result.put("price", totalPrice);
                    return result;
                })
                .collect(Collectors.toList());
    }
}
