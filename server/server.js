var express=require('express');
var bodyParser=require('body-parser');
var {ObjectID}=require('mongodb');
var {mongoose}=require('./db/mongoose')
var {User}=require('./models/user');
var {Todo}=require('./models/todo');

var app=express();
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
      return res.status(404).send('user is not found')
    }
    res.send({todos})
}).catch((e)=>{
  res.status(404).send('id not found')
})

})
app.listen(3000,()=>{
  console.log('Started on port 3000')
})
module.exports={app};
