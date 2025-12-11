package com.project.backend.domain.customers;

import lombok.Data;
import jakarta.persistence.Entity; 
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal; // TotalCharges 타입이 DECIMAL일 수 있으므로 사용

@Entity
@Table(name = "customers") // MySQL 테이블 이름
@Data // Lombok: Getter, Setter, toString 등을 자동 생성
public class Customers {

    @Id
    private String customerID;

    private String gender;
    private Boolean seniorCitizen; // MySQL에서는 TINYINT(1)로 저장될 수 있음
    private String partner; // Yes/No
    private String dependents; // Yes/No
    private Integer tenure;
    private String phoneService; // Yes/No
    private String contract;
    private BigDecimal monthlyCharges;
    private BigDecimal totalCharges;
    private String churn; // Yes/No

    // months_left는 DB 칼럼이 아니므로 여기에 직접 정의하지 않고,
    // DTO나 쿼리에서 처리하거나 @Transient를 사용합니다.
}