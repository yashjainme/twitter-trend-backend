const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUrl = process.env.mongoUrl;
const dbName = process.env.dbName;
const collectionName = process.env.collection_name;

module.exports = async (req, res) => {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const latestTrend = await collection.findOne({}, { sort: { date_time: -1 } });

    if (latestTrend) {
      res.json(latestTrend);
    } else {
      res.status(404).json({ message: 'No trends found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve latest trend.' });
  } finally {
    await client.close();
  }
};
