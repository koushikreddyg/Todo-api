var express=require('express');
var bodyParser=require('body-parser');
var {ObjectID}=require('mongodb');
var {mongoose}=require('./db/mongoose')
var {User}=require('./models/user');
var {Todo}=require('./models/todo');

var app=express();
const port = process.env.PORT||3000;
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
