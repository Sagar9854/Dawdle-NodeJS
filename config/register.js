var crypto = require('crypto');
var rand = require('csprng');
var mongoose = require('mongoose');
var user = require('../models/modelsUser.js');

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.register = function(email,password,callback) {
	console.log("email : " + email);
	console.log("password : " + password);
	if(validateEmail(email)){
		var temp = rand(160, 36);
		var newpass = temp + password;
		var token = crypto.createHash('sha512').update(email +rand).digest("hex");
		var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");

		var newuser = new user({
			token: token,
			email: email,
			hashed_password: hashed_password,
			salt : temp });

		user.find({email: email}, function(err, users){
			var len = users.length;
			if(len == 0){
				newuser.save(function (err) {
					callback({'response':"Sucessfully Registered", 'accept':"true", 'exist':"false"});
				});
			}
			else{
				callback({'response':"Email already registered.", 'accept':"false", 'exist':"true"});
			}
		});

	}
	else{
		callback({'response':"Email Not Valid", 'accept':"false", 'exist':"false"});
	}
}