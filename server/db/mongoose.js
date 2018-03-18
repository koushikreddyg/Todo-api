var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
if(process.env.NODE_ENV==='production'){
  mongoose.connect('mongodb://koushik:password@ds211029.mlab.com:11029/practicemongo')
}else{
  mongoose.connect('mongodb://localhost:27017/TodoApp');
}

module.exports={mongoose};
