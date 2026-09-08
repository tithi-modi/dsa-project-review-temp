# API Contracts

This document defines the request and response contracts for the current backend API stubs.

## 1. Base URL

The backend server runs on port `5000` by default.

```text
http://localhost:5000
```

API routes are grouped under the following prefixes:

- `/api/auth`
- `/api/farmers`
- `/api/intake`
- `/api/manager`
- `/api/routes`

---

## 2. Standard Response Format

The target response format for the API is:

```json
{
  "success": true,
  "data": {}
}
```

For errors:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

The current controllers are stubs and do not yet consistently follow this format. Existing responses use `success`, `status`, or direct response objects.

The standard format should be adopted when the stub controllers are replaced with database-backed implementations.

---

# 3. Authentication API

## 3.1 Staff Login

### Endpoint

```text
POST /api/auth/login
```

### Purpose

Authenticates a staff user and returns a mock authentication token and user information.

### Request Body

The current stub reads the `username` field from the request body.

```json
{
  "username": "staff01"
}
```

| Field | Data Type | Required | Description |
|---|---|---|---|
| `username` | String | Yes | Login username |

### Current Success Response

Status: `200 OK`

```json
{
  "success": true,
  "message": "Staff authentication successful (Stub)",
  "token": "mock-jwt-token-xyz789",
  "user": {
    "username": "staff01",
    "role": "INTAKE_STAFF",
    "centerId": "CENTER-01"
  }
}
```

### Notes

The current login stub does not read a password from the request.

The `User` model currently defines the allowed role values as `staff` and `manager`. The login stub instead returns `INTAKE_STAFF`. This discrepancy is documented in Section 8.

The login stub also returns `centerId`, although `centerId` is not currently a field in the `User` model.

---

# 4. Farmer APIs

## 4.1 Get Farmer by ID

### Endpoint

```text
GET /api/farmers/:id
```

### Purpose

Retrieves farmer information using the farmer ID.

### Path Parameter

| Parameter | Data Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Farmer identifier |

### Example Request

```text
GET /api/farmers/FARM-001
```

### Current Success Response

Status: `200 OK`

The current stub returns the requested path parameter as `farmerId`.

```json
{
  "farmerId": "FARM-001",
  "name": "Ramesh Patel",
  "phone": "9876543210",
  "centerId": "CENTER-001"
}
```

### Notes

The current stub returns a direct farmer object rather than the standard response envelope.

The current stub does not return `bankDetails`, although `bankDetails` is part of the `Farmer` data model.

---

## 4.2 Register Farmer

### Endpoint

```text
POST /api/farmers/register
```

### Purpose

Registers a new farmer.

### Request Body

The controller reads the following fields from the request body:

```json
{
  "farmerId": "FARM-001",
  "name": "Ramesh Patel",
  "phone": "9876543210",
  "bankDetails": {},
  "centerId": "CENTER-001"
}
```

| Field | Data Type | Required | Description |
|---|---|---|---|
| `farmerId` | String | Yes | Unique farmer identifier |
| `name` | String | Yes | Farmer name |
| `phone` | String | Yes | Farmer phone number |
| `bankDetails` | Object | Yes | Farmer banking information |
| `centerId` | String | Yes | Collection center identifier |

### Example Request

```json
{
  "farmerId": "FARM-001",
  "name": "Ramesh Patel",
  "phone": "9876543210",
  "bankDetails": {},
  "centerId": "CENTER-001"
}
```

### Current Success Response

Status: `201 Created`

```json
{
  "message": "Farmer registered successfully",
  "farmer": {
    "farmerId": "FARM-001",
    "name": "Ramesh Patel",
    "phone": "9876543210",
    "bankDetails": {},
    "centerId": "CENTER-001"
  }
}
```

### Notes

The `Farmer` model requires `bankDetails`, but its internal structure is currently defined as `Mixed`. Therefore, this API contract does not impose a specific internal bank-details structure.

---

# 5. Milk Intake APIs

## 5.1 Submit Milk Intake

### Endpoint

```text
POST /api/intake/submit
```

### Purpose

Submits a milk collection record for a farmer.

### Request Body

The current stub reads the following fields:

```json
{
  "farmerId": "FARM-001",
  "quantityLiters": 15.5,
  "fatPercentage": 4.2,
  "snfPercentage": 8.5
}
```

