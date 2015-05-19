module Vector {
    /*----------------*
     * implementation *
     *----------------*/

    export var precision = 1e-6;

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

        add(x: number, y: number, ...rest: number[]): IVector;
        add(vector: IArray): IVector;
        add(...rest: any[]): IVector {
            return this.with(rest.length == 1 ? rest[0] : rest).as((v1, v2) => v1 + v2);
        }

        to(x: number, y: number, ...rest: number[]): IVector;
        to(vector: IArray): IVector;
        to(...rest: any[]): IVector {
            return this.with(rest.length == 1 ? rest[0] : rest).as((v1, v2) => v2 - v1);
        }

        with(x: number, y: number, ...rest: number[]): IVectorContainer;
        with(vector: IArray): IVectorContainer;
        with(...rest: any[]): IVectorContainer {
            return new VectorContainer(this, rest.length == 1 ? rest[0] : rest);
        }

        inverse(): IVector { return this.as(a => a * -1); }
        unit(): IVector { return this.size.of(1); }

        angle: IAngle = Angle.call(this);
        cross: ICross = Cross.call(this);
        dot: IDot = Dot.call(this);
        reflect: IReflect = Reflect.call(this);
        size: ISize = Size.call(this);
        project: IProject = Project.call(this);
    }

    function Angle(): IAngle {
        return {
            with: (...rest: any[]): number => {
                var vector = from(rest.length == 1 ? rest[0] : rest);
                return this.dot.with(vector) / (this.size() * vector.size());
            }
        }
    }

    function Cross(): ICross {
        return {
            with: (...rest: any[]): IVector => {
                var vector = rest.length == 1 ? rest[0] : rest;
                return from(
                    this[1] * vector[2] - this[2] * vector[1],
                    this[2] * vector[0] - this[0] * vector[2],
                    this[0] * vector[1] - this[1] * vector[0]
                );
            }
        }
    }

    function Dot(): IDot {
        return {
            with: (...rest: any[]): number => {
                return this.with(rest.length == 1 ? rest[0] : rest).as((a, b) => a * b).reduce((a, b) => a + b);
            }
        }
    }

    function Project(): IProject {
        return {
            along: (...rest: any[]): IVector => {
                var unit = from(rest.length == 1 ? rest[0] : rest).unit();
                return unit.size.of(this.dot.with(unit));
            },
            plane: (...rest: any[]): IVector => {
                return this.project.along(rest.length == 1 ? rest[0] : rest).to(this);
            }
        }
    }

    function Reflect(): IReflect {
        return {
            across: (...rest: any[]): IVector => {
                var vector = from(rest.length == 1 ? rest[0] : rest).unit();
                vector = vector.size.of(2 * vector.dot.with(this));
                return vector.to(this);
            }
        }
    }

    function Size(): ISize {
        var object: any = (): number => { return Math.sqrt(this.dot.with(this)); }
        object.of = (length: number): IVector => {
            var ratio = length / this.size();
            return this.as(a => a * ratio);
        }
        object.by = (factor: number): IVector => {
            return this.as(a => a * factor);
        }
        object.at = {
            most: (length: number): IVector => {
                return this.size() <= length ? this : this.size.of(length);
            },
            least: (length: number): IVector => {
                return this.size() >= length ? this : this.size.of(length);
            }
        }
        return object;
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

        with(x: number, y: number, ...rest: number[]): IVectorContainer;
        with(vector: IArray): IVectorContainer;
        with(...rest: any[]): IVectorContainer {
            this.vectors.push(rest.length == 1 ? rest[1] : rest);
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
        add: IAdd;
        angle: IAngle;
        as: IAs;
        cross: ICross;
        dot: IDot;
        inverse: IInverse;
        project: IProject;
        reflect: IReflect;
        to: ITo;
        size: ISize;
        unit: IUnit;
        with: IWith<IVectorContainer>;
    }

    interface IVectorContainer {
        as: IAs;
        with: IWith<IVectorContainer>;
    }

    interface IAs {
        (func: IFunction): IVector;
    }

    interface IAdd {
        (x: number, y: number, ...rest: number[]): IVector;
        (v: IArray): IVector;
    }

    interface IAngle {
        with: IWith<number>;
    }

    interface ICross {
        with: IWith<IVector>;
    }

    interface IDot {
        with: IWith<number>;
    }

    interface IInverse {
        (): IVector;
    }

    interface IReflect {
        across: IWith<IVector>;
    }

    interface IProject {
        along: IWith<IVector>;
        plane: IWith<IVector>;
    }

    interface ISize {
        (): number;
        of: (length: number) => IVector;
        by: (factor: number) => IVector;
        at: ISizeAt;
    }

    interface ISizeAt {
        most: (length: number) => IVector;
        least: (length: number) => IVector;
    }

    interface ITo {
        (x: number, y: number, ...rest: number[]): IVector;
        (v: IArray): IVector;
    }

    interface IUnit {
        (): IVector;
    }

    interface IWith<T> {
        (x: number, y: number, ...rest: number[]): T;
        (v: IArray): T;
    }
}