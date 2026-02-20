package com.tripbudget.controller;

import com.tripbudget.model.Expense;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {

    private final List<Expense> expenses = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public ExpenseController() {
        // Add some initial data
        expenses.add(new Expense(counter.incrementAndGet(), "Dinner with friends", 50.0, "USD", "Food", 1L));
        expenses.add(new Expense(counter.incrementAndGet(), "Taxi to airport", 30.0, "USD", "Transport", 1L));
        expenses.add(new Expense(counter.incrementAndGet(), "Hotel for conference", 200.0, "EUR", "Hotel", 2L));
        expenses.add(new Expense(counter.incrementAndGet(), "Flight tickets", 400.0, "USD", "Tickets", 2L));
    }

    @GetMapping
    public List<Expense> getAllExpenses(@RequestParam(required = false) Long tripId) {
        if (tripId != null) {
            return expenses.stream()
                    .filter(expense -> expense.getTripId() == tripId)
                    .collect(Collectors.toList());
        }
        return expenses;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Expense createExpense(@RequestBody Expense expense) {
        expense.setId(counter.incrementAndGet());
        expenses.add(expense);
        return expense;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(@PathVariable Long id) {
        expenses.removeIf(expense -> expense.getId() == id);
    }
}
