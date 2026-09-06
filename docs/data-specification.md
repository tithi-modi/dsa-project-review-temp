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
| `name` | String | Yes | Must not be empty; should contain alphabetic characters and spaces |
| `phone` | String | Yes | Must be a 10-digit phone number |
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
| `logId` | String | Yes | Must be unique; format `LOG-XXX`|
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
| `centerId` | String | Yes | Must be unique; format `CENTER-XXX` |
| `name` | String | Yes | Must not be empty |
| `locationCoords` | Object | Yes | Must contain valid latitude and longitude |
| `tankerCapacityLiters` | Number | Yes | Must be greater than 0 |

## 4. Relationships

- A Farmer belongs to a Collection Center through `centerId`.
- A Collection Log belongs to a Farmer through `farmerId`.
- A Farmer can have multiple Collection Logs.
- A Collection Center can have multiple Farmers.

## 5. Validation Rules

The following validation rules apply across the data model:

### Farmer

- `farmerId` must be unique and follow the format `FARM-XXX`.
- `name` is required and must not be empty.
- `phone` is required and must contain exactly 10 digits.
- `bankDetails` is required and must contain the information needed for payouts.
- `centerId` is required and must reference an existing collection center.

### Collection Log

- `logId` must be unique and follow the format `LOG-XXX`.
- `farmerId` is required and must reference an existing farmer.
- `timestamp` is required and must represent a valid date and time.
- `quantityLiters` must be greater than 0.
- `fatPercentage` must be between 2.0 and 15.0.
- `snfPercentage` must be within the project's defined realistic range.
- `calculatedPayout` must be greater than or equal to 0.

### Center Node

- `centerId` must be unique and follow the format `CENTER-XXX`.
- `name` is required and must not be empty.
- `locationCoords` must contain valid latitude and longitude values.
- `tankerCapacityLiters` must be greater than 0.
  
## 6. User

The User entity represents staff and manager accounts used for authentication and role-based access to the system.

| Field | Description |
|---|---|
| `userId` | Unique identifier for the user |
| `name` | Name of the staff member or manager |
| `email` | Email address used for login |
| `passwordHash` | Hashed password used for authentication |
| `role` | Access role of the user: `staff` or `manager` |
| `centerId` | Collection center associated with the user |

### User Field Specifications

| Field | Data Type | Required | Validation / Constraints |
|---|---|---|---|
| `userId` | String | Yes | Must be unique; format `USER-XXX` |
| `name` | String | Yes | Must not be empty |
| `email` | String | Yes | Must be a valid email address and unique |
| `passwordHash` | String | Yes | Must contain a securely hashed password |
| `role` | String | Yes | Must be either `staff` or `manager` |
| `centerId` | String | Yes | Must reference a valid collection center |

