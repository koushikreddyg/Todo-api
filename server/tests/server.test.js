const request=require('supertest');
const expect=require('expect');
const {ObjectID}=require('mongodb');
const {app}=require('../server');
const {Todo}=require('./../models/todo');
const todos=[{
  _id: new ObjectID(),
  text: 'first text'
},{
  _id: new ObjectID(),
  text: 'Second text'
}
]
beforeEach((done)=>{
  Todo.remove({}).then(()=> Todo.insertMany(todos)
  ).then(()=>{
    return done()
  })
})
describe('Post /todos',()=>{
  it('should create new todo',(done)=>{
    const text= 'test Todo text';
      request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text)
      })
      .end((err,res)=>{
        if(err){
          return done(err)
        }
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done()
        }).catch(e=>{
          done(e)
        })
      })
  })
  it('should not create test case',(done)=>{
    const text='test Todo text';
    request(app)
    .post('/todos')
    .send({})
    .expect(401)
    .expect((res)=>{
      expect(res.body.text).toBe(undefined);
    })
    .end((err,res)=>{
      if(err){
        return done(err)
      }
      Todo.find().then(res=>{
        expect(res.length).toBe(2);
        //expect(res[0].text).toBe(undefined)
        done()
      },(e)=>{
        done(e)
      })
    })
  })
})
describe('add Get TODO route',()=>{
  it('should fetch values',(done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.result.length).toBe(2);
    }).end(done)
  })
})
describe('get todo of particular id',()=>{
  it('should get todo',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.text).toBe('first text')
    })
    .end(done)
  })

  it('should return 402 if id is not found',(done)=>{
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(402)
    .end(done)
  })
  it('should return 404 if id is invalid',(done)=>{
    request(app)
    .get(`/todos/1234`)
    .expect(404)
    .end(done)
  })
})
