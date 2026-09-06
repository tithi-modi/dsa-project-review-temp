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

## 3. Center Node

The Center Node entity represents a milk collection center.

| Field | Description |
|---|---|
| `centerId` | Unique identifier for the collection center |
| `name` | Name of the collection center |
| `locationCoords` | Geographic latitude and longitude of the center |
| `tankerCapacityLiters` | Maximum tanker capacity associated with the center |

## 4. Validation Rules

Validation rules for each field will be defined here.

## 5. Relationships

Relationships between Farmers, Collection Logs, and Center Nodes will be defined here.
