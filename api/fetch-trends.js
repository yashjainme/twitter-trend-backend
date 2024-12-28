const fetchTwitterTrends = require('../selenium_script'); // Import your script

module.exports = async (req, res) => {
  try {
    const data = await fetchTwitterTrends();
    res.status(200).json({
      message: 'Trends fetched successfully!',
      data,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends.' });
  }
};
