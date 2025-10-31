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
    private String userId;     // Firebase uid owner

    // Getters and Setters
    public Long getId() { return id; }                                 
    public void setId(Long id) { this.id = id; }                       
    public double getAmount() { return amount; }                       
    public void setAmount(double amount) { this.amount = amount; }     
    public String getType() { return type; }                           
    public void setType(String type) { this.type = type; }            
    public String getCategory() { return category; }                  
    public void setCategory(String category) { this.category = category; } 
    public LocalDate getDate() { return date; }                       
    public void setDate(LocalDate date) { this.date = date; }          
    public String getDescription() { return description; }             
    public void setDescription(String description) { this.description = description; } 

    public String getUserId() { return userId; }                       
    public void setUserId(String userId) { this.userId = userId; }     
}