| Field | Data Type | Required | Description |
|---|---|---|---|
| `farmerId` | String | Yes | ID of the farmer providing milk |
| `quantityLiters` | Number | Yes | Quantity of milk collected in litres |
| `fatPercentage` | Number | Yes | Milk fat percentage |
| `snfPercentage` | Number | Yes | Milk SNF percentage |

### Example Request

```json
{
  "farmerId": "FARM-001",
  "quantityLiters": 15.5,
  "fatPercentage": 4.2,
  "snfPercentage": 8.5
}
```

### Current Success Response

Status: `200 OK`

```json
{
  "status": "success",
  "message": "Milk intake log submitted successfully (stub)",
  "data": {
    "logId": "LOG-1001",
    "farmerId": "FARM-001",
    "quantityLiters": 15.5,
    "fatPercentage": 4.2,
    "snfPercentage": 8.5,
    "timestamp": "2026-09-09T00:00:00.000Z"
  }
}
```

### Notes

The current stub provides default values when request fields are missing.

The `CollectionLog` model also contains `calculatedPayout`, but the current intake stub response does not return this field.

The actual database-backed implementation should ensure that `farmerId` refers to a valid farmer.

---

## 5.2 Get Collection Queue

### Endpoint

```text
GET /api/intake/queue
```

### Purpose

Returns farmers currently waiting in the collection queue.

### Request

No request body or parameters are currently used by the stub.

### Current Success Response

Status: `200 OK`

```json
{
  "status": "success",
  "queueCount": 3,
  "queue": [
    {
      "farmerId": "FARM-101",
      "name": "Ramesh Patel",
      "arrivalTime": "08:15 AM"
    },
    {
      "farmerId": "FARM-102",
      "name": "Suresh Kumar",
      "arrivalTime": "08:22 AM"
    },
    {
      "farmerId": "FARM-103",
      "name": "Anita Sharma",
      "arrivalTime": "08:30 AM"
    }
  ]
}
```

### Notes

The current stub uses `FARM-101` through `FARM-103`. These IDs are outside the generated farmer dataset, which currently contains `FARM-001` through `FARM-100`.

This discrepancy is documented in Section 8.

---

# 6. Manager Analytics API

## 6.1 Get Analytics

### Endpoint

```text
GET /api/manager/analytics
```

### Purpose

Returns summary metrics for milk collection and farmer activity.

### Request

No request body or parameters are currently used by the stub.

### Current Success Response

Status: `200 OK`

```json
{
  "status": "success",
  "date": "2026-09-09",
  "metrics": {
    "totalLiters": 1250.5,
    "averageFat": 4.2,
    "averageSnf": 8.5,
    "totalPayoutINR": 45000,
    "activeFarmersToday": 42
  }
}
```

### Response Fields

| Field | Data Type | Description |
|---|---|---|
| `date` | String | Date represented by the analytics |
| `metrics.totalLiters` | Number | Total milk collected |
| `metrics.averageFat` | Number | Average milk fat percentage |
| `metrics.averageSnf` | Number | Average milk SNF percentage |
| `metrics.totalPayoutINR` | Number | Total payout in Indian rupees |
| `metrics.activeFarmersToday` | Number | Number of active farmers for the day |

---

# 7. Route Optimization API

## 7.1 Get Optimized Route

### Endpoint

```text
GET /api/routes/optimize
```

### Purpose

Returns a stubbed tanker route and the recommended pickup order.

### Request

No request body or parameters are currently used by the stub.

### Current Success Response

Status: `200 OK`

```json
{
  "status": "success",
  "tankerId": "TANKER-01",
  "totalDistanceKm": 24.5,
  "pickupOrder": [
    {
      "step": 1,
      "centerId": "CENTER-A",
      "name": "North Village Hub",
      "estimatedVolume": 450
    },
    {
      "step": 2,
      "centerId": "CENTER-B",
      "name": "East Dairy Node",
      "estimatedVolume": 300
    },
    {
      "step": 3,
      "centerId": "CENTER-C",
      "name": "Central Processing Plant",
      "estimatedVolume": 500
    }
  ]
}
```

### Response Fields

| Field | Data Type | Description |
|---|---|---|
| `tankerId` | String | Identifier of the tanker |
| `totalDistanceKm` | Number | Total planned route distance |
| `pickupOrder` | Array | Ordered list of pickup locations |
| `pickupOrder[].step` | Number | Position in the pickup sequence |
| `pickupOrder[].centerId` | String | Collection center identifier |
| `pickupOrder[].name` | String | Collection center name |
| `pickupOrder[].estimatedVolume` | Number | Estimated milk volume to be collected |

