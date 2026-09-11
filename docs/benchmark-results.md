# Benchmark Results

## 1. Objective

This benchmark compares farmer lookup using:

- Linear search
- A custom hash table with separate chaining for collision handling

The comparison was performed using datasets containing 100, 1,000, and 10,000 farmers.

## 2. Benchmark Results

| Dataset Size | Average Linear Search | Average Hash Table |
|---:|---:|---:|
| 100 farmers | 1782.30 ns | 235.20 ns |
| 1,000 farmers | 13257.90 ns | 64.80 ns |
| 10,000 farmers | 127294.90 ns | 171.10 ns |

Both methods successfully found the requested farmer in all benchmark tests.

## 3. Analysis

The benchmark shows that linear search becomes significantly slower as the dataset size increases.

For linear search, the lookup time increases from 1782.30 ns for 100 farmers to 127294.90 ns for 10,000 farmers.

The hash table maintains substantially lower lookup times across all three dataset sizes.

This is consistent with the expected complexity:

- Linear search: O(n)
- Hash-table lookup: O(1) average case

The custom hash table uses separate chaining to handle collisions, allowing multiple keys that map to the same bucket to be stored without overwriting existing entries.

## 4. Conclusion

The benchmark demonstrates that the hash-table implementation provides substantially faster farmer lookup than linear search for the tested datasets.

The advantage becomes particularly clear as the dataset size increases, supporting the use of hash-based lookup for efficient farmer identification.
