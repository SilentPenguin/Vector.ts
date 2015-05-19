# Vector.ts

Vector.ts is a completely different approach to vector mathematics.

Instead of many functions for various arathmatic operations, Vector.ts aims to solve the problems most commonly delt with using vectors.
For anything more specific, Vector allows you to define an operation for a vector, or set of vectors to be performed for each element in that vector.

## What Does It Look Like?

Many other ways of handling vector mathematics can result in unintuative behaviours due to call order.
Chaining syntax such as `v1.subtract(v2).divide(v3)` means `(v1 - v2) / v3` rather than `v1 - (v2 / v3)`.
To acheive the latter, the call `v1.subtract(v2.divide(v3))` would be required.
Such subtle changes in code are unintiatuve, and hard to spot when looking for mistakes.
Instead, Vector.ts uses a function to allow the mutation of vectors in an arbitrary manner:

```typescript
var v1: number[] = [2, 1, 4],
    v2: number[] = [3, 6, 5],
    v3: number[] = [8, 7, 9];
    
Vector.from(v1).with(v2).with(v3).as((v1, v2, v3) => (v1 + v2) / v3); //produces [0.625, 1, 1]
```

The function is applied to the vectors in an element wise fashion, `(v1, v2, v3) => (v1 + v2) / v3` will first be called as `(2, 3, 8) => 2 + 3 / 8`.
The syntax displayed above makes the result explicity match the expected arithmetic result.
The returned object can then be treated as an array.

Vector.ts gives you the power to write your own expressions, then looks to address commonly solved problems such as those below:

```typescript
var v1: number[] = [2, 1, 4],
    v2: number[] = [3, 6, 5],
    v3: number[] = [8, 7, 9];
Vector.from(v1).to(v3); //returns [6, 6, 5], v3 - v1
Vector.from(v1).add(v2); //returns [5, 7, 9], ie, v1 + v2
Vector.from(v1).size.by(2); //returns [4, 2, 8], ie V1 * 2
Vector.from(v1).project.along(v2); //returns a vector projection of v1 onto v2
Vector.from(v1).project.plane(v2); //returns a vector rejection of v1 onto v2
```
