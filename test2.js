const async = require('async')// Defining The queue
main() 

async
    .parallel([
     async.reflect(async () => await Promise.resolve('Like')),
     async.reflect(async () => await Promise.resolve('Like2')),
     async.reflect( async () => await Promise.reject('dislike'))
    ])
.then(response => {
  console.log("reponse", response)
})
.catch(err => {
  console.log("I HAVE AN ERROR ", err)
})