package com.kh.last.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.kh.last.service.AmadeusService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final AmadeusService amadeusService;

    @Autowired
    public FlightController(AmadeusService amadeusService) {
        this.amadeusService = amadeusService;
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchFlights(@RequestParam String origin,
                                                   @RequestParam String destination,
                                                   @RequestParam String departureDate) {
        return amadeusService.searchFlights(origin, destination, departureDate);
    }
}
