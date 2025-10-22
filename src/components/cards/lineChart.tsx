import React, { useRef, useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { incidentsData } from '../data/incidents';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

const stateColors: Record<string, string> = {
    'Open': '#FC7E80',
    'In progress': '#ECCF5C',
    'On-Hold': '#A291FD',
    'Closed': '#4FDBF5',
    'Resolved': '#53D7B6',
    'Reopen': '#FC88F0',
};

const LineChart: React.FC = () => {
    const chartRef = useRef<any>(null);
    const [gradient, setGradient] = useState<string | CanvasGradient>('rgba(73, 85, 85, 0.2)');

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            const ctx = chart.ctx;
            const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
            gradientFill.addColorStop(0, '#4d4d5575');
            gradientFill.addColorStop(1, '#ffffff10');
            setGradient(gradientFill);
        }
    }, []);

    const p3Incidents = incidentsData.filter(i => i.priority === 'P3');

    const stateCountMap: Record<string, number> = {};
    p3Incidents.forEach(incident => {
        const state = incident.state;
        stateCountMap[state] = (stateCountMap[state] || 0) + 1;
    });

    const labels = Object.keys(stateCountMap);
    const values = Object.values(stateCountMap);
    const pointColors = labels.map(state => stateColors[state] || '#000');

    const data = {
        labels,
        datasets: [
            {
                data: values,
                borderColor: 'grey',
                backgroundColor: gradient,
                fill: true,
                borderWidth: 0.2,
                tension: 0,
                pointBackgroundColor: pointColors,
                pointHoverBorderColor: 'black',
                pointHoverBorderWidth: 4,
                pointRadius: 8,
                pointHoverRadius: 7,
                pointBorderColor: '#fff',
                pointBorderWidth: 4,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 300,
            easing: 'easeOutQuad',
        },
        layout: {
            padding: {
                top: 10,
                left: 0,
                right: 0,
                bottom: 0,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                cornerRadius: 12,
                padding: {
                    top: 8,
                    bottom: 8,
                    left: 16,  // ✅ LEFT PADDING
                    right: 16, // ✅ RIGHT PADDING
                },
            
                bodySpacing: 20,   // space between items
                boxPadding: 15,    // space between color box and text
                enabled: true,
                backgroundColor: 'black',
                titleFont: { size: 0 },
                bodyFont: {
                    size: 14,
                    weight: 'normal',
                },

                displayColors: true,
                usePointStyle: true,
                boxWidth: 5,
                boxHeight: 5,
                callbacks: {
                    title: () => '',
                    label: (context) => {
                        const state = context.label;
                        const count = context.formattedValue;
                    
                        
                        return `${state} ${count}`;
                    },
                    labelTextColor: () => '#ffffff80',
                    labelColor: (context) => {
                        const dataset = context.dataset as any;
                        const color = (dataset.pointBackgroundColor as string[])[context.dataIndex] || '#000';
                        return {
                            borderColor: color,
                            backgroundColor: color,
                            borderWidth: 10,
                            pointStyle: 'circle'
                        };
                    },
                },
            },
        },
        elements: {
            point: {
                radius: 7,
                hoverRadius: 10,
                borderWidth: 1,
                hoverBorderWidth: 4,
                borderColor: '#fff',
                hoverBorderColor: 'black',
            },
            line: {
                borderWidth: 0.5,
            },
        },
        clip: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { padding: 0 },
            },
            y: {
                display: false,
                beginAtZero: true,
                grid: { display: false },
                ticks: { padding: 0 },
            },
        },
        hover: {
            mode: 'nearest',
            intersect: true,
        },
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
};

export default LineChart;
