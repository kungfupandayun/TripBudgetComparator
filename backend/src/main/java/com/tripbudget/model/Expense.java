package com.tripbudget.model;

public class Expense {
    private long id;
    private String description;
    private double amount;
    private String currency;
    private String category;
    private long tripId;

    public Expense() {
    }

    public Expense(long id, String description, double amount, String currency, String category, long tripId) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.currency = currency;
        this.category = category;
        this.tripId = tripId;
    }

    // Getters and setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getTripId() {
        return tripId;
    }

    public void setTripId(long tripId) {
        this.tripId = tripId;
    }
}
