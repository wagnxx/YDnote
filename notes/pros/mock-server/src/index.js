// console.log(fetch);
console.log('src index page xxx');
// mock real req split
fetch('/list')
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  });