---

# 8. Data Model to API Mapping

## 8.1 Farmer

| API Field | Data Model Field |
|---|---|
| `farmerId` | `Farmer.farmerId` |
| `name` | `Farmer.name` |
| `phone` | `Farmer.phone` |
| `bankDetails` | `Farmer.bankDetails` |
| `centerId` | `Farmer.centerId` |

## 8.2 Collection Log

| API Field | Data Model Field |
|---|---|
| `logId` | `CollectionLog.logId` |
| `farmerId` | `CollectionLog.farmerId` |
| `quantityLiters` | `CollectionLog.quantityLiters` |
| `fatPercentage` | `CollectionLog.fatPercentage` |
| `snfPercentage` | `CollectionLog.snfPercentage` |
| `timestamp` | `CollectionLog.timestamp` |
| `calculatedPayout` | `CollectionLog.calculatedPayout` |

## 8.3 User

| API Field | Data Model Field |
|---|---|
| `username` | `User.username` |
| `role` | `User.role` |

The current login response also contains `centerId`, but `centerId` is not currently part of the `User` model.

---

# 9. Known Contract Discrepancies

The following inconsistencies exist between the current API stubs, generated data, and finalized data models.

## 9.1 Farmer IDs

The generated farmer dataset contains IDs from:

```text
FARM-001
```

through:

```text
FARM-100
```

The current intake queue stub uses:

```text
FARM-101
FARM-102
FARM-103
```

The current intake submission stub also defaults to `FARM-101` when no farmer ID is supplied.

These IDs should be aligned with the generated/database farmer records before the API is connected to the database.

---

## 9.2 Center IDs

The `CenterNode` model uses the format:

```text
CENTER-001
CENTER-002
```

The current route optimization stub instead uses:

```text
CENTER-A
CENTER-B
CENTER-C
```

These identifiers should be aligned with the actual center records when route optimization is connected to the database.

---

## 9.3 User Roles

The `User` model defines:

```text
staff
manager
```

The current login stub returns:

```text
INTAKE_STAFF
```

The authentication response and User model should use a consistent role vocabulary.

---

## 9.4 User Center Association

The login stub returns:

```json
{
  "centerId": "CENTER-01"
}
```

The current `User` model does not contain a `centerId` field.

The relationship between a staff user and a collection center therefore needs to be clarified before authentication becomes database-backed.

---

## 9.5 Response Envelope

The current endpoints use multiple response structures:

- `success`
- `status`
- direct objects
- `message` with nested objects

The API should eventually adopt the standardized response envelope defined in Section 2.

---

## 9.6 Calculated Payout

The `CollectionLog` model contains:

```text
calculatedPayout
```

but the current milk intake response does not include this field.

The final intake API should determine whether payout is calculated and returned as part of the submission response.

---

# 10. Ready-to-Use Stub Payloads

## 10.1 Login Request

```json
{
  "username": "staff01"
}
```

## 10.2 Farmer Lookup

```text
GET /api/farmers/FARM-001
```

## 10.3 Farmer Registration Request

```json
{
  "farmerId": "FARM-001",
  "name": "Ramesh Patel",
  "phone": "9876543210",
  "bankDetails": {},
  "centerId": "CENTER-001"
}
```

## 10.4 Milk Intake Request

```json
{
  "farmerId": "FARM-001",
  "quantityLiters": 15.5,
  "fatPercentage": 4.2,
  "snfPercentage": 8.5
}
```

## 10.5 Collection Queue

```text
GET /api/intake/queue
```

## 10.6 Manager Analytics

```text
GET /api/manager/analytics
```

## 10.7 Route Optimization

```text
GET /api/routes/optimize
```

---

# 11. API Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | Staff login |
| `GET` | `/api/farmers/:id` | Get farmer by ID |
| `POST` | `/api/farmers/register` | Register a farmer |
| `POST` | `/api/intake/submit` | Submit milk intake |
| `GET` | `/api/intake/queue` | Get collection queue |
| `GET` | `/api/manager/analytics` | Get manager analytics |
| `GET` | `/api/routes/optimize` | Get optimized tanker route |

---
## 12. Wireframe Cross-Check

The API contracts were cross-checked against the available frontend wireframes. The following fields are currently supported, derivable, or require clarification before the API is connected to the final frontend.

### 12.1 Farmer Dashboard

