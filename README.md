# Vector.ts

Vector.ts is a completely different approach to vector mathematics.

Many other ways of handling vector mathematics can result in unintuative behaviours due to call order. Chaining syntax such as `v1.subtract(v2).divide(v3)` actually means `(v1 - v2) / v3` rather than the expectation `v1 - (v2 / v3)`. Instead, the syntax `v1.subtract(v2.divide(v3))` is required.

## What Do Vector Calculations Look Like?

Instead of many functions for various arathmatic operations, vector allows you to define an operation for a vector, or set of vectors to be for each element in that vector.

```typescript
var v1: number[] = [2, 1, 4],
    v2: number[] = [3, 6, 5],
    v3: number[] = [8, 7, 9];
    
Vector.from(v1).with(v2).with(v3).as((v1, v2, v3) => (v1 + v2) / v3); //produces [0.625, 1, 1]
```

The function is applied to the vectors in an element wise fashion, `(v1, v2, v3) => (v1 + v2) / v3` will first be called as `(2, 3, 8) => 2 + 3 / 8`.

The syntax displayed above makes the result explicity match the expected arithmetic result.

The returned object can then be treated as an array.
