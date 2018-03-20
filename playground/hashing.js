const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
var data={
  id: 10
};
var token =jwt.sign(data,'123abc');
console.log(token)
var decoded=jwt.verify(token, '123abc');
console.log('decoded ', decoded)



// var message=`Iam user number 3`;
// var hash=SHA256(message).toString()
//
// console.log(`message is ${message}`);
// console.log(`crypt message is ${hash}`)
// var data={
//   id: 4,
// }
// var token={
//   data,
//   hash:SHA256(JSON.stringify(data)+ 'somesecret').toString()
// }
// // token.data.id=8;
// var hash=SHA256(JSON.stringify(data)+'somesecret').toString()
// if(token.hash===hash){
//   console.log('data is not changed')
// }else{
//   console.log('data is changed')
// }
