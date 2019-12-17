const onepipe = require('./lib/index');
// console.table(onepipe.headers)
onepipe.config("Api Key","Secret key")
// console.table(onepipe.headers)


// onepipe.query("98484790134660")
// .then(res=>{
//     console.log(res)
// })
// .catch(err=>{
//     console.log(err)
// })

// onepipe.charge()
// .then(res=>{
//     console.log(res.data)
// })
// .catch(err=>{
//     console.log(err)
// })
onepipe.charge()
.then(res=>{
    console.log(res.data)
})
.catch(err=>{
    console.log(err)
})