const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');
const {Todo}=require('../../models/todo');
const {User}=require('../../models/user');
const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const users=[{
  _id:userOneId,
  email:'koushik@email.com',
  password: 'userOnePass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
},{
  _id:userTwoId,
  email:'karthik@email.com',
  password: 'userTwoPass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
  }]
}]
const todos=[{
  _id: new ObjectID(),
  text: 'first text',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'Second text',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}
]
const populateTodos=(done)=>{
  Todo.remove({}).then(()=> Todo.insertMany(todos)
  ).then(()=>{
    return done()
  })
}
const populateUsers=(done)=>{
  User.remove({}).then(()=>{
    var userOne=new User(users[0]).save();
    var userTwo=new User(users[1]).save();
    return Promise.all([userOne,userTwo]).then(()=>done())
  })
}
module.exports={todos,populateTodos, users, populateUsers};
