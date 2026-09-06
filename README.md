# 🥛 Cooperative Dairy Collection & Milk Quality Management System
**CSC210 — Monsoon 2026 | Group 4**  
*Ahmedabad University*

A three-tier web application combining persistent MongoDB storage with custom in-memory Data Structures & Algorithms (DSA) acceleration engines to optimize district-level liquid milk intake, instant payouts, and cold-chain tanker routing.

---

## 👥 Project Team
* **Tithi Modi** (AU2410174)
* **Chinmay Ashish Barje** (AU2520178)
* **Aahana Atul Gattani** (AU2420200)

---

## 🏗️ System Architecture

The application operates as a three-tier web stack where persistent data is coupled with RAM-bound DSA acceleration modules:

* **Frontend Layer:** React.js featuring specialized interfaces for Farmers (payout history), Intake Staff (shift entry & live queue), and Managers (analytics & route visualization).
* **Backend Layer:** Node.js & Express REST API managing business logic, JWT authentication, and rate-chart payout calculations.
* **Data Storage & Acceleration:** MongoDB as the persistent system of record, alongside custom in-memory DSA engines built directly in RAM on backend process startup.

```text
+-----------------------------------------------------------------------+
|                           React.js Frontend                           |
|    [ Farmer Screen ]      [ Intake Staff Screen ]   [ Manager Dash ]  |
+-----------------------------------------------------------------------+
                                   |  (JSON / REST API)
+-----------------------------------------------------------------------+
|                         Node.js / Express Backend                     |
|    [ JWT / RBAC Auth ]    [ Payout Engine ]    [ Business Logic ]     |
+-----------------------------------------------------------------------+
                                   |
            +----------------------+----------------------+
            |                                             |
+-----------------------+                   +---------------------------+
|    MongoDB Database   |                   |   In-Memory DSA Engines   |
| (Persistent Storage)  | <--- Hydrates --- |  • Hash Table (Farmers)   |
|                       |                   |  • AVL Tree (Quality)     |
|                       |                   |  • Graph (Tanker Routes)  |
|                       |                   |  • FIFO Queue (Arrivals)  |
+-----------------------+                   +---------------------------+