| Wireframe Field | API / Data Model Mapping | Status / Notes |
|---|---|---|
| Farmer name | `Farmer.name` | Supported |
| Account / Farmer ID | `Farmer.farmerId` | Supported |
| Total earned | `CollectionLog.calculatedPayout` | Can be calculated from collection logs |
| Pending amount | No current field | Requires clarification |
| Payment status | No current field | Requires clarification |
| Recent transfer | No current field | Requires clarification |
| Transaction ID | No current field | Requires clarification |
| Delivery date | `CollectionLog.timestamp` | Supported |
| Liters | `CollectionLog.quantityLiters` | Supported |
| Fat % | `CollectionLog.fatPercentage` | Supported |
| SNF % | `CollectionLog.snfPercentage` | Supported |
| Delivery ID | `CollectionLog.logId` | Naming should be aligned |

### 12.2 Staff Entry - Mobile and Desktop

| Wireframe Field | API / Data Model Mapping | Status / Notes |
|---|---|---|
| Farmer ID | `Farmer.farmerId` | Supported; wireframe example uses a different ID format |
| Farmer name | `Farmer.name` | Supported |
| Milk type | No current field | Requires `milkType` definition if required |
| Quantity in liters | `CollectionLog.quantityLiters` | Supported |
| Fat % | `CollectionLog.fatPercentage` | Supported |
| SNF % | `CollectionLog.snfPercentage` | Supported; validation range needs clarification |
| Estimated payout | `CollectionLog.calculatedPayout` | Supported by data model; intake response contract needs to define whether it is returned |
| Live queue | `/api/intake/queue` | Endpoint exists; queue response fields need to be defined |
| Queue position | No current data-model field | Queue response contract required |
| Arrival time / waiting time | No current data-model field | Queue response contract required |
| Farmer village / route | No current Farmer field | Requires clarification |

### 12.3 Manager Dashboard

| Wireframe Field | API / Data Model Mapping | Status / Notes |
|---|---|---|
| Operating date | `/api/manager/analytics` → `date` | Supported |
| Username | `User.username` | Supported |
| Role | `User.role` | Supported |
| Single-day filter | `/api/manager/analytics` | Query parameter needs to be defined |
| Compare date | `/api/manager/analytics` | Query parameter needs to be defined |
| Centre filter | `CenterNode.centerId` | Query parameter needs to be defined |
| Total milk collected | `CollectionLog.quantityLiters` | Can be calculated |
| Average quality score | `CollectionLog.fatPercentage`, `CollectionLog.snfPercentage` | Can be calculated; exact scoring formula needs clarification |
| Total payout | `CollectionLog.calculatedPayout` | Can be calculated |
| Centre name | `CenterNode.name` | Supported |
| Centre location / village | `CenterNode.locationCoords` | Coordinates supported; named village/location needs clarification |
| Staff on shift | No current User field | Staff-centre/shift association needs clarification |
| Today's milk | `CollectionLog.quantityLiters` | Can be calculated |
| Capacity used | `CenterNode.tankerCapacityLiters` + collection data | Can be calculated |
| Quality grade | Fat/SNF fields available | Calculation/grade rules need clarification |
| Export CSV | No dedicated API contract currently defined | Requires clarification if backend export is required |
| Tanker route map | `/api/routes/optimize` | Endpoint exists; centre identifiers need alignment |

### 12.4 Cross-Model Identifier Consistency

The wireframes currently contain example identifiers that differ from the generated/database data.

- Generated farmer IDs use `FARM-001` through `FARM-100`.
- Some staff wireframe examples use IDs such as `F-1048`.
- `CenterNode` uses centre IDs such as `CENTER-001` and `CENTER-002`.
- The route optimization stub currently uses `CENTER-A`, `CENTER-B`, and `CENTER-C`.

These identifiers must be aligned before the frontend is connected to the database-backed API.

### 12.5 Fields Requiring Team Clarification

The following wireframe fields do not currently have a direct data-model/API representation:

1. Farmer payment status.
2. Farmer pending payment amount.
3. Farmer transaction / transfer ID.
4. Milk type (Cow/Buffalo).
5. Farmer village / route information.
6. Queue position and arrival/waiting information.
7. Staff-to-centre and staff-to-shift association.
8. Named centre village/location, if coordinates are insufficient.
9. Quality grade calculation.
10. Analytics date/comparison/centre filter parameters.
11. CSV export behaviour.
12. Whether calculated payout is returned directly by the milk-intake API.

These items should be clarified with the frontend/backend team before the corresponding API or database fields are finalized.