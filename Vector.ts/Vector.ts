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

    export function from(x: number, y: number, ...rest: number[]): IVector;
    export function from(vector: IArray): IVector;
    export function from(...rest: any[]): IVector {
        return new Vector(rest.length == 1 ? rest[0] : rest);
    }

    class Vector extends Collection<number> implements IVector {
        get x(): number { return this[0]; }
        get y(): number { return this[1]; }
        get z(): number { return this[2]; }
        get w(): number { return this[3]; }
        set x(val: number) { this[0] = val; }
        set y(val: number) { this[1] = val; }
        set z(val: number) { this[2] = val; }
        set w(val: number) { this[3] = val; }

        as(func: IFunction): IVector {
            var result: IVector = new Vector;

            for (var i: number = 0; i < this.length; i++) {
                result[i] = func.call(null, this[i]);
            }

            result.length = this.length;
            return result;
        }

        add(vector: IArray): IVector {
            return this.with(vector).as((v1, v2) => v1 + v2);
        }

        to(vector: IArray): IVector {
            return this.with(vector).as((v1, v2) => v2 - v1);
        }

        with(vector: IArray): IVectorContainer {
            return new VectorContainer(this, vector);
        }

        inverse(): IVector {
            return this.as(a => a * -1);
        }

        unit(): IVector {
            return this.size.of(1);
        }

        cross: ICross = Cross.call(this);
        dot: IDot = Dot.call(this);
        size: ISize = Size.call(this);
        project: IProject = Project.call(this);
    }

    function Dot(): IDot {
        return {
            with: (vector: IArray): number => {
                return this.with(vector).as((a, b) => a * b).reduce((a, b) => a + b);
            }
        }
    }

    function Cross(): ICross {
        return {
            with: (vector: IArray): IVector => {
                return from(
                    this[1] * vector[2] - this[2] * vector[1],
                    this[2] * vector[0] - this[0] * vector[2],
                    this[0] * vector[1] - this[1] * vector[0]
                );
            }
        }
    }

    function Size(): ISize {
        var object: any = (): number => { return Math.sqrt(this.dot.with(this)); }
        object.of = (length: number): IVector => {
            var ratio = length / this.size();
            return this.as(a => a * ratio);
        }
        return object;
    }

    function Project(): IProject {
        return {
            along: (vector: IArray): IVector => {
                var unit = from(vector).unit();
                return unit.size.of(this.dot.with(unit));
            },
            plane: (vector: IArray): IVector => {
                return this.project.along(vector).to(this);
            }
        }
    }

    class VectorContainer implements IVectorContainer {
        vectors: IArray[];

        constructor(...vectors: IArray[]) {
            this.vectors = vectors;
        }

        as(func: IFunction): IVector {
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

        with(vector: IArray): IVectorContainer {
            this.vectors.push(vector);
            return this;
        }
    }

    /*----------------*
     *   interfaces   *
     *----------------*/

    interface IFunction extends Function {
        (v: number, ...rest: number[]): number;
    }

    interface IArray extends Array<number> { }

    export interface IVector extends IArray {
        x: number;
        y: number;
        z: number;
        as: IAs;
        add: IAdd;
        to: ITo;
        with: IWith;
        cross: ICross;
        dot: IDot;
        size: ISize;
        unit: IUnit;
        inverse: IInverse;
        project: IProject;
    }

    interface IVectorContainer {
        as: IAs;
        with: IWith;
    }

    interface IAs {
        (func: IFunction): IVector;
    }

    interface IAdd {
        (v: IArray): IVector;
    }

    interface ITo {
        (v: IArray): IVector;
    }

    interface IWith {
        (v: IArray): IVectorContainer;
    }

    interface IDot {
        with: (v: IArray) => number;
    }

    interface ICross {
        with: (v: IArray) => IVector;
    }

    interface ISize {
        (): number;
        of: (length: number) => IVector;
    }

    interface IUnit {
        (): IVector;
    }

    interface IInverse {
        (): IVector;
    }

    interface IProject {
        along: (vector: IArray) => IVector;
        plane: (vector: IArray) => IVector;
    }
}