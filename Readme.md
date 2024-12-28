# Twitter Trends Backend

This backend service uses **Express.js** and **Selenium** to fetch and store Twitter trends in **MongoDB**. It uses a proxy for scraping Twitter without detection.

## Features
- **Fetch Twitter Trends** using Selenium WebDriver.
- **Store trends in MongoDB** with timestamp and IP address.
- **Proxy integration** for undetectable scraping.


## .env needed
mongoUrl = 
dbName = 
collection_name = 
PROXY_USERNAME = 
PROXY_PASSWORD = 
PROXY_HOST = 
PROXY_PORT = 
PORT = 