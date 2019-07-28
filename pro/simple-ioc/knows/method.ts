// function f() {
//     console.log("f(): evaluated");
//     return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log("f(): called");
//     }
// }

// function g() {
//     console.log("g(): evaluated");
//     return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log("g(): called");
//     }
// }

// class C {
//     @f()
//     @g()
//     method() {}
// }

function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
        console.log(target,propertyKey,descriptor)
    };
}

class Greeter2 {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }
}
 