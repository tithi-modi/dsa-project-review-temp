# CSC210 Monsoon 2026 — Group 4

## Dairy Collection Monitoring

This repository is the official project repository for **Group 4** of **CSC210 — Monsoon 2026**.

### Project

**Dairy Collection Monitoring**

The Cooperative Dairy Collection and Milk Quality Management System provides a software architecture designed to streamline the liquid-milk pipeline across a district cooperative union. Dairy cooperatives process high volumes of daily milk deliveries during narrow, twice-daily intake windows, requiring rapid on-site data processing alongside long-term auditability. To solve these operational challenges, the system integrates a three-tier web application stack with high-performance in-memory Data Structures and Algorithms (DSA) acceleration engines.

The architectural design couples a React.js frontend interface with a Node.js/Express REST API backend and a hybrid data layer. MongoDB acts as the persistent system of record, while specialised in-memory DSA engines; comprising a Hash Table, an AVL Binary Search Tree, FIFO Queues, and a Graph routing engine; live directly inside backend RAM to provide optimal runtime performance. The functional scope covers the core collection lifecycle: managing physical farmer arrival lines, validating fat and SNF analyser inputs, deriving quality scores, computing farmer payouts via two-axis rate charts, executing quality threshold queries, and optimising district tanker pickup routes.

To preserve algorithmic rigor and project feasibility, the scope is strictly bounded to single-district liquid-milk logistics. Secondary product manufacturing (ghee, paneer, powder), cross-union routing, and annual share-based dividend distributions are explicitly out of scope. By isolating core collection operations, this architecture guarantees sub-second response times for intake staff, accurate financial tracking for farmers, and data-driven route planning for cooperative management.


### Repository Purpose

2.  Planned Activities
Activity 1: System Architecture & Database Design We will map out three user screen flows: a read-only view for farmers to check delivery history and payouts, an intake staff screen for shift entry, and a manager dashboard for routing and analytics. We will define database schemas for farmer profiles, collection logs, and center nodes to establish consistent data fields. Additionally, we will name and stub all backend REST API routes with dummy data to establish the communication contract between layers. Software and Technologies Used: Figma for UI/UX wireframing, MongoDB and Mongoose for schema design, Node.js and Express for REST API routing.
Activity 2: Core Server & Identification Module (Hash Table) We will connect our backend server to a live database and build an in-memory Hash Table to enable instant O(1) farmer profile lookups by ID. We will implement separate chaining using linked lists to resolve hash collisions and set a dynamic array resize policy that triggers when the load factor crosses 0.75. We will also build a benchmarking harness script to record exact lookup latency against a baseline unsorted array. Software and Technologies Used: Node.js and Express for server framework, MongoDB for database connection, JavaScript for custom Hash Table engine and timing harness.

Activity 3: Collection Intake UI & Quality Indexing Engine (BST) We will build data-entry forms to capture milk volume, fat %, SNF %, farmer ID, and timestamps. On the backend, we will construct a self-balancing Binary Search Tree (AVL Tree) indexed by milk quality scores. This module will run O(log n + k) range queries to filter deliveries by quality thresholds while using self-balancing rotations to prevent the tree from degrading into an O(n) linked list when handling sorted inputs. Software and Technologies Used: React.js for frontend forms, JavaScript for in-memory AVL Tree engine.
Activity 4: Logistics Graph & Tanker Route Optimization We will model collection centers and road networks as a weighted adjacency list graph. We will implement a two-layer routing engine: Dijkstra algorithm using a min-heap priority queue to precompute shortest paths between centers, and a Capacitated Vehicle Routing Problem (VRP) heuristic using nearest-neighbor construction and 2-opt swaps to generate multi-stop tanker routes. The algorithm will validate every candidate route against a 7000 L tanker volume capacity and cold-chain transit time limits. Software and Technologies Used: JavaScript and Node.js for Graph adjacency list, Min-Heap Dijkstra algorithm, and 2-Opt VRP heuristic solver.
Activity 5: Queue Operations & Payout Scheduling We will build an in-memory First-In, First-Out (FIFO) Queue structure to manage physical farmer arrival lines during morning and evening collection shifts. We will also implement sorting algorithms to rank farmer delivery records by volume and quality score, formatting this data for management reports and payout analytics. Software and Technologies Used: JavaScript and Node.js for FIFO Queue circular buffer and sorting algorithms, React.js for live queue UI view.

3.  Status of Planned Activities
Duplicate the block below for each planned activity.
Activity 1: Software Architecture
Status: Screen-flow mapping and database schema design are complete; REST API route stubbing with dummy data is still pending. 

Implementation: The flowchart and the claude refined software architecture report can be found on https://drive.google.com/drive/folders/1aL-mW-K4-xK-6xtYhA_wD-47tbExk8Xl?usp=sharing. 

Difficulties: None of us had built a system architecture from scratch before, so a lot of the first two weeks went into just learning how the pieces are supposed to fit together: REST conventions, schema design, and how a hash table/BST/graph actually lives inside a backend. We're getting the hang of it now, but it took longer than we expected to feel confident making these calls as a team.  

4.  General Status of the Project
We're running slightly behind our original timeline, mainly due to the learning curve on the architecture side. That said, we now have a solid grasp of how the system fits together end-to-end, and we're confident we can deliver a strong, working product by the deadline.

5.  Upcoming Activities
Activity 2: Core Server & Identification Module (Hash Table)
 Status: Not Started
 Implementation:
First week of Sept: Connect our backend server to a live database and scaffold the core Express routes.
Sept second week: Build the in-memory Hash Table with separate chaining for collision resolution, implement the dynamic resize policy (triggered when load factor crosses 0.75), and build the benchmarking harness to record lookup latency against a baseline unsorted array.
 Duration: 2 weeks




### Group

**Group 4**

Repository access is managed through the **CSC210-Monsoon2026** GitHub organization and the **Group 4** team.

### Working Guidelines

- Keep project work organized and clearly documented.
- Use meaningful commit messages.
- Keep the repository structure clean.
- Document important decisions and changes.
- Do not commit passwords, API keys, tokens, or other secrets.
- Follow the submission requirements and instructions provided during the course.

### Repository Structure

The repository structure may evolve as the project develops.

```text
.
├── README.md
├── docs/
├── src/
└── ...
```

---

**CSC210 — Monsoon 2026**  
**Ahmedabad University**
