import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Title
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
            display:false
        },
        title: {
            display: true,
            text: 'Pervious days (MM/DD/YYYY)',
        },
    },
};


/**
 * {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            data: [100, 200, 300, 400, 500],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ],
    }
 */

const LineChart = ({
    data
}: any) => {
    if (!data) return null;
    return (<div className='h-full w-80'><Bar options={options} data={data} /></div>)
}
export default LineChart