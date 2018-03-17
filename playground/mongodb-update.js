const {MongoClient, ObjectID}=require('mongodb');
// var obj=new ObjectID();
// console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to mongodb');
  }
  console.log('mongodb connection successful')
  db.collection('Users').findOneAndUpdate({
    _id:new ObjectID('5aad6ceec7a0700188c92545')
  },{
    $set:{name: "koushik"},
    $inc: {age:2}
  },{
    returnOriginal: false
  }).then(res=>{
    console.log(res);
  })
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5aad87c7fffe28297935b61b")
  // },{
  //   $set:{completed:true}
  // },{
  //   returnOriginal: false
  // }).then(res=>{
  //   console.log(res)
  // })
  //db.close()
})
