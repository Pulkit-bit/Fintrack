package com.pulkit.fintrack.fintrack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
public class SummaryController {

    @Autowired
    private TransactionRepository repo;

    // Total by type (income vs expense) — per user
    @GetMapping("/api/transactions/summary/type")
    public Map<String, Double> getTotalByType(HttpServletRequest request) {
        String uid = (String) request.getAttribute("uid"); // set by auth filter
        List<Object[]> results = repo.getTotalAmountByType(uid); // returns [type, sum]
        Map<String, Double> map = new HashMap<>();
        for (Object[] row : results) {
            String type = (String) row[0];             // column 0: type
            double total = ((Number) row[1]).doubleValue(); // column 1: sum
            map.put(type, total);
        }
        return map;
    }

    // Expense by category — per user
    @GetMapping("/api/transactions/summary/category")
    public Map<String, Double> getExpenseByCategory(HttpServletRequest request) {
        String uid = (String) request.getAttribute("uid"); // set by auth filter
        List<Object[]> results = repo.getTotalExpenseByCategory(uid); // returns [category, sum]
        Map<String, Double> map = new HashMap<>();
        for (Object[] row : results) {
            String category = (String) row[0];             // column 0: category
            double total = ((Number) row[1]).doubleValue(); // column 1: sum
            map.put(category, total);
        }
        return map;
    }

    // Monthly total expenses (for trend chart) — per user
    @GetMapping("/api/transactions/summary/monthly")
    public List<Map<String, Object>> getMonthlyExpense(HttpServletRequest request) {
        String uid = (String) request.getAttribute("uid"); // set by auth filter
        List<Object[]> results = repo.getMonthlyExpenseSum(uid); // returns [year, month, sum]
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : results) {
            int year = ((Number) row[0]).intValue();   // column 0: year
            int month = ((Number) row[1]).intValue();  // column 1: month
            double total = ((Number) row[2]).doubleValue(); // column 2: sum

            Map<String, Object> item = new HashMap<>();
            item.put("year", year);
            item.put("month", month);
            item.put("total", total);
            list.add(item);
        }
        return list;
    }
}
