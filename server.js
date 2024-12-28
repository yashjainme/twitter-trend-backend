const express = require('express');
const cors = require('cors');
const fetchTwitterTrends = require('./selenium_script');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const mongoUrl = process.env.mongoUrl
const dbName = process.env.dbName
const collectionName = process.env.collection_name

app.use(cors());

// Endpoint to trigger fetching Twitter trends
app.get('/fetch-trends', async (req, res) => {
    try {
        const data = await fetchTwitterTrends();
        res.json({ message: 'Trends fetched successfully!', data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trends.' });
    }
});



// New endpoint to fetch only the latest trend collection
app.get('/get-latest-trend', async (req, res) => {
    const client = new MongoClient(mongoUrl);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch the most recent entry from the trends collection
        const latestTrend = await collection.findOne({}, { sort: { date_time: -1 } });

        // If the latest trend exists, return the entire collection
        if (latestTrend) {
            res.json(latestTrend);
        } else {
            res.status(404).json({ message: 'No trends found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the latest trend collection.' });
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
