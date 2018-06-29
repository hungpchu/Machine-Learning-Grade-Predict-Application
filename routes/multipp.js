// read file
var express = require('express');
var router = express.Router();


// ấn vào grade generation step(1) -> POST /api/multipp/properties
router.post('/properties', function(req, res) {

// initialize uint8ToString
	var uint8ToString = function(data) {

		
		console.log(" uint8ToString = " + String.fromCharCode.apply(null, data));

		return String.fromCharCode.apply(null, data);
	};


	var fs = require('fs');

	function readProperties(callback) {

		console.log(" req.body.filename la userinfo trong multipp= " + req.body.filename);
	
		//  1a/ read from file temp/UserInfo.txt
		fs.readFile("temp/" + req.body.filename + ".txt", function(err, data) {

			// 1b/ req.body.filename = UserInfo
			if (err)
				return console.log(err);
			
			// -> store Full Name, .. from UserInfo.txt to data
			callback(uint8ToString(data));
		});
	}


	// read data from UserInfo.txt
	readProperties(function(data) {
	


		// initialize var wrapObj
		//1/ store data vao list cua object wrapObj = Full Name, ... 
		var wrapObj = {
			// list la danh sách cho data vào 
			list: data.trim().split(",")
			
		};

		console.log(" wrapObj = ");
		console.log(wrapObj);


		res.json(wrapObj);
	});
});

// router để đọc file 
module.exports = router;
