package com.pulkit.fintrack.fintrack;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // List view — per user ordered by date desc
    List<Transaction> findByUserIdOrderByDateDesc(String userId); // derived query

    // Ownership delete — per user
    @Modifying
    @Transactional
    void deleteByIdAndUserId(Long id, String userId); // derived delete scoped by owner

    // Summary: total income/expense by type — per user
    @Query("SELECT t.type, SUM(t.amount) " +
            "FROM Transaction t " +
            "WHERE t.userId = :userId " +
            "GROUP BY t.type")
    List<Object[]> getTotalAmountByType(@Param("userId") String userId); // returns [type, sum]

    // Summary: expense by category — per user
    @Query("SELECT t.category, SUM(t.amount) " +
            "FROM Transaction t " +
            "WHERE t.userId = :userId AND t.type = 'EXPENSE' " +
            "GROUP BY t.category")
    List<Object[]> getTotalExpenseByCategory(@Param("userId") String userId); // returns [category, sum]

    // Summary: monthly expense totals — per user (year, month, sum)
    @Query("SELECT YEAR(t.date), MONTH(t.date), SUM(t.amount) " +
            "FROM Transaction t " +
            "WHERE t.userId = :userId AND t.type = 'EXPENSE' " +
            "GROUP BY YEAR(t.date), MONTH(t.date) " +
            "ORDER BY YEAR(t.date), MONTH(t.date)")
    List<Object[]> getMonthlyExpenseSum(@Param("userId") String userId); // returns [year, month, sum]
}