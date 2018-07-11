var express = require('express');
var multer = require('multer');
var router = express.Router();


// store content of grade.csv at filr storage
const multerConfig = {
    storage: multer.diskStorage({
        destination: function(req, file, next) {
			console.log(" store at ./public/file-storage ")
            next(null, './public/file-storage');
        },   
        filename: function(req, file, next) {
			console.log("file = ");
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, 'grade.' + ext);
        }
    })
};

/*router.get('/', function(req, res) {
    var uint8ToString = function(data) {
        return String.fromCharCode.apply(null, data);
    };
	var wrapObj = {
		course: "",
		 params: ""
	};
	var fs = require("fs");
	function readCourse(callback) {
		fs.readFile("ml_scripts/models/recent-course.txt", function(err, data) {
			if (err) {
				return console.log(err);
			}
			callback(uint8ToString(data));
		});
	}
	function readParams(callback) {
	    fs.readFile("ml_scripts/models/params.txt", function(err, data) {
		    if (err) {
			    return console.log(err);
			} 
			callback(uint8ToString(data));
		});
	}
	readCourse(function(course) {
		wrapObj.course = course;
		readParams(function (params) {
			wrapObj.params = params;
			console.log(wrapObj);
			res.json(wrapObj);
		})
	})
});*/
/*
router.post('/recent', function(req, res) {
	var wrapObj = {
		course: req.body.course
	};
	fs = require('fs');
	fs.writeFile("ml_scripts/models/recent-course.txt", wrapObj.course, function(err) {
		if (err)
			return console.log(err);
		else {
			console.log("Course saved.");
		}
	});
});

router.get('/recent', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	fs = require('fs');
	function readCourse(callback) {
		fs.readFile("ml_scripts/models/recent-course.txt", function(err, data) {
			if (err)
				return console.log(err);
			callback(uint8ToString(data));
		});
	}
	readCourse(function(data) {
		var wrapObj = {
			course: data
		};
		res.json(wrapObj);
	});
});
*/

// ấn vào nút run ->  viet data ra grade.json
router.post('/', function(req, res) {

    var uint8ToString = function(data) {
        return String.fromCharCode.apply(null, data);
	};

	
	// tạo 1 object named wrapObj -> store data for each student 
    var wrapObj = {
		course: req.body.course,
		week: req.body.week,
		noOfModels: 0,
        params: "",
		grades: []
	};
	


	const spawn = require('child_process').spawn;
	// run python3 train_models.py csce235
	// press run = activate ml_scripts/train_models_new.py
	const ls = spawn('python3', ['ml_scripts/train_models_new.py', req.body.course]);

	console.log(" req.body.course = " + req.body.course );
	console.log(" req.body.week = " + req.body.week );

	// ls.stdout.on('data', (data) => {

	// 	//console.log(`stdout in train model: ${data}`);
	// });
	ls.stdout.on('data', (data) => {

		//console.log(`stdout in train model: ${data}`);
		// transform data from uint8 to string, temp tùy ý đổi tên 
		temp = uint8ToString(data).split(';');


		console.log(" uint8ToString(data) trong models =");
		console.log( uint8ToString(data));
		//console.log("temp = ");
		//console.log(temp);

		wrapObj.noOfModels = temp[0];
		// wrapObj.params = string with Homework 1,Homework 2,Homework 3, blahh
		wrapObj.params = temp[1];

		// wrapObj.grades = string with [{"SIS User ID":50018756.0,"SIS Login ID":"madamec2",
		wrapObj.grades = temp[2];
	
        var fs = require('fs');
/*		fs.writeFile("ml_scripts/models/recent-course.txt", wrapObj.course, function(err) {
			if (err) {
				return return console.log(err);
			} else {
				console.log("Course recorded.");
			}
		});*/


		//  viet ra file  ml_scripts/data/csce235/noOfModels.txt
		fs.writeFile("ml_scripts/models/" + wrapObj.course + "/noOfModels.txt", wrapObj.noOfModels, function(err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("#Models saved.");
            }
		});
		
		// viet ra file  ml_scripts/data/csce235/param.txt
        fs.writeFile("ml_scripts/models/" + wrapObj.course + "/params.txt", wrapObj.params, function(err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("Params saved.");
            }
		});
	
		// viet ra file ml_scripts/data/csce235/grade.json
		fs.writeFile("ml_scripts/data/" + wrapObj.course + "/grade.json", wrapObj.grades, function(err) {
			if (err) {
				return console.log(err);
			} else {
				console.log("Grade.json created.");
			}
		});
        //return res.json(wrapObj);
        return res.send('OK');
        //return;
    }); 
	ls.stderr.on('data', (data) => {
		console.log("stderr: " + data);
	});
	ls.on('exit', (code) => {
		console.log("child process exited with code " + code);
	});
});


// used multerConfig -> used for form action in upload.html
router.post('/upload', multer(multerConfig).single('csvfile'), function(req, res) {

	console.log("Upload button");
	// direct back to professor.html
	res.redirect('/#/profProfile/');
});


// used multerConfig
router.post('/update', multer(multerConfig).single('csvfile'), function(req, res) {

	console.log("Update button");
	res.redirect('/#/profProfile/');
});

module.exports = router;
