// utils/HashTable.js

<<<<<<< HEAD
// 1. Linked List Node (holds key, value, and next pointer)
class Node {
  constructor(key, value) {
    this.key = key;      // e.g., "FARM-101"
    this.value = value;  // Full farmer object
    this.next = null;    // Pointer for collision handling (Day 5)
  }
}

// 2. Main HashTable Class
class HashTable {
  constructor(capacity = 16) {
    this.buckets = new Array(capacity).fill(null); // Fixed starting size of 16
    this.capacity = capacity;                      // Total capacity
    this.count = 0;                                 // Tracks number of elements
  }

  // 3. Custom Hash Function
  _hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    return total % this.capacity; // Fits result within array bounds
  }

  // 4. Basic set() method
  set(key, value) {
    const index = this._hash(key);
    const newNode = new Node(key, value);
    
    // Direct store for today (separate chaining handles collisions on Day 5)
    this.buckets[index] = newNode;
    this.count++;
  }

  // 5. Basic get() method
  get(key) {
    const index = this._hash(key);
    const node = this.buckets[index];
    
    if (!node) return null;
    return node.value;
  }
}

module.exports = HashTable;
=======
// Linked List Node for separate chaining
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {
  constructor(capacity = 16) {
    this.buckets = new Array(capacity).fill(null);
    this.capacity = capacity;
    this.count = 0;
  }

  // Hash function
  _hash(key) {
    let total = 0;

    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }

    return total % this.capacity;
  }

  // Insert or update a key-value pair
  set(key, value) {
  const index = this._hash(key);
  const newNode = new Node(key, value);

  if (!this.buckets[index]) {
    this.buckets[index] = newNode;
  } else {
    let current = this.buckets[index];

    while (current.next) {
      current = current.next;
    }

    current.next = newNode;
  }

  this.count++;
}
// Retrieve a value by key
get(key) {
  const index = this._hash(key);
  let current = this.buckets[index];

  while (current) {
    if (current.key === key) {
      return current.value;
    }

    current = current.next;
  }

  return null;
}
}

module.exports = HashTable;
>>>>>>> a945a49b424354999e370fd967bc08f822fb2d57
