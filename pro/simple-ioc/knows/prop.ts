import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
    console.log(formatString)
    return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any) {
    console.log( Reflect.getMetadata(formatMetadataKey, target))
    return Reflect.getMetadata(formatMetadataKey, target);
}

class Greeter {
    @format("Hello, %s")
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        let formatString = getFormat(this);
        console.log(formatString)
        // return formatString.replace("%s", this.greeting);
    }
}
(new Greeter('wxx')).greet()