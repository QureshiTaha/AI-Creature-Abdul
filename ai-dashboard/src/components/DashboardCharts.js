import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';

const DashboardCharts = ({ cpuUsage, gpuUsage, memoryUsage, chartData, chartOptions }) => {
    const metrics = [
        { label: 'CPU Usage', data: cpuUsage },
        { label: 'GPU Usage', data: gpuUsage },
        { label: 'Memory Usage', data: memoryUsage },
    ];

    return (
        <Box sx={{ p: 2, pr: 0, mb: 0, display: 'flex', overflowX: 'auto', gap: 2 }}>
            {metrics.length  && metrics.map((metric, i) => {
                
                    return (

                        <Box key={i} sx={{ minWidth: 250, flexShrink: 0 }}>
                            <Paper sx={{ p: 2, height: '30vh', borderRadius: 2, boxShadow: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
                                <Typography variant="h6" gutterBottom>
                                    {metric.label}
                                </Typography>
                                <Box sx={{ height: 150 }}>
                                    <Line data={chartData(metric.label, metric.data)} options={chartOptions} />
                                </Box>
                            </Paper>
                        </Box>
                    )
                }
                )}
        </Box>
    );
};

export default DashboardCharts;
