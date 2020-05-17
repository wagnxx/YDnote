## 元编程小例子

这一块相对简单,网上例子也很多,这里就只把一些简单的例子存放一下:

```js

    var obj = {
  x: 99,
  get baz() {
    return this.x + 'baz';
  },
  set bar(val) {
    return (this.x = val);
  },
};

if (
  Reflect.defineProperty(obj, 'a', {
    get() {
      return this.x + 'get所得值';
    },
  })
) {
  console.log(obj);
} else {
  console.log('define faild');
}

// assign in Object ,
if (Reflect.has(obj, 'x')) {
  console.log('obj对象中有x这个属性');
}

// get
let receiveObj = {
  x: 1001,
};
console.log(Reflect.get(obj, 'x'));
console.log(Reflect.get(obj, 'baz', receiveObj));

// set
Reflect.set(obj, 'bar', 88, receiveObj);

// construct
function Greeting(name) {
  this.name = name;
}
const instance = Reflect.construct(Greeting, ['张三']);

Reflect.getPrototypeOf(instance) == instance.__proto__;
Object.getPrototypeOf(1); // Number {[[PrimitiveValue]]: 0}
// Reflect.getPrototypeOf(1); // 报错

// Reflect.ownKeys (target)
// Reflect.ownKeys方法用于返回对象的所有属性，
//基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。

console.log('=================== Proxy ===========================');
let p = {
  a: 'a',
};
let handler = {
  set(target, key, value, receiver) {
    console.log('set');
    console.log('receiver', receiver);
    Reflect.set(target, key, value);
  },
  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  },
};

let o = new Proxy(p, handler);

const queueObservers = new Set();
const observe = (fn) => queueObservers.add(fn);
const observale = (obj) => new Proxy(obj, { set });

function set(target, key, value, receiver) {
  // set ...
  const result = Reflect.set(target, key, value, receiver);
  queueObservers.forEach((observer) => observer());
  return result;
}

let obj2 = new Proxy(
  {},
  {
    get(target, propkey, receiver) {
      return Reflect.get(target, propkey, receiver);
    },
    set(target, propkey, value, receiver) {
      return Reflect.set(target, propkey, value, receiver);
    },
  }
);

// set 方法实际上是重载了点运算符
// let proxy = new Proxy(target,handler);
// new Proxy 表示一个proxy实例
// target表示索要拦截的目标对象
// handle 也是一个对象,表示拦截的行为

let ori = new Proxy(
  {},
  {
    get() {
      return 733;
    },
  }
);

let oInstance = Object.create(ori);

// 综合

var ox = {
  [Symbol.toPrimitive]: ((i) => () => ++i)(0),
};

function Tree() {
  
  const handler = {
    get(target, key, receiver) {
      if (!(key in target)) {
        target[key] = Tree();
      }
      return Reflect.get(target, key, receiver);
    },
  };
  return new Proxy({}, handler);
}

let tree = new Tree();
tree.yd.stutent = 'helo';


```