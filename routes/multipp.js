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
		
		// param.txt chỉ chứa đống data điểm nhỏ
		//  read from file temp/csce235.txt
		fs.readFile("temp/" + req.body.filename + ".txt", function(err, data) {

			// req.body.filename = csce235
			if (err)
				return console.log(err);
			
			// 
			callback(uint8ToString(data));
		});
	}

	// read data = string voi noi dung = Homework 1,Homework 2,Homework 3,Homework 4, blahh
	readProperties(function(data) {
	

		// initialize var wrapObj
		// store data vao list cua object wrapObj
		var wrapObj = {
			// list la danh sách cho data vào 
			list: data.trim().split(",")
			
		};

		/*
		 wrapObj = {
			 list: 
   			[ 	'Homework 1',
     			'Homework 2',
     			'Homework 3',
     			'Homework 4',
     			'Homework 5',
     			'Homework 6',
     			'Quiz 1',
     			'Quiz 2',
     			'Quiz 3',
     			'Quiz 4',
     			'Quiz 5',
     			'Quiz 6',
     			'Quiz 7',
     			'Quiz 8',
     			'Quiz 9',
     			'Quiz 10',
     			'Midterm',
     			'Final' ] }

	
		*/
		res.json(wrapObj);
	});
});

// router để đọc file 
module.exports = router;
