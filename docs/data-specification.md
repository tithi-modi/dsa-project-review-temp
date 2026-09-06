# Data Specification

## 1. Farmer

The Farmer entity represents an individual farmer registered in the dairy collection system.

| Field | Description |
|---|---|
| `farmerId` | Unique identifier for the farmer |
| `name` | Name of the farmer |
| `phone` | Phone number of the farmer |
| `bankDetails` | Bank information required for payouts |
| `centerId` | Collection center associated with the farmer |

### Farmer Field Specifications

| Field | Data Type | Required | Validation / Constraints |
|---|---|---|---|
| `farmerId` | String | Yes | Must be unique; format `FARM-XXX` |
| `name` | String | Yes | Must contain a valid farmer name |
| `phone` | String | Yes | Must contain a valid phone number |
| `bankDetails` | Object | Yes | Contains information required for payouts |
| `centerId` | String | Yes | Must reference a valid collection center |

## 2. Collection Log

The Collection Log entity represents a single milk intake/delivery event made by a farmer.

| Field | Description |
|---|---|
| `logId` | Unique identifier for the collection log |
| `farmerId` | Identifier of the farmer who delivered the milk |
| `timestamp` | Date and time when the milk was collected |
| `quantityLiters` | Quantity of milk collected, in liters |
| `fatPercentage` | Fat percentage of the collected milk |
| `snfPercentage` | SNF percentage of the collected milk |
| `calculatedPayout` | Payout calculated for the milk delivery |

### Collection Log Field Specifications

| Field | Data Type | Required | Validation / Constraints |
|---|---|---|---|
| `logId` | String | Yes | Must be unique |
| `farmerId` | String | Yes | Must reference a valid farmer |
| `timestamp` | Date | Yes | Must represent a valid date and time |
| `quantityLiters` | Number | Yes | Must be greater than 0 |
| `fatPercentage` | Number | Yes | Must be between 2.0 and 15.0 |
| `snfPercentage` | Number | Yes | Must be within the project's defined realistic range |
| `calculatedPayout` | Number | Yes | Must be greater than or equal to 0 |

## 3. Center Node

The Center Node entity represents a milk collection center.

| Field | Description |
|---|---|
| `centerId` | Unique identifier for the collection center |
| `name` | Name of the collection center |
| `locationCoords` | Geographic latitude and longitude of the center |
| `tankerCapacityLiters` | Maximum tanker capacity associated with the center |

### Center Field Specifications

| Field | Data Type | Required | Validation / Constraints |
|---|---|---|---|
| `centerId` | String | Yes | Must be unique |
| `name` | String | Yes | Must contain a valid center name |
| `locationCoords` | Object | Yes | Must contain valid latitude and longitude |
| `tankerCapacityLiters` | Number | Yes | Must be greater than 0 |

## 4. Relationships

- A Farmer belongs to a Collection Center through `centerId`.
- A Collection Log belongs to a Farmer through `farmerId`.
- A Farmer can have multiple Collection Logs.
- A Collection Center can have multiple Farmers.

## 5. Validation Rules

The validation rules defined above will be used as the reference for dummy data generation, database schemas, and API contracts in subsequent project stages.
