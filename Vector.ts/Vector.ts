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

        add(other: number): IVector;
        add(other: IArray): IVector;
        add(other: any): IVector { return add(this).by(other); }

        subtract(other: number): IVector;
        subtract(other: IArray): IVector;
        subtract(other: any): IVector { return subtract(this).by(other); }

        multiply(other: number): IVector;
        multiply(other: IArray): IVector;
        multiply(other: any): IVector { return multiply(this).by(other); }

        divide(other: number): IVector;
        divide(other: IArray): IVector;
        divide(other: any): IVector { return divide(this).by(other); }
        invert(): IVector { return invert(this); }
        normalise(): IVector { return normalise(this); }
        dot(other: IArray): number { return dot(this).by(other); }
        cross(other: IArray): IVector { return cross(this).by(other); }
        magnitude(): number { return magnitude(this); }
        distance(other: IArray): number { return distance(this).to(other); }
    }

    export function from(vector: IArray): IVector;
    export function from(x: number, y: number): IVector;
    export function from(x: number, y: number, z: number): IVector;
    export function from(...rest: any[]) {
        return new Vector(rest[0] instanceof Array ? rest[0] : rest);
    }

    export function add(value: IArray): IArithmetic {
        return new Arithmetic(value, (a, b) => a + b);
    }

    export function subtract(value: IArray): IArithmetic {
        return new Arithmetic(value, (a, b) => a - b);
    }

    export function multiply(value: IArray): IArithmetic {
        return new Arithmetic(value, (a, b) => a * b);
    }

    export function divide(value: IArray): IArithmetic {
        return new Arithmetic(value, (a, b) => a / b);
    }

    export function invert(value: IArray): IVector {
        return multiply(value).by(-1);
    }

    export function normalise(value: IArray): IVector {
        return divide(value).by(magnitude(value));
    }

    export function magnitude(value: IArray): number {
        return Math.sqrt(dot(value).by(value));
    }

    export function distance(value: IArray): IDistance {
        return { to: (other: IArray): number => magnitude(subtract(value).by(other)) };
    }

    export function dot(value: IArray): IDot {
        return new Dot(value);
    }

    export function cross(value: IArray): ICross {
        return new Cross(value);
    }

    class Dot implements IDot {
        source: IArray;

        constructor(source: IArray) {
            this.source = source;
        }

        by(other: IArray): number {
            var result: IArray = [];
            for (var index = 0; index < this.source.length; index++) {
                result[index] = this.source[index] * other[index];
            }
            result.length = this.source.length;
            return result.reduce((a, b) => a + b);
        }
    }

    class Cross implements ICross {
        source: IArray;

        constructor(source: IArray) {
            this.source = source;
        }

        by(other: IArray): IVector {
            return from(
                this.source[1] * other[2] - this.source[2] * other[1],
                this.source[2] * other[0] - this.source[0] * other[2],
                this.source[0] * other[1] - this.source[1] * other[0]
            );
        }
    }

    class Arithmetic implements IArithmetic {
        source: IArray;
        func: Function;

        constructor(source: IArray, func: IAction) {
            this.func = func;
            this.source = source;
        }
        
        by(other: number): IVector;
        by(other: IArray): IVector;
        by(other: any): IVector {
            var result: IVector = new Vector();
            for (var index = 0; index < this.source.length; index++) {
                result[index] = this.func(this.source[index], other instanceof Array ? other[index] : other);
            }
            result.length = this.source.length;
            return result;
        }
    }


    /*----------------*
     *   interfaces   *
     *----------------*/

    interface IArray extends Array<number> { }

    export interface IVector extends IArray {
        x: number;
        y: number;
        z: number;

        add(other: IArray): IVector;
        add(other: number): IVector;
        subtract(other: IArray): IVector;
        subtract(other: number): IVector;
        multiply(other: IArray): IVector;
        multiply(other: number): IVector;
        divide(other: IArray): IVector;
        divide(other: number): IVector;
        invert(): IVector;
        normalise(): IVector;
        dot(other: IArray): number;
        cross(other: IArray): IVector;
        magnitude(): number;
        distance(other: IArray): number;
    }

    interface IArithmetic {
        by: IArithmeticBy;
    }

    interface IArithmeticBy {
        (other: number): IVector;
        (other: IArray): IVector;
    }

    interface IDot {
        by: IDotBy;
    }

    interface IDotBy {
        (other: IArray): number;
    }

    interface ICross {
        by: ICrossBy;
    }

    interface ICrossBy {
        (other: IArray): IVector;
    }

    interface IAction {
        (a: number, b: number): number;
    }

    interface IDistance {
        to: IDistanceTo;
    }

    interface IDistanceTo {
        (other: IArray): number;
    }
}