module Vector {
    /*----------------*
     * implementation *
     *----------------*/

    class Collection<T> implements Array<T>
    {
        constructor(vector?: Array<T>) {
            if (vector) {
                this.length = vector.length;
                for (var index in vector) {
                    this[index] = vector[index];
                }
            }
        }

        toString: () => string;
        toLocaleString: () => string;
        concat: <U extends T[]>(...items: U[]) => T[];
        join: (separator?: string) => string;
        pop: () => T;
        push: (...items: T[]) => number;
        reverse: () => T[];
        shift: () => T;
        slice: (start?: number, end?: number) => T[];
        sort: (compareFn?: (a: T, b: T) => number) => T[];
        splice: (start?: number, deleteCount?: number, ...items: T[]) => T[];
        unshift: (...items: T[]) => number;
        indexOf: (searchElement: T, fromIndex?: number) => number;
        lastIndexOf: (searchElement: T, fromIndex?: number) => number;
        every: (callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any) => boolean;
        some: (callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any) => boolean;
        forEach: (callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) => void;
        map: <U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any) => U[];
        filter: (callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any) => T[];
        reduce: <U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U) => U;
        reduceRight: <U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U) => U;
        length: number;
        [n: number]: T;
    }

    Collection.prototype = new Array;

    class Vector extends Collection<number> implements IVector {
        get x(): number {
            return this[0];
        }
        get y(): number {
            return this[1];
        }
        get z(): number {
            return this[2];
        }
        get w(): number {
            return this[3];
        }
        set x(val: number) {
            this[0] = val;
        }
        set y(val: number) {
            this[1] = val;
        }
        set z(val: number) {
            this[2] = val;
        }
        set w(val: number) {
            this[3] = val;
        }

        get size(): number {
            return Math.sqrt(from(this, this).dot());
        }

        get unit(): IVector {
            var size = this.size;
            return this.to(v => v / size);
        }

        get inverse(): IVector {
            return this.to(v => v * -1);
        }

        to(func: IFunction): IVector {
            var result: IVector = new Vector;

            for (var i: number = 0; i < this.length; i++) {
                result[i] = func.call(null, this[i]);
            }

            result.length = this.length;
            return result;
        }
    }

    export function from(vector: IArray): IVector;
    export function from(x: number, y: number, ...rest: number[]): IVector;
    export function from(v1: IArray, v2: IArray): IPairOperators;
    export function from(v1: IArray, v2: IArray, ...rest: IArray[]): IVectorOperators;
    export function from(...rest: any[]): any {
        return rest[0] instanceof Array && rest.length > 1 ? new VectorCollection(rest) : new Vector(rest.length == 1 ? rest[0] : rest);
    }

    class VectorCollection implements IVectorOperators, IPairOperators {
        vectors: IArray[];
        constructor(vectors: IArray[]) {
            this.vectors = vectors;
        }

        to(func: IFunction): IVector {
            var result: IVector = new Vector,
                call: number[],
                total: number = 0;

            this.vectors.forEach(item => total = total < item.length ? item.length : total);

            for (var i: number = 0; i < total; i++) {
                call = [];
                for (var j: number = 0; j < this.vectors.length; j++) {
                    call[j] = this.vectors[j][i];
                }
                result[i] = func.apply(null, call);
            }

            result.length = total;
            return result;
        }

        dot(): number {
            return this.to((a, b) => a * b).reduce((a, b) => a + b);
        }

        cross(): IVector {
            return from(
                this.vectors[0][1] * this.vectors[1][2] - this.vectors[0][2] * this.vectors[1][1],
                this.vectors[0][2] * this.vectors[1][0] - this.vectors[0][0] * this.vectors[1][2],
                this.vectors[0][0] * this.vectors[1][1] - this.vectors[0][1] * this.vectors[1][0]
            );
        }

        distance(): number {
            return this.to((v1, v2) => v1 - v2).size;
        }
    }

    /*----------------*
     *   interfaces   *
     *----------------*/

    interface IFunction extends Function {
        (v: number, ...rest: number[]): number;
    }

    interface IArray extends Array<number> { }

    interface IVectorOperators {
        to: (func: IFunction) => IVector;
    }

    export interface IVector extends IArray, IVectorOperators {
        x: number;
        y: number;
        z: number;
        inverse: IVector;
        size: number;
        unit: IVector;
    }

    interface IPairOperators extends IVectorOperators {
        dot: () => number;
        cross: () => IVector;
        distance: () => number;
    }
}