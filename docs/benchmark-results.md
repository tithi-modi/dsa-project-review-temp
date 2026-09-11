# Benchmark Results

## 1. Objective

This benchmark compares farmer lookup using:

- Linear search
- A custom hash table with separate chaining for collision handling

The comparison was performed using datasets containing 100, 1,000, and 10,000 farmers.

The purpose is to compare the practical lookup performance of the two approaches as the dataset size increases.

## 2. Benchmark Methodology

For each dataset size:

- The benchmark performs 1,000 lookup trials.
- The target farmer is the last farmer in the dataset.
- Linear search uses JavaScript's `Array.find()` method.
- The hash-table lookup uses the custom `HashTable` implementation.
- The hash-table capacity is set to twice the number of farmers.
- Separate chaining is used to handle hash collisions.
- Lookup time is measured using `process.hrtime.bigint()`.
- The reported value is the average lookup time per trial, measured in nanoseconds.

Both methods were verified to successfully find the requested farmer in all benchmark tests.

## 3. Benchmark Results

| Dataset Size | Average Linear Search | Average Hash Table |
|---|---:|---:|
| 100 farmers | 1782.30 ns | 235.20 ns |
| 1,000 farmers | 13257.90 ns | 64.80 ns |
| 10,000 farmers | 127294.90 ns | 171.10 ns |

Both methods successfully found the requested farmer in all benchmark tests.

## 4. Analysis

The benchmark shows that linear search becomes substantially slower as the dataset size increases.

The average linear-search time increased from 1782.30 ns for 100 farmers to 127294.90 ns for 10,000 farmers.

In comparison, hash-table lookup remained substantially faster for all three tested dataset sizes.

The observed results are consistent with the expected average-case complexities:

- Linear search: O(n)
- Hash-table lookup: O(1) average case

The hash table uses separate chaining to handle collisions. When multiple keys map to the same bucket, they are stored in a linked list rather than overwriting existing entries.

The hash-table implementation therefore provides efficient average-case lookup while still correctly handling collisions.

The measured times are implementation- and system-dependent. They should be interpreted as results from this benchmark rather than universal performance values.

## 5. Conclusion

The benchmark demonstrates that the custom hash-table implementation provides substantially faster farmer lookup than linear search for the tested datasets.

As the dataset size increases, the performance difference becomes more pronounced. This supports the use of hash-based lookup when efficient farmer identification is required.

The experiment also demonstrates the practical importance of choosing an appropriate data structure for lookup-heavy operations.
