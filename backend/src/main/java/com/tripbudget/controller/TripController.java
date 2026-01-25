package com.tripbudget.controller;

import com.tripbudget.model.Trip;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {

    private final List<Trip> trips = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public TripController() {
        // Add some initial data
        trips.add(new Trip(counter.incrementAndGet(), "Summer Vacation"));
        trips.add(new Trip(counter.incrementAndGet(), "Business Trip"));
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return trips;
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        trip.setId(counter.incrementAndGet());
        trips.add(trip);
        return trip;
    }
}
