import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Chart.js로 차트를 그려주는 공용 컴포넌트
// props:
// - type: 차트 타입 (예: 'bar', 'line' ...)
// - data: Chart.js 데이터 객체
// - options: Chart.js 옵션 객체
function ChartComponent({ type, data, options }) {
    const chartRef = useRef(null);       // canvas DOM 참조
    const chartInstance = useRef(null);  // Chart.js 인스턴스 참조

    useEffect(() => {
        // 기존 차트 인스턴스가 있으면 먼저 제거
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        // 새 Chart 인스턴스 생성
        chartInstance.current = new Chart(ctx, {
            type,
            data,
            options,
        });

        // 컴포넌트가 언마운트되거나 data/type이 바뀔 때 정리
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [type, data, options]); // 옵션까지 의존성에 넣는 것이 안전

    // 잘못된 부분
    return <canvas ref={chartRef} />;

}

    export default ChartComponent;
