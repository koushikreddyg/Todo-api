const {ObjectID}=require('mongodb');
const {mongoose}=require('../server/db/mongoose');
const {Todo}=require('../server/models/todo');
const {User}=require('../server/models/user');
var id= '5aadb11db4468ce43198c36e';
User.findById(id).then((user)=>{
  if(!user){
    return console.log('user not found')
  }
  console.log(JSON.stringify(user,undefined,2))
},(e)=>{
  console.log('error is ',e)
})
// var id='5aae06ea589ea3d833911f2a11';
// if (!ObjectID.isValid(id)){
//   console.log('id is invalid')
// }
// Todo.find({_id:id}).then((todos)=>{
//   console.log('Todos ',todos)
// }).catch(e=>{
//   console.log(e)
// });
// Todo.findOne({_id:id}).then((todos)=>{
//   console.log('Todos ',todos)
// }).catch(e=>{
//   console.log(e)
// });
// Todo.findById(id).then((todos)=>{
//   console.log('Todo find by Id',todos)
// }).catch(e=>{
//   console.log(e)
// })
