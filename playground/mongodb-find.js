const {MongoClient, ObjectID}=require('mongodb');
// var obj=new ObjectID();
// console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to mongodb');
  }
  console.log('mongodb connection successful')
  db.collection('Users').find({name:'Koushik'}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs, undefined,2))
  },(err)=>{
    console.log(err)
  })
  // db.collection('Todos').find().count().then((count)=>{
  //   console.log(`Todos count: ${count}`);
  //   //console.log(JSON.stringify(docs,undefined,2))
  // },(err)=>{
  //   console.log('Unable to fetch documents ',err)
  // })
  // db.collection('Todos').find({_id:new ObjectID("5aad742ffffe28297935b271")}).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2))
  // },(err)=>{
  //   console.log('Unable to fetch documents ',err)
  // })
//  db.close()
})
