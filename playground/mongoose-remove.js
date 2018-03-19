const {ObjectID}=require('mongodb');
const {mongoose}=require('../server/db/mongoose');
const {Todo}=require('../server/models/todo');
const {User}=require('../server/models/user');
// Todo.remove({}).then((result)=>{
//   console.log(result)
// },(e)=>{
//   console.log(e);
// })
// Todo.findByIdAndRemove('5aaefa7015fc7afac65583a7').then((todos)=>{
//   console.log(todos);
// })
Todo.findOneAndRemove({_id: '5aaefc1e15fc7afac65583c5'}).then((todos)=>{
  console.log(todos);
})
//Todo.findOneAndRemove()
