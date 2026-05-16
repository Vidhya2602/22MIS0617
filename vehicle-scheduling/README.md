# Vehicle Maintenance Scheduler Microservice

## Features
- REST API using Express.js
- 0/1 Knapsack Optimization
- Logging Middleware
- Error Handling
- Protected API Integration Support
- Fallback Mock Data Handling

## Endpoint

GET /schedule

## Run

npm install
node server.js

## Notes

The provided APIs are protected routes requiring authorization credentials.

The implementation supports authenticated API integration through Authorization headers.

Fallback mock data is used when credentials are unavailable to ensure uninterrupted functionality and demonstrate optimization logic.