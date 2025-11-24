// 필요한 라이브러리 불러오기
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

// 앱 생성
const app = express();
app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// MySQL 연결 실행
db.connect((err) => {
    if (err) {
        console.log("❌ MySQL 연결 실패:", err);
        return;
    }
    console.log("✅ MySQL 연결 성공!");
});

// API: months_left = 1 고객들 조회
app.get("/api/target-customers", (req, res) => {
    const sql = "SELECT * FROM customers WHERE months_left = 1";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// 서버 실행
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
