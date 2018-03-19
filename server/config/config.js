var env=process.env.NODE_ENV || 'development';
console.log('env ***', env)
if(env==='production'){
  process.env.MONGODB_URI='mongodb://koushik:password@ds211029.mlab.com:11029/practicemongo';
}else if(env==='development'){
  process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp';
  process.env.PORT=3000;
} else if(env==='test'){
  process.env.MONGODB_URI='mongodb://localhost:27017/TodoAppTest';
  process.env.PORT=3000
}
