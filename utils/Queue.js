// utils/Queue.js

class QueueNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class Queue {
  constructor() {
    this.head = null; // front of the line — dequeue from here
    this.tail = null; // back of the line — enqueue here
    this.size = 0;
  }

  enqueue(value) {
    const node = new QueueNode(value);
    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }

  // Removes and returns the first node whose value matches predicate,
  // not just the front — a farmer can submit out of strict arrival order
  dequeueMatching(predicate) {
    let prev = null;
    let current = this.head;

    while (current) {
      if (predicate(current.value)) {
        if (prev) prev.next = current.next;
        else this.head = current.next;
        if (current === this.tail) this.tail = prev;
        this.size--;
        return current.value;
      }
      prev = current;
      current = current.next;
    }
    return null;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

module.exports = Queue;