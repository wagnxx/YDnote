// configuration
// you must set database information with config() method.Available
// option are driver ,name,storeName,version,size and description

localforage.config({
  driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: 'myApp',
  version: 1.0,
  size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description: 'some description',
});

// Multiple instances
var store = localforage.createInstance({
  name: 'nameCat',
});
var otherStore = localforage.createInstance({
  name: 'nameOther',
});

// setting the key on one of these doesn't affect other
var otherdata ={
    time:'now',
    name:'you know',
    wall:false,
    smooth:true,
    income:1999*99934589
}
store.setItem('key', 'value-store-cat');
otherStore.setItem('key', otherdata);

var a = null;
function getAval() {
  //   store.getItem('key').then((val) => {
  //     a = val;
  //   });
  store.getItem('key', function (err,val) {
    a = val;
  });

  if (a == null) {
    requestAnimationFrame(getAval);
  } else {
    console.log(a);
  }
}

getAval();
