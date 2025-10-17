package com.pulkit.fintrack.fintrack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository repo;

    // Helper to read uid placed by the auth filter
    private String uid(HttpServletRequest request) {
        Object v = request.getAttribute("uid");
        return v == null ? null : v.toString();
    }

    // List all transactions for the signed-in user, newest first
    @GetMapping
    public List<Transaction> getAll(HttpServletRequest request) {
        String userId = uid(request);
        return repo.findByUserIdOrderByDateDesc(userId); // user-scoped read
    }

    // Create a transaction for the signed-in user
    @PostMapping
    public Transaction add(@RequestBody Transaction t, HttpServletRequest request) {
        String userId = uid(request);
        t.setUserId(userId); // enforce ownership on create
        return repo.save(t);
    }

    // Update a transaction; enforce ownership by resetting userId
    @PutMapping("/{id}")
    public Transaction edit(@PathVariable Long id,
                            @RequestBody Transaction t,
                            HttpServletRequest request) {
        String userId = uid(request);
        t.setId(id);
        t.setUserId(userId); // enforce ownership on update
        return repo.save(t);
    }

    // Delete a transaction only if it belongs to the signed-in user
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, HttpServletRequest request) {
        String userId = uid(request);
        repo.deleteByIdAndUserId(id, userId); // user-scoped delete
    }
}