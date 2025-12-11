package com.project.backend.domain.customers;

import com.project.backend.domain.customers.Customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CustomerRepository extends JpaRepository<Customers, String> {

    @Query(value = "SELECT customerID, gender, SeniorCitizen, tenure, Contract, " +
                   "MonthlyCharges, TotalCharges, Churn, months_left " +
                   "FROM customers " +
                   "WHERE months_left = 1 OR months_left IS NULL " +
                   "LIMIT 50", nativeQuery = true)
    List<Map<String, Object>> findTargetCustomersMonthsLeft();

    @Query(value = "SELECT customerID, gender, SeniorCitizen, Partner, Dependents, " +
                   "tenure, PhoneService, Contract, MonthlyCharges, TotalCharges, Churn, " +
                   "CASE " +
                       "WHEN Churn = 'Yes' THEN 1 " +
                       "WHEN tenure <= 3 THEN 2 " +
                       "ELSE 12 - tenure/2 " +
                   "END as months_left " +
                   "FROM customers " +
                   "WHERE Churn = 'Yes' OR tenure <= 6 " +
                   "LIMIT 50", nativeQuery = true)
    List<Map<String, Object>> findTargetCustomersFullCalculated();

    @Query(value = "SELECT COUNT(*) FROM customers", nativeQuery = true)
    long countAllCustomers();

    @Query(value = "SELECT COUNT(*) FROM customers WHERE Churn = 'Yes'", nativeQuery = true)
    long countChurnedCustomers();
}