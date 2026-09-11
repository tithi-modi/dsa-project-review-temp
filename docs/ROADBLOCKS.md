# Technical Roadblocks & Integration Notes

### 1. Pointer Traversal & Linked List Node Disconnection (Pointer Issue)
* **Problem:** During collision resolution in `set()` and `get()`, unhandled `current.next` reference reassignment risked dangling nodes or losing appended items at the end of a chain.
* **Impact:** Intermittent missing records when retrieving items stored deep within collision buckets.
* **Resolution:** Standardized linked list node traversal using an explicit `while (current)` loop with `current.next === null` tail insertion logic, ensuring every colliding node preserves its pointer reference to subsequent elements.

### 2. Recursive Resizing Stack Overflow & Load Factor Recalculation (Memory Issue)
* **Problem:** Calling `this.set()` inside the `resize()` method re-triggered the load factor check (`getLoadFactor() > 0.75`). Because `this.count` was not reset prior to re-insertion, the system repeatedly triggered `resize()` recursively, leading to heap memory consumption and stack overflow.
* **Impact:** System crash whenever the dataset crossed 12 items (0.75 of 16).
* **Resolution:** Explicitly reset `this.count = 0` inside `resize()` prior to iterating and re-inserting nodes into the doubled bucket array.

### 3. Module Instance Synchronization Across Routes (Synchronization Issue)
* **Problem:** Importing `new HashTable()` separately in both `server.js` and `farmerController.js` created two isolated in-memory tables. Data hydrated at server boot was invisible to the route controller.
* **Impact:** `GET /api/farmers/:id` returned `404 Not Found` despite server startup logging successful dataset hydration.
* **Resolution:** Consolidated state management into a single singleton service export (`utils/hashTableService.js`). Instantiating `farmerHashTable` once and exporting the live instance ensured both the hydration script and controller route referenced the exact same memory address space.

### 4. Git Concurrent Merge Conflicts (Version Control Issue)
* **Problem:** Merging remote repository updates into local working branches produced Git conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) inside `utils/HashTable.js`.
* **Impact:** Node.js thrown `SyntaxError: Unexpected token ':'` when attempting to execute unit tests or boot `server.js`.
* **Resolution:** Manually resolved conflict blocks in VS Code by combining local dynamic resizing (`resize()`, `getLoadFactor()`) with remote helper standardizations, followed by explicit staging (`git add`) and merge commit completion.