require('./config/config');
const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');
const {mongoose}=require('./db/mongoose')
const {User}=require('./models/user');
const {Todo}=require('./models/todo');
const bcrypt=require('bcryptjs');
var {authenticate}=require('./middleware/authenticate');

var app=express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.post('/todos',authenticate, (req,res)=>{
  var todo= new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then((doc)=>{
    res.send(doc)
  },(e)=>{
    res.status(401).send(e);
  })
})
app.delete('/users/me/token',authenticate,(req,res)=>{
req.user.removeToken(req.token).then(()=>{
  res.status(200).send()
},()=>{
  res.status(400).send()
})
})
app.get(`/users/me`,authenticate, (req,res)=>{
  res.send(req.user)
})

app.get('/todos',authenticate,(req,res)=>{
  Todo.find({_creator:req.user._id}).then(result=>{
    res.status(200).send({result})
  },(e)=>{
    res.status(401).send(e);
  })
})
app.get('/todos/:id',authenticate,(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('id is invalid')
          }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todos)=>{
    if(!todos){
      return res.status(402).send('user is not found')
    }
    res.send({todos})
}).catch((e)=>{
  res.status(401).send('id not found')
})

})

app.patch(`/todos/:id`,authenticate, (req,res)=>{
  var id=req.params.id;
  var body=_.pick(req.body,['text', 'completed'])
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Id is invalid');
  }
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt=new Date().getTime();
  }
  else{
    body.completed=false;
    body.completedAt=null
  }
  Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todos)=>{
    if(!todos){
      return res.status(401).send()
    }
    res.send({todos})
  }).catch(e=>{
    res.status(400).send()
  })
})

app.delete('/todos/:id',authenticate,(req,res)=>{
  const id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Id is invalid')
  }
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todos)=>{
    if(!todos){
      return res.status(404).send('Todo is not present');
    }
    res.send({todos})
  }).catch(e=>{
    res.status(400).send(e)
  })
})
app.post('/users/login',(req,res)=>{
  var body=_.pick(req.body,['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user)=>{
return user.generateAuthToken().then((token)=>{
  res.header('x-auth',token).send(user);
})
  }).catch((e)=>{
    res.status(400).send(e)
  })
  // User.findOne({email:req.body.email}).then((user)=>{
  //
  // })
})
app.post(`/users`,(req,res)=>{
  const body=_.pick(req.body,['email', 'password'])
  var user=new User(body)
  user.save().then((user)=>{
    return user.generateAuthToken()
    //res.send(user)
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e)
  })
})
app.listen(port,()=>{
  console.log(`Started on port ${port}`)
})
module.exports={app};
