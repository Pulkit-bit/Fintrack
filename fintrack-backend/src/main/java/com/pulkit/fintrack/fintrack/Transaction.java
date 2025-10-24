package com.pulkit.fintrack.fintrack;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import java.time.LocalDate;

@Entity
public class Transaction {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // single id field[1]

    private double amount;
    private String type;       // "INCOME" or "EXPENSE"
    private String category;
    private LocalDate date;
    private String description;

    @Column(nullable = false)
    private String userId;     // Firebase uid owner[1]

    // Getters and Setters
    public Long getId() { return id; }                                 //[1]
    public void setId(Long id) { this.id = id; }                       //[1]
    public double getAmount() { return amount; }                       //[1]
    public void setAmount(double amount) { this.amount = amount; }     //[1]
    public String getType() { return type; }                           //[1]
    public void setType(String type) { this.type = type; }             //[1]
    public String getCategory() { return category; }                   //[1]
    public void setCategory(String category) { this.category = category; } //[1]
    public LocalDate getDate() { return date; }                        //[1]
    public void setDate(LocalDate date) { this.date = date; }          //[1]
    public String getDescription() { return description; }             //[1]
    public void setDescription(String description) { this.description = description; } //[1]

    public String getUserId() { return userId; }                       //[1]
    public void setUserId(String userId) { this.userId = userId; }     //[1]
}