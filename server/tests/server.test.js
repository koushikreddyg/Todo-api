const request=require('supertest');
const expect=require('expect');
const {app}=require('../server');
const {Todo}=require('./../models/todo');
const todos=[{
  text: 'first text'
},{
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
