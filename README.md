# OLX New Ads Notifier

## Description

This project is designed to fetch the latest advertisements from OLX based on a given URL with filters and send the most recent ads via WhatsApp.
It utilizes the power of web scraping and messaging APIs to keep you updated with the newest listings that match your criteria.

## Features

- Fetches latest ads from OLX based on a URL with specified filters.
- Sends notifications of the newest ads directly to WhatsApp.
- Configurable to match various search criteria and preferences.

## Prerequisites

- Docker
- Node.js 18+

## Setup

1. **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/olx-latest-ads-notifier.git](https://github.com/brunosoares99/Check-OLX-New-adverts.git)
    cd Check-OLX-New-adverts
    ```
2. **Configure environment variables:**
    Create a `.env` file in the root directory and add your configuration settings.
   
3. **Build and run the Docker container:**
    ```bash
    docker build -t olx-new-ads-notifier .
    docker run olx-new-ads-notifier
    ```

4. **Read the QRCode at terminal with your whatsapp and enjoy!**
    ```bash
    docker build -t olx-new-ads-notifier .
    docker run olx-new-ads-notifier
    ```

## Usage

The application will run as a background service, periodically checking for new ads on OLX and sending the latest ones to the specified WhatsApp number.

## Configuration

You can adjust the frequency of checks and other settings in the `.env` file. Make sure to rebuild the Docker container after making any changes to the configuration.

## License

This project is licensed under the MIT License.

