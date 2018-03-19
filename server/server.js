require('./config/config');
const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');
const {mongoose}=require('./db/mongoose')
const {User}=require('./models/user');
const {Todo}=require('./models/todo');

var app=express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var todo= new Todo({
    text: req.body.text
  })
  todo.save().then((doc)=>{
    res.send(doc)
  },(e)=>{
    res.status(401).send(e);
  })
})

app.get('/todos',(req,res)=>{
  Todo.find().then(result=>{
    res.status(200).send({result})
  },(e)=>{
    res.status(401).send(e);
  })
})
app.get('/todos/:id',(req,res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('id is invalid')
          }
  Todo.findById(id).then((todos)=>{
    if(!todos){
      return res.status(402).send('user is not found')
    }
    res.send({todos})
}).catch((e)=>{
  res.status(401).send('id not found')
})

})

app.patch(`/todos/:id`,(req,res)=>{
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
  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todos)=>{
    if(!todos){
      return res.status(401).send()
    }
    res.send({todos})
  }).catch(e=>{
    res.status(400).send()
  })
})

app.delete('/todos/:id',(req,res)=>{
  const id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Id is invalid')
  }
  Todo.findByIdAndRemove(id).then((todos)=>{
    if(!todos){
      return res.status(404).send('Todo is not present');
    }
    res.send({todos})
  }).catch(e=>{
    res.status(400).send(e)
  })
})

app.listen(port,()=>{
  console.log(`Started on port ${port}`)
})
module.exports={app};
