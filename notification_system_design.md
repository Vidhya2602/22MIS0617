# Campus Notifications Platform - System Design

## Stage 1

### 1. Core Platform Actions
To fully support the frontend requirements for logged-in students, the backend notification platform must explicitly provide and handle the following core capabilities:
*   **Fetch Current Notifications:** Pulls a student's customized feed of notices, split by read/unread states.
*   **Mark Single Notification as Read:** Updates the system state immediately when a student interacts with or clicks a single notification card.
*   **Mark All Notifications as Read:** A bulk-action endpoint to clear out all unread statuses instantly for a clean inbox view.
*   **Real-Time Delivery Channel:** A persistent stream to push breaking notifications (e.g., immediate placement deadlines) to active online users instantly.

---

### 2. REST API Endpoints & JSON Contracts

#### A. Fetch Notifications
*   **Endpoint:** `GET /api/v1/notifications`
*   **Headers:**
    *   `Authorization: Bearer <JWT_TOKEN>`
    *   `Accept: application/json`
*   **Response (Status Code: 200 OK):**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
        "type": "Placement",
        "message": "CSX Corporation hiring process has been initiated.",
        "isRead": false,
        "timestamp": "2026-04-22T17:51:18Z"
      }
    ],
    "pagination": { "currentPage": 1, "pageSize": 10, "totalUnread": 1 }
  }
}