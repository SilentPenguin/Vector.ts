/// <reference path="../vector.ts/vector.ts" />
/// <reference path="../../test.ts/test.ts/assert.ts" />
/// <reference path="../../test.ts/test.ts/report.ts" />
/// <reference path="../../test.ts/test.ts/test.ts" />

class VectorTests extends Test.Set {
    properties: Test.IContainer = new Properties;
    arithmatic: Test.IContainer = new Arithmatic;
    products: Test.IContainer = new Products;
}

class Properties extends Test.Case {
    v: Vector.IVector;

    before() {
        this.v = Vector.from(1, 2, 3);
    }

    @test
    Create() {
        var expect = [1, 2, 3];
        Assert.that(this.v.length).is.equal.to(3);
        Assert.that.all(this.v).are.match.test((item, index) => item == expect[index]);
    }
    
    @test
    Inverse() {
        var result = this.v.inverse(),
            expect = [-1, -2, -3];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }
    
    @test
    Size() {
        var result = this.v.size(),
            expect = Math.sqrt(14);
        Assert.that(result).is.equal.to(expect);
    }

    @test
    Unit() {
        var result = this.v.size.of(1),
            expect = [1 / Math.sqrt(14), 2 / Math.sqrt(14), 3 / Math.sqrt(14)];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);

        result = this.v.unit(),
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }

    @test
    Resize() {
        var result = this.v.size.of(4),
            expect = [2, 4, 6];
        Assert.that(result.size()).is.exact.to(4);

        result = Vector.from(this.v).size.of(4).size.at.most(3);
        expect = [2, 4, 6];
        Assert.that(result.size()).is.exact.to(3);

        result = this.v.size.by(2);
        expect = [2, 4, 6];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }
}

class Arithmatic extends Test.Case {
    v1: number[];
    v2: number[];

    before() {
        this.v1 = [1, 2, 3];
        this.v2 = [3, 2, 1];
    }

    @test
    Add() {
        var result = Vector.from(this.v1).with(this.v2).as((v1, v2) => v1 + v2);
        Assert.that.all(result).are.equal.to(4);
    }

    @test
    Move() {
        var result = Vector.from(this.v1).add(this.v2);
        Assert.that.all(result).are.equal.to(4);
    }

    @test
    Subtract() {
        var result = Vector.from(this.v1).with(this.v2).as((v1, v2) => v1 - v2),
            expect = [-2, 0, 2];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }

    @test
    Between() {
        var result = Vector.from(this.v2).to(this.v1),
            expect = [-2, 0, 2];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }

    @test
    Multiply() {
        var result = Vector.from(this.v1).with(this.v2).as((v1, v2) => v1 * v2),
            expect = [3, 4, 3];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }

    @test
    Divide() {
        var result = Vector.from(this.v1).with(this.v2).as((v1, v2) => v1 / v2),
            expect = [1 / 3, 1, 3];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }
}

class Products extends Test.Case {
    v1: number[];
    v2: number[];

    before() {
        this.v1 = Vector.from(1, 2, 3);
        this.v2 = [3, 2, 1];
    }

    @test
    Dot() {
        var result = Vector.from(this.v1).dot.with(this.v2),
            expect = 10;

        Assert.that(result).is.equal.to(expect);
    }

    @test
    Cross() {
        var result = Vector.from(this.v1).cross.with(this.v2),
            expect = [-4, 8, -4];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }

    @test
    ProjectVector() {
        var result = Vector.from(this.v1).project.along(this.v2),
            expect = [15/7, 10/7, 5/7];
        Assert.that.all(result).are.match.test((item, index) => Math.abs(item - expect[index]) < Vector.precision);
    }

    @test
    ProjectPlane() {
        var result = Vector.from(this.v1).project.plane(this.v2),
            expect = Vector.from([15 / 7, 10 / 7, 5 / 7]).to(this.v1);
        Assert.that.all(result).are.match.test((item, index) => Math.abs(item - expect[index]) < Vector.precision);
    }
    
    @test
    Distance() {
        var result = Vector.from(this.v1).to(this.v2).size(),
            expect = 2 * Math.sqrt(2);
        Assert.that(result).is.equal.to(expect);
    }

    @test
    Angle() {
        var result = Vector.from(this.v1).angle.with(this.v2),
            expect = 5 / 7;
        Assert.that(result).is.equal.to(expect);
    }

    @test
    Reflect() {
        this.v2 = Vector.from(this.v2).unit();
        var result = Vector.from(this.v1).reflect.across(this.v2),
            dot = Vector.from(this.v1).dot.with(this.v2),
            expect = Vector.from(this.v1).with(this.v2).as((v1, v2) => v1 - 2 * dot * v2);
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);
    }

    @test
    Interpolate() {
        var result = Vector.from(this.v1).interpolate.to(this.v2).at(0.5),
            expect = [2, 2, 2];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);

        result = Vector.from(this.v1).interpolate.to(this.v2).start(1).end(3).at(2);
        expect = [2, 2, 2];
        Assert.that.all(result).are.match.test((item, index) => item == expect[index]);

        result = Vector.from(this.v1).interpolate.to(this.v2).by(1);
        result = Vector.from(this.v1).to(result);
        Assert.that(result.size()).is.match.test((item) => Math.abs(1 - item) < Vector.precision);
    }
}

window.onload = () => {
    document.getElementById('content').innerHTML = new Report.Html(new VectorTests).run();
};