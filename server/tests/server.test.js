const request=require('supertest');
const expect=require('expect');
const {ObjectID}=require('mongodb');
const {app}=require('../server');
const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');
const {todos, populateTodos, users, populateUsers}=require('./seed/seed');
beforeEach(populateUsers);
beforeEach(populateTodos);
describe('Post /todos',()=>{
  it('should create new todo',(done)=>{
    const text= 'test Todo text';
      request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
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
    .set('x-auth',users[0].tokens[0].token)
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
    .set('x-auth',users[0].tokens[0].token)
    .expect((res)=>{
      expect(res.body.result.length).toBe(1);
    }).end(done)
  })
})
describe('get todo of particular id',()=>{
  it('should get todo',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.text).toBe('first text')
    })
    .end(done)
  })
  it('should not return todo docs created by another user',(done)=>{
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(402)
    .end(done)
  })
  it('should not return todo docs created by another user',(done)=>{
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(402)
    .end(done)
  })
  it('should return 404 if id is invalid',(done)=>{
    request(app)
    .get(`/todos/1234`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
})

describe('testing DELETE /todos',()=>{
  it('Should delete todo',(done)=>{
    request(app)
    .delete(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos._id).toBe(todos[1]._id.toHexString())
    })
    .end((err,result)=>{
      if(err){
        return done(err)
      }
      Todo.findById(todos[1]._id.toHexString()).then((res)=>{
        expect(res).toBeFalsy();
        done()
      },(e)=>{
        done(e)
      })
    })
  })
  it('Should delete todo',(done)=>{
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(404)
    .end((err,result)=>{
      if(err){
        return done(err)
      }
      Todo.findById(todos[0]._id.toHexString()).then((res)=>{
        expect(res).toExist();
        done()
      },(e)=>{
        done(e)
      })
    })
  })

  it('should not find todo',(done)=>{
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(404)
    .expect('Todo is not present')
    .end(done)
  })

  it('Should get invalid id',(done)=>{
    request(app)
    .delete(`/todos/1234`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(404)
    .expect('Id is invalid')
    .end(done)
  })
})

describe('test the patch method',()=>{
  it('Should update to Completed=false',(done)=>{
    let text='changed text of 2'
    request(app)
    .patch(`/todos/${todos[0]._id}`)
    .set('x-auth',users[0].tokens[0].token)
    .send({completed:false, text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.text).toBe(text);
      expect(res.body.todos.completed).toBe(false);
      expect(res.body.todos.completedAt).toNotExist()
    })
    .end(done)
  })

  it('Should not update todo created by another user',(done)=>{
    let text='changed text of 2'
    request(app)
    .patch(`/todos/${todos[0]._id}`)
    .set('x-auth',users[1].tokens[0].token)
    .send({completed:true, text})
    .expect(401)
    .end(done)
  })

  it('Should update completed=true',(done)=>{
    let text='changed text of 1'
    request(app)
    .patch(`/todos/${todos[1]._id}`)
    .set('x-auth',users[1].tokens[0].token)
    .send({completed:true, text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.text).toBe(text);
      expect(res.body.todos.completed).toBe(true);
      expect(res.body.todos.completedAt).toBeA('number')
    })
    .end(done)
  })
})
describe('GET /users/me',()=>{
  it('should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString())
      expect(res.body.email).toBe(users[0].email)
    })
    .end(done)
  })
  it('should return 401 if not authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    })
    .end(done)
  })
})
describe('POST /users',()=>{
  it('should create User ',(done)=>{
    var email='example@example.com';
    var password='password';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist()
      expect(res.body.email).toBe(email)
    })
    .end((err)=>{
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist()
        expect(user.password).toNotBe(password)
        done()
      }).catch(e=>{
        done(e)
      })
    })

  });
  it('should return validation errors if request is invalid',(done)=>{
    var email='kkfsbkd';
    var password='8787y';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done)
  });
  it('should not create user if email is in use',(done)=>{
    var email='koushik@email.com';
    var password='1233444';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done)
  })
})
describe('POSTS /users/login',()=>{
  it('should login user and return auth token',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist()
    })
    .end((err,res)=>{
      if(err){
        done(err)
      }
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[1]).toInclude({
          access:'auth',
          token:res.headers['x-auth']
        })
        done()
      }).catch((e)=>{
        done(e)
      })
    })
  })
  it('should reject invalid login',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password: users[0].password,
    })
    .expect(400)
    .expect(res=>{
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err,res)=>{
      if(err){
        done(err)
      }
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(1)
        done()
      }).catch(e=>{
        done(e)
      })
    })
  })
})
describe('DELETE users/me/token',()=>{
  it('should delete auth tokens in logout ',(done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err)
      }
      User.findById(users[0]._id).then((users)=>{
        expect(users.tokens.length).toBe(0);
        done()
      }).catch(e=>{
        done(e)
      })
    })
  })
})
