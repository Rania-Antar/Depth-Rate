const express = require('express');
const sqlite3 = require('sqlite3');
const Chart = require('chart.js');

const app = express();
const port = 5500;

const db = new sqlite3.Database('database/inkyfada');  //Error: SQLITE_CORRUPT: database disk image is malformed I couldn't use this db !!!!


app.get('/depth-rate', (req, res) => {
    const { startDate, endDate } = req.query;

    const sql = `
      SELECT strftime('%Y-%m-%d', visitDate) AS day, COUNT(*) AS visitCount, AVG(CASE WHEN eventType = 1 THEN scrollPercentage ELSE 0 END) AS avgScrollPercentage
      FROM Records
      WHERE visitDate BETWEEN ? AND ?
      GROUP BY day
      ORDER BY day
    `;

    db.all(sql, [startDate, endDate], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const depthRates = rows.map((row) => {
            const { avgScrollPercentage, visitCount } = row;
            return {
                day: row.day,
                depthRate: (avgScrollPercentage * visitCount) / 100,
            };
        });

        const chartData = {
            labels: depthRates.map((data) => data.day),
            datasets: [
                {
                    label: 'Depth Rate',
                    data: depthRates.map((data) => data.depthRate.toFixed(2)),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };

        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Depth Rate (%)',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                    },
                },
            },
        };

        const chartConfig = {
            type: 'line',
            data: chartData,
            options: chartOptions,
        };

        res.json({ chartConfig });
    });
});

app.get('/depth-rate-filter', (req, res) => {
    const { startDate, endDate, pageUrl } = req.query;

    let sql = `
      SELECT
        strftime('%Y-%m-%d', visitDate) AS day,
        COUNT(*) AS visitCount,
        AVG(CASE WHEN eventType = 1 THEN scrollPercentage ELSE 0 END) AS avgScrollPercentage
      FROM Records
      WHERE visitDate BETWEEN ? AND ? AND pageUrl = ?
      GROUP BY day
      ORDER BY day
    `;

    const params = [startDate, endDate, pageUrl];

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const depthRates = rows.map((row) => {
            const { avgScrollPercentage, visitCount } = row;
            return {
                day: row.day,
                depthRate: (avgScrollPercentage * visitCount) / 100,
            };
        });

        const chartData = {
            labels: depthRates.map((data) => data.day),
            datasets: [
                {
                    label: 'Depth Rate',
                    data: depthRates.map((data) => data.depthRate.toFixed(2)),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };

        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Depth Rate (%)',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                    },
                },
            },
        };

        const chartConfig = {
            type: 'line',
            data: chartData,
            options: chartOptions,
        };

        res.json({ chartConfig });
    });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
