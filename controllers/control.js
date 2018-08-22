var bparser=require('body-parser');
var cookieParser=require('cookie-parser');
var session=require('express-session');



var Users=require("../models/todo-list");

module.exports=function(app){
	// var arr=[{item:'value1'},{item:'value2'},{item:'value3'}]

	app.use(bparser.urlencoded({extended:false})); 
	app.use(cookieParser());
	app.use(session({
		key: 'user_sid',
		secret: 'somerandonstuffs',
		resave: false,
		saveUninitialized: false,
		
	}));
	var sessionCheck=function(req,res,next){
		if(req.session.user && req.cookie.user_sid){
			res.redirect('/todo');
		}else{
			next();
		}
	};

	app.get('/signup',function(req,res){
		res.render("signup",{message:""});
	});
	app.post('/signup',sessionCheck,function(req,res){
		// console.log(req.body);
		var username=req.body.username;
		var password=req.body.password;
		var email=req.body.email;
		if(!username || !password || !email){
			res.render('signup',{message:"Fill in all the details"});
			
		}else{

			Users.findOne({username:username}).then(function(user){
				if(!user)
				{	var newUser={username:username,password:password,email:email};
					var new_user=new Users({username:username,password:password,email:email,todos:[]});
					new_user.save(function(err){
						console.log(err);
					});
					req.session.user=newUser;
					// console.log(req.session.user.username);
					res.redirect("/todo");
					
				}else{
					res.render("signup",{message:"Username is taken"});
				}
			});
		}

	});
	app.get("/login",function(req,res){
		res.render('login',{message:""});
	});
	app.post("/login",sessionCheck,function(req,res){
		var username=req.body.username;
		var password=req.body.password;
		 
		if(!username || !password){
			res.render("login",{message:"Incorrect information"});

		}else{
			Users.findOne({username:username,password:password}).then(function(user){
				if(!user){
					res.render("login",{message:"invalid credentials"});
				}else{
					req.session.user=user;
					// console.log(req.session.user);
					res.redirect("/todo");
				}
			});
		}
	});
	app.get("/logout",function(req,res){
		req.session.destroy(function(){
			console.log("logged-out");
		});
		res.redirect("/login");
	});

	app.get('/todo',function(req,res){
		// var arr=Todo.find({},function(err,value){
		// 	console.log(value);
		// 	res.render("todo",{todos:value});

		// // });
		console.log(req.session.user);
		var arr=Users.findOne({username:req.session.user.username,password:req.session.user.password}).then(function(user){
			
			res.render("todo",{todos:user.todos,user_id:user});
		});


	});
	app.post('/todo',function(req,res){
		// console.log(req.body);
		// var item=Todo(req.body).save(function(err,value){
		// 	res.json(value);

		// });
		console.log(req.body);
		var arr=Users.findOneAndUpdate({username:req.session.user.username,password:req.session.user.password},{$push:{todos:req.body}}).then(function(value){
			res.json(value);
		});


	}); 
	app.delete('/todo/:item',function(req,res){
		var arr=Users.findOneAndUpdate({username:req.session.user.username,password:req.session.user.passwword},{$pull:{todos:{item:req.params.item}}},function(err){
			console.log(err);
		});

		// Todo.deleteMany({item:req.params.item},function(err,value){
		// 	if(err) throw err;
		// });
		// data=arr.filter(function(todo){
		// 	console.log(todo.item.replace(/ /g,"-"));
		// 	return todo.item.replace(/ /g,"-") !== req.params.item;
		// });

		// res.json(arr);
		
		
	});
};
