package com.project.backend.domain.customers;

import com.project.backend.domain.customers.Customers;
import com.project.backend.domain.customers.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // 기본 경로 설정
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // Node.js: ✅ 1. 테이블 구조 확인 API (Spring Boot에서는 JPA Entity 구조로 대체)
    @GetMapping("/check-table")
    public ResponseEntity<Map<String, Object>> checkTable() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        // 실제 DESCRIBE 쿼리를 실행하려면 JdbcTemplate이 필요하지만,
        // JPA 사용 시 Entity 정보를 반환하는 방식으로 대체합니다.
        // 여기서는 간단히 Entity의 필드 정보를 반환합니다.
        response.put("columns", Customers.class.getDeclaredFields());
        return ResponseEntity.ok(response);
    }

    // Node.js: ✅ 2. 실제 데이터 확인 (months_left = 1)
    @GetMapping("/target-customers")
    public ResponseEntity<Map<String, Object>> getTargetCustomers() {
        List<Map<String, Object>> result = customerRepository.findTargetCustomersMonthsLeft();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", result.size());
        response.put("data", result);
        return ResponseEntity.ok(response);
    }

    // Node.js: ✅ 3. 실제 데이터 + months_left 계산 (빈 경우)
    @GetMapping("/target-customers-full")
    public ResponseEntity<Map<String, Object>> getTargetCustomersFull() {
        List<Map<String, Object>> result = customerRepository.findTargetCustomersFullCalculated();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", result.size());
        response.put("data", result);
        return ResponseEntity.ok(response);
    }

    // Node.js: ✅ 4. 전체 고객 수 확인
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long total = customerRepository.countAllCustomers();
        long churned = customerRepository.countChurnedCustomers();
        long target = (long) (total * 0.1);

        Map<String, Object> response = new HashMap<>();
        response.put("total", total);
        response.put("churned", churned);
        response.put("target", target); // months_left=1 예상
        return ResponseEntity.ok(response);
    }
}