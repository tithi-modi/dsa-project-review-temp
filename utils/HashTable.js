// utils/HashTable.js

// 1. Linked List Node (holds key, value, and next pointer)
class Node {
  constructor(key, value, next = null) {
    this.key = key;
    this.value = value;
    this.next = next;
  }
}

class HashTable {
  constructor(capacity = 16) {
    this.buckets = new Array(capacity).fill(null);
    this.capacity = capacity;
    this.count = 0;
  }

  _hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    return total % this.capacity;
  }

  getLoadFactor() {
    return this.count / this.capacity;
  }

  resize() {
    const oldBuckets = this.buckets;
    this.capacity = this.capacity * 2;
    this.buckets = new Array(this.capacity).fill(null);
    this.count = 0;

    console.log(`[HashTable] Resizing capacity to ${this.capacity}...`);

    for (let i = 0; i < oldBuckets.length; i++) {
      let current = oldBuckets[i];
      while (current) {
        this.set(current.key, current.value);
        current = current.next;
      }
    }
  }

  set(key, value) {
    const index = this._hash(key);
    const head = this.buckets[index];

    if (!head) {
      this.buckets[index] = new Node(key, value);
      this.count++;
    } else {
      let current = head;
      while (current) {
        if (current.key === key) {
          current.value = value;
          return;
        }
        if (current.next === null) {
          current.next = new Node(key, value);
          this.count++;
          break;
        }
        current = current.next;
      }
    }

    if (this.getLoadFactor() > 0.75) {
      this.resize();
    }
  }

  get(key) {
    const index = this._hash(key);
    let current = this.buckets[index];

    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }

    return undefined;
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
