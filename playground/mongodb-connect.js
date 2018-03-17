const {MongoClient, ObjectID}=require('mongodb');
// var obj=new ObjectID();
// console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to mongodb');
  }
  console.log('mongodb connection successful')
  // db.collection('Users').insertOne({
  //   name:'Koushik',
  //   age: 24,
  //   location: "Newark"
  // },(err,result)=>{
  //   if(err){
  //     console.log('unable to connect', err)
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
  // })
//   db.collection('Todos').insertOne({
//   text:'Something new',
//   completed:false,
// },(err,result)=>{
//   if(err){
//     return console.log('unable to insert todos ', err);
//   }
//   console.log(JSON.stringify(result.ops, undefined, 2))
// })
  db.close()
})
