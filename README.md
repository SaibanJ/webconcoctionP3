# WebConcoctionP2: Namecheap API with Next.js

This project provides a robust API wrapper for interacting with Namecheap's domain management services using Next.js with App Router. It allows you to programmatically check domain availability and register new domains through a simple RESTful interface, while also providing a clean web interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Check Domain Availability](#check-domain-availability)
  - [Register a New Domain](#register-a-new-domain)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

-   **Domain Availability Check:** Quickly determine if a domain name is available for registration.
-   **Domain Registration:** Register new domain names with Namecheap, including comprehensive registrant contact information.
-   **Web Interface:** Clean, responsive UI built with React and Tailwind CSS.
-   **Modern Architecture:** Built with Next.js App Router for efficient server-side rendering and API routes.
-   **Environment Configuration:** Easy setup using environment variables for Namecheap API credentials and sandbox/production environment switching.
-   **Error Handling:** Provides clear error messages from the Namecheap API for easier debugging.

## Technologies Used

-   **Next.js:** React framework with built-in features like server-side rendering and API routes.
-   **React:** JavaScript library for building user interfaces.
-   **App Router:** Next.js routing system that enables creating routes through the file system.
-   **TypeScript:** Superset of JavaScript that adds static types.
-   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
-   **Axios:** Promise-based HTTP client for making API requests.
-   **Dotenv:** Loads environment variables from a `.env` file.
-   **xml2js:** XML to JavaScript object converter.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/en/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   A [Namecheap Account](https://www.namecheap.com/) with API access enabled and whitelisted IP addresses.

## Setup

Follow these steps to get your project up and running:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/WebConcoctionP2.git
    cd WebConcoctionP2
    ```
    *(Note: Replace `https://github.com/your-username/WebConcoctionP2.git` with your actual repository URL if applicable.)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of your project. This file will store your Namecheap API credentials.

    ```
    # Namecheap API Credentials
    NAMECHEAP_USERNAME=YOUR_NAMECHEAP_USERNAME
    NAMECHEAP_API_KEY=YOUR_NAMECHEAP_API_KEY
    NAMECHEAP_CLIENT_IP=YOUR_PUBLIC_IP_ADDRESS # e.g., 73.145.242.142
    NAMECHEAP_SANDBOX=true # Set to 'true' for sandbox, 'false' for production

    # WHM API Configuration (if applicable)
    WHM_API_TOKEN=YOUR_WHM_API_TOKEN
    WHM_USERNAME=YOUR_WHM_USERNAME
    WHM_HOST=YOUR_WHM_HOST
    ```
    -   `YOUR_NAMECHEAP_USERNAME`: Your Namecheap account username.
    -   `YOUR_NAMECHEAP_API_KEY`: Your Namecheap API Key. **Ensure this is the Sandbox API Key if `NAMECHEAP_SANDBOX` is `true`, or the Production API Key if `false`.**
    -   `YOUR_PUBLIC_IP_ADDRESS`: The public IP address from which your API requests will originate. This IP must be whitelisted in your Namecheap API settings. You can find your current public IPv4 using `curl -4 ifconfig.me`.
    -   `NAMECHEAP_SANDBOX`: Set to `true` to use the Namecheap Sandbox environment for testing (no real transactions). Set to `false` to use the production environment.

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Mode

To build and run the application in production mode:

```bash
npm run build
npm start
```

The production build will be optimized for performance.

## API Endpoints

All API routes are prefixed with `/api/namecheap`.

### Check Domain Availability

Checks if one or more domain names are available for registration.

-   **URL:** `/api/namecheap/check`
-   **Method:** `POST`
-   **Request Body (JSON):**
    ```json
    {
      "domains": ["example.com", "anotherdomain.net"]
    }
    ```
-   **Example Success Response:**
    ```json
    {
        "success": true,
        "data": [
            {
                "$": {
                    "Domain": "example.com",
                    "Available": "false",
                    "ErrorNo": "0",
                    "Description": "",
                    "IsPremiumName": "false",
                    "PremiumRegistrationPrice": "0",
                    "PremiumRenewalPrice": "0",
                    "PremiumRestorePrice": "0",
                    "PremiumTransferPrice": "0",
                    "IcannFee": "0",
                    "EapFee": "0.0"
                }
            },
            {
                "$": {
                    "Domain": "anotherdomain.net",
                    "Available": "true",
                    "ErrorNo": "0",
                    "Description": "",
                    "IsPremiumName": "false",
                    "PremiumRegistrationPrice": "0",
                    "PremiumRenewalPrice": "0",
                    "PremiumRestorePrice": "0",
                    "PremiumTransferPrice": "0",
                    "IcannFee": "0",
                    "EapFee": "0.0"
                }
            }
        ]
    }
    ```

### Register a New Domain

Registers a new domain name with Namecheap. Requires comprehensive registrant contact information.

-   **URL:** `/api/namecheap/register`
-   **Method:** `POST`
-   **Request Body (JSON):**
    ```json
    {
      "domain": "youruniquetestdomain.com",
      "years": 1,
      "registrantInfo": {
        "firstName": "John",
        "lastName": "Doe",
        "address1": "123 Main St",
        "city": "Anytown",
        "stateProvince": "CA",
        "postalCode": "90210",
        "country": "US",
        "phone": "+1.5551234567",
        "emailAddress": "your.email@example.com"
      }
    }
    ```
    *(Note: Ensure `domain` is available and all `registrantInfo` fields are valid and complete.)*

-   **Example Success Response:**
    ```json
    {
        "success": true,
        "data": {
            "$": {
                "Domain": "youruniquetestdomain.com",
                "OrderID": "123456",
                "TransactionID": "789012",
                "ChargedAmount": "9.99",
                "DomainCreateDate": "07/14/2025",
                "DomainExpireDate": "07/14/2026",
                "WhoisGuardEnabled": "true",
                "IsSuccess": "true"
            }
        }
    }
    ```
-   **Example Error Response (Insufficient Funds):**
    ```json
    {
        "success": false,
        "message": "Namecheap API Error: [{"number":"2528166","message":"ORDER CREATION FAILED; INSUFFICIENTFUNDS;Insufficient funds in account; Sorry! Your available balance is insufficient to cover the current billing amount;"}]"
    }
    ```

## Error Handling

The API will return a JSON object with `success: false` and a `message` field containing details about the error. Common errors include:

-   **400 Bad Request:** Missing or invalid parameters in the request body.
-   **500 Internal Server Error:** Issues with the Namecheap API (e.g., invalid API key, IP not whitelisted, insufficient funds) or unexpected server errors. The `message` will often contain the exact error from Namecheap.

## Web Interface

The application includes a clean, responsive web interface built with React and styled with Tailwind CSS. The interface provides:

-   **Home Page:** Overview of available API endpoints with example request formats.
-   **Responsive Design:** Works well on both desktop and mobile devices.
-   **API Documentation:** Visual representation of how to use the API endpoints.

## Contributing

Feel free to fork the repository, open issues, and submit pull requests.

## License

This project is open-sourced under the MIT License.
