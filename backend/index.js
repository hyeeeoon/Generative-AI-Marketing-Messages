// 필요한 라이브러리 불러오기
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'customer_db',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL 연결 실패:", err.message);
        return;
    }
    console.log("✅ MySQL 연결 성공!");
});

// ✅ 1. 테이블 구조 확인 API
app.get("/api/check-table", (req, res) => {
    db.query("DESCRIBE customers", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, columns: result });
    });
});

// ✅ 2. 실제 데이터 확인 (months_left = 1)
app.get("/api/target-customers", (req, res) => {
    const sql = `
        SELECT customerID, gender, SeniorCitizen, tenure, Contract, 
               MonthlyCharges, TotalCharges, Churn, months_left 
        FROM customers 
        WHERE months_left = 1 OR months_left IS NULL
        LIMIT 20
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("쿼리 오류:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            success: true, 
            count: result.length,
            data: result 
        });
    });
});

// ✅ 3. 실제 데이터 + months_left 계산 (빈 경우)
app.get("/api/target-customers-full", (req, res) => {
    const sql = `
        SELECT customerID, gender, SeniorCitizen, Partner, Dependents, 
               tenure, PhoneService, Contract, MonthlyCharges, TotalCharges, Churn,
               CASE 
                   WHEN Churn = 'Yes' THEN 1 
                   WHEN tenure <= 3 THEN 2 
                   ELSE 12 - tenure/2 
               END as months_left
        FROM customers 
        WHERE Churn = 'Yes' OR tenure <= 6
        LIMIT 20
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, count: result.length, data: result });
    });
});

// ✅ 4. 전체 고객 수 확인
app.get("/api/stats", (req, res) => {
    db.query("SELECT COUNT(*) as total FROM customers", (countErr, countResult) => {
        db.query("SELECT COUNT(*) as churned FROM customers WHERE Churn = 'Yes'", (churnErr, churnResult) => {
            res.json({
                total: countResult[0].total,
                churned: churnResult[0].churned,
                target: parseInt(countResult[0].total * 0.1) // months_left=1 예상
            });
        });
    });
});

app.listen(5001, () => {
    console.log("🚀 Server running on http://localhost:5001");
    console.log("📋 http://localhost:5001/api/check-table");
    console.log("📊 http://localhost:5001/api/target-customers");
    console.log("🎯 http://localhost:5001/api/target-customers-full");
    console.log("📈 http://localhost:5001/api/stats");
});
