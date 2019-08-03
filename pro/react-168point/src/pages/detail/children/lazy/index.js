import React, { Suspense, lazy } from "react";
// import { useFetch } from 'react-hooks-fetch';
const LazyComp = lazy(() => import("./LazyComp"));
 
// export default ()=>{
 
//     return (
//       <Suspense fallback={<div>loading....</div>}>
//         LazyComp
//         <SuspenseComp />
//         <LazyComp />
//       </Suspense>
//     );
  
// }
 
 
 

function promiseTask() {
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve("Data resolved");
    }, 3000);
  });
  return promise;
}

const cached = {};

function createFetch(promiseTask) {
  let ref = cached;
  return () => {
    const task = promiseTask();
    task.then(res => {
      ref = res;
    });

    if (ref === cached) {
      throw task;
    }

    return ref;
  };
}

const requestData=createFetch(promiseTask);

function SuspenseComp() {
  let data = requestData();
  return <span>RemoteData:{data}</span>;
}



export default () => (
  <Suspense
    fallback={
      <div className="text-danger">
        loading<i />
      </div>
    }
  >
    <SuspenseComp />
    <LazyComp />
  </Suspense>
);
