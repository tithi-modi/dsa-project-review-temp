// utils/HashTable.js

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
