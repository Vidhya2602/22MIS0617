const express = require("express");
const axios = require("axios");
const log = require("./logger");

const app = express();

app.use(express.json());

const DEPOT_API = "http://4.224.186.213/evaluation-service/depots";
const VEHICLE_API = "http://4.224.186.213/evaluation-service/vehicles";

/*
    Auth-ready headers
*/

const headers = {
    Authorization: "Bearer TOKEN_IF_PROVIDED"
};

/*
    Fallback mock data
*/

const fallbackDepots = [
    { ID: 1, MechanicHours: 60 },
    { ID: 2, MechanicHours: 135 }
];

const fallbackVehicles = [
    {
        TaskID: "A1",
        Duration: 1,
        Impact: 5
    },
    {
        TaskID: "A2",
        Duration: 6,
        Impact: 2
    },
    {
        TaskID: "A3",
        Duration: 5,
        Impact: 9
    },
    {
        TaskID: "A4",
        Duration: 2,
        Impact: 8
    }
];

/*
    Knapsack Algorithm
*/

function knapsack(tasks, maxHours) {

    const n = tasks.length;

    const dp = Array(n + 1)
        .fill()
        .map(() => Array(maxHours + 1).fill(0));

    for (let i = 1; i <= n; i++) {

        const duration = tasks[i - 1].Duration;
        const impact = tasks[i - 1].Impact;

        for (let w = 0; w <= maxHours; w++) {

            if (duration <= w) {

                dp[i][w] = Math.max(
                    impact + dp[i - 1][w - duration],
                    dp[i - 1][w]
                );

            } else {

                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    let selectedTasks = [];
    let w = maxHours;

    for (let i = n; i > 0; i--) {

        if (dp[i][w] !== dp[i - 1][w]) {

            selectedTasks.push(tasks[i - 1]);

            w -= tasks[i - 1].Duration;
        }
    }

    return {
        maxImpact: dp[n][maxHours],
        selectedTasks
    };
}

app.get("/schedule", async (req, res) => {

    try {

        let depots;
        let vehicles;

        try {

            log("Attempting depot API");

            const depotResponse = await axios.get(
                DEPOT_API,
                { headers }
            );

            depots = depotResponse.data.depots;

        } catch (error) {

            log("Depot API unavailable. Using fallback data.");

            depots = fallbackDepots;
        }

        try {

            log("Attempting vehicle API");

            const vehicleResponse = await axios.get(
                VEHICLE_API,
                { headers }
            );

            vehicles = vehicleResponse.data.vehicles;

        } catch (error) {

            log("Vehicle API unavailable. Using fallback data.");

            vehicles = fallbackVehicles;
        }

        let results = [];

        for (const depot of depots) {

            log(`Processing Depot ${depot.ID}`);

            const optimized = knapsack(
                vehicles,
                depot.MechanicHours
            );

            results.push({
                depotID: depot.ID,
                mechanicHours: depot.MechanicHours,
                totalImpact: optimized.maxImpact,
                selectedTasks: optimized.selectedTasks
            });
        }

        log("Scheduling completed");

        res.status(200).json({
            success: true,
            results
        });

    } catch (error) {

        log(`Error: ${error.message}`);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(3000, () => {

    log("Server started");

    console.log("Server running on port 3000");
});