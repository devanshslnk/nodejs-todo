var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/todoApp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});




var user_todo_schema=new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    todos:[
        {item:String}    
    ]
    
});
var Users=mongoose.model('Users',user_todo_schema);

module.exports=Users;
