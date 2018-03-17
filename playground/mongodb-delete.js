const {MongoClient, ObjectID}=require('mongodb');
// var obj=new ObjectID();
// console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to mongodb');
  }
  console.log('mongodb connection successful')
  // db.collection('Users').findOneAndDelete({name: 'Koushik'},(err,result)=>{
  //   console.log(result);
  // })
  // db.collection('Users').deleteMany({name: 'Koushik'}).then(res=>{
  //   console.log(res)
  // })
  // db.collection('Users').findOneAndDelete({name:'Reddy'}).then(res=>{
  //   console.log(res)
  // })
  db.collection('Users').findOneAndDelete({_id:new ObjectID("5aad9221fffe28297935b92f")}).then(res=>{
    console.log(res);
  })
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result.result)
  // })
  // db.collection('Todos').deleteOne({text: 'Something new'}).then((result)=>{
  //   console.log(result.result)
  // },(err)=>{
  //   console.log(err);
  // })
  // db.collection('Todos').findOneAndDelete({completed:true}).then((res)=>{
  //   console.log(res)
  // })
  //db.close()
})
