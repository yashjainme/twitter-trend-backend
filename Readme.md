# Twitter Trends Backend

This backend service uses **Express.js** and **Selenium** to fetch and store Twitter trends in **MongoDB**. It utilizes a proxy server for scraping Twitter without detection, ensuring that scraping is not blocked or throttled.

## Features

- **Fetch Twitter Trends**: Uses Selenium WebDriver to fetch trending topics from Twitter.
- **Store Trends in MongoDB**: Stores the scraped trends along with timestamps and IP address for reference.
- **Proxy Integration**: Uses a proxy server to prevent detection and avoid rate limits when scraping Twitter.

---

## Required Environment Variables (.env)

To configure the backend service, create a `.env` file at the root of your project with the following environment variables:

```env
# MongoDB Configuration
mongoUrl=<your-mongodb-connection-string>    # MongoDB connection URL, including username and password if applicable
dbName=<your-database-name>                  # MongoDB database name where trends will be stored
collection_name=<your-collection-name>      # The collection name in MongoDB where trends will be stored

# Proxy Configuration (used for undetectable scraping)
PROXY_USERNAME=<your-proxy-username>         # Username for your proxy provider
PROXY_PASSWORD=<your-proxy-password>         # Password for your proxy provider
PROXY_HOST=<your-proxy-host>                 # Hostname or IP address of the proxy server
PROXY_PORT=<your-proxy-port>                 # Port number of the proxy server

# Server Configuration
PORT=5000                                    
