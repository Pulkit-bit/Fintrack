package com.pulkit.fintrack.fintrack;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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

    // Filter transactions by date range — per user
    @Query("SELECT t FROM Transaction t " +
            "WHERE t.userId = :userId " +
            "AND t.date >= :startDate " +
            "AND t.date <= :endDate " +
            "ORDER BY t.date DESC")
    List<Transaction> findByUserIdAndDateBetween(
            @Param("userId") String userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Summary by type with date filter — per user
    @Query("SELECT t.type, SUM(t.amount) " +
            "FROM Transaction t " +
            "WHERE t.userId = :userId " +
            "AND t.date >= :startDate " +
            "AND t.date <= :endDate " +
            "GROUP BY t.type")
    List<Object[]> getTotalAmountByTypeAndDateRange(
            @Param("userId") String userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Summary by category with date filter — per user
    @Query("SELECT t.category, SUM(t.amount) " +
            "FROM Transaction t " +
            "WHERE t.userId = :userId " +
            "AND t.type = 'EXPENSE' " +
            "AND t.date >= :startDate " +
            "AND t.date <= :endDate " +
            "GROUP BY t.category")
    List<Object[]> getTotalExpenseByCategoryAndDateRange(
            @Param("userId") String userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}