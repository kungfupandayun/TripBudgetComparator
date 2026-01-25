package com.tripbudget.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow all origins for simplicity in this prototype
public class CurrencyController {

    private final WebClient webClient;

    public CurrencyController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.frankfurter.app").build();
    }

    @GetMapping("/currencies")
    public Mono<ArrayList<String>> getCurrencies() {
        return this.webClient.get().uri("/currencies")
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> new ArrayList<>(response.keySet()));
    }

    @GetMapping("/rates")
    public Mono<Map<String, Double>> getRates() {
        return this.webClient.get().uri("/latest?from=SGD")
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, ? extends Number> ratesFromApi = (Map<String, ? extends Number>) response.get("rates");
                    Map<String, Double> rates = ratesFromApi.entrySet().stream()
                            .collect(Collectors.toMap(
                                    Map.Entry::getKey,
                                    entry -> entry.getValue().doubleValue()
                            ));
                    rates.put("SGD", 1.0);
                    return rates;
                });
    }
}
