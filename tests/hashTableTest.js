const HashTable = require('../utils/HashTable');

console.log('--- STARTING HASH TABLE UNIT TESTS ---\n');

console.log('TEST 1: Testing Collision Handling...');
const ht = new HashTable(16);

ht.set('AB', { name: 'Farmer A' });
ht.set('BA', { name: 'Farmer B' });

const itemA = ht.get('AB');
const itemB = ht.get('BA');

if (itemA?.name === 'Farmer A' && itemB?.name === 'Farmer B') {
  console.log('✅ PASS: Both colliding keys retrieved successfully without data loss.\n');
} else {
  console.error('❌ FAIL: Collision resolution failed.\n');
}

console.log('TEST 2: Testing Automatic Resizing (Capacity doubling)...');
console.log(`Initial Capacity: ${ht.capacity}, Initial Count: ${ht.count}`);

for (let i = 1; i <= 12; i++) {
  ht.set(`FARM-${100 + i}`, { name: `Farmer ${i}` });
}

console.log(`Final Capacity: ${ht.capacity}`);
console.log(`Final Item Count: ${ht.count}`);
console.log(`Final Load Factor: ${ht.getLoadFactor().toFixed(2)}`);

if (ht.capacity === 32) {
  console.log('✅ PASS: HashTable successfully doubled capacity to 32 upon crossing 0.75 load factor.\n');
} else {
  console.error('❌ FAIL: HashTable did not resize capacity.\n');
}

console.log('TEST 3: Verifying Data Integrity After Resize...');
let allFound = true;

if (ht.get('AB')?.name !== 'Farmer A' || ht.get('BA')?.name !== 'Farmer B') {
  allFound = false;
}

for (let i = 1; i <= 12; i++) {
  if (ht.get(`FARM-${100 + i}`)?.name !== `Farmer ${i}`) {
    allFound = false;
    break;
  }
}

if (allFound) {
  console.log('✅ PASS: All data successfully preserved across re-hashing!\n');
} else {
  console.error('❌ FAIL: Data loss detected after resize operation.\n');
}

console.log('--- ALL UNIT TESTS COMPLETE ---');