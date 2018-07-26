// lay data tu database 
var express = require('express');
var router = express.Router();

var texttomp3 = require("./index");
var fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

var monk = require('monk');
var db = monk('localhost:27017/grade');

// var requirejs = require('requirejs');
// var texttomp3 = require("./index");
// var fs = require('fs');
// const ffmpeg = require('fluent-ffmpeg');

function texttomp3(){
    var text = "You are good";
    var fn = "good";

    console.log("text = ",text);
    console.log("fn = ",fn);

    let track = fn + '.mp3';//your path to source file

    if(typeof text ===  "undefined" || text === ""  || typeof fn === "undefined" || fn === "") { // just if I have a text I'm gona parse
            console.log("missing required params, check out the help with -?");
        }
    
    if(text.length > 200){ // check longness of text, because otherways google translate will give me a empty file
            console.log("Text to long, split in text of 200 characters")
        }

//HERE WE GO
        texttomp3.getMp3(text, function(err, data){
            if(err){
                console.log(err);
                return;
        }

        if(fn.substring(fn.length-4, fn.length) !== ".mp3"){ // if name is not well formatted, I add the mp3 extention
                    fn+=".mp3";
        }
        
        var file = fs.createWriteStream(fn); // write it down the file
                file.write(data);
                file.end();
            console.log("MP3 SAVED!");
        });

        if (fn == ""){

            console.log("hung");

        }

            ffmpeg(track).toFormat('wav').on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            }).on('progress', (progress) => {
    // console.log(JSON.stringify(progress));
    console.log('Processing: ' + progress.targetSize + ' KB converted');
})
.on('end', () => {
    console.log('Processing finished !');
})
.save('../public/items/voice/' + fn + '.env');//path where you want to save your file

}

router.post('/', function(req, res) {
    var collection = db.get(req.body.course);
    collection.findOne({ NUID: req.body.nuid }, function(err, account) {
        if (err) return console.log(err);
        if (account == null) {
			return res.json({});
		}
		res.json(account);
    });
});

router.get('/csce235', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};

	var fs = require('fs');


	fs.readFile('ml_scripts/data/csce235/grade.json', function(err, data) {

		if (err) return console.log(err);
		var wrapObj = {
			grades: uint8ToString(data)
		};
		res.json(wrapObj);

	});
});

router.get('/csce23', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};

	var fs = require('fs');


	fs.readFile('ml_scripts/data/csce23/grade.json', function(err, data) {

		if (err) return console.log(err);
		var wrapObj = {
			grades: uint8ToString(data)
		};
		res.json(wrapObj);

	});
});


router.get('/csce235/db', function(req, res) {
    var collection = db.get('csce235');
    collection.find({}, function(err, accounts) {
        if (err) return console.log(err);
        res.json(accounts);
    });
});

router.get('/csce23/db', function(req, res) {
    var collection = db.get('csce23');
    collection.find({}, function(err, accounts) {
        if (err) return console.log(err);
        res.json(accounts);
    });
});

// match id vs cai any -> tra ve tai khoan 
// get = lay du lieu -> tra ve het cac data tu tai khoan
router.get('/csce235/:nuid', function(req, res) {
	var collection = db.get('csce235');
	//texttomp3();
    collection.findOne({ NUID: req.params.nuid }, function(err, account) {
		console.log("hung 235");
        if (err) return console.log(err);
        if (account == null) {
			console.log("account1");
			return res.json({});
		}
		console.log("account");
		console.log(account);
		return res.json(account);
    });
});

router.get('/csce23/:nuid', function(req, res) {
    var collection = db.get('csce23');
    collection.findOne({ NUID: req.params.nuid }, function(err, account) {
		console.log("hung 23");
        if (err) return console.log(err);
        if (account == null) {
			console.log("account1");
			return res.json({});
		}
		console.log("account");
		console.log(account);
		return res.json(account);
    });
});

// ấn vào grade generation step(2) -> POST /api/grades/csce235 
// put data in the table 
// run python3 train_models.py csce235
// press run = activate ml_scripts/predict.py
router.post('/csce235', function(req, res) {

	var collection = db.get('csce235');

	collection.remove({});


	console.log("inside router.post('/csce235', function(req, res)");

	// same initialize in multipp.js
    var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};


	var params = ['ml_scripts/predict.py', 'csce235'];
		// req.body.fields = 20
	params.push(req.body.students, req.body.fields);

	// param = [ 'ml_scripts/predict.py', 'csce235', 2, 20 ]
	//console.log("params ban dau = ", params);

	// 

	console.log("req.body.students = ", req.body.students);

	console.log("req.body.fields = ", req.body.fields);




	for(var i in req.body.grade) {
		var thisGrade = req.body.grade[i];
		for(var prop in thisGrade) {
			params.push(prop, thisGrade[prop]);
		}
	}

	// console.log("params = ");
	// console.log(params);

	const spawn = require('child_process').spawn;
	const ls = spawn('python3', params);

	ls.stdout.on('data', (data) => {

		//console.log(`stdout in 235 predict: ${data}`);

	});

	ls.stdout.on('data', (data) => {

		var predict = uint8ToString(data).split(',');

		for(var i in req.body.grade) {
			var thisGrade = req.body.grade[i];
			thisGrade.Predict = predict[i];

			console.log("database cua csce235: ");

			//console.log(thisGrade);
			
			collection.update({ NUID: thisGrade.NUID }, { $set: thisGrade }, { upsert : true }, function(err, account) {
				if (err) console.log(err);
			});
		}


		console.log("update thanh cong");

        return res.json({});
	});
	ls.stderr.on('data', (data) => {
	  console.log("stderr: " + data);
	});
	ls.on('exit', (code) => {
	  console.log("child process exited with code " + code);
	});
});


router.post('/csce23', function(req, res) {

	var collection = db.get('csce23');

	collection.remove({});


	console.log("inside router.post('/csce23', function(req, res)");

	// same initialize in multipp.js
    var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};


	var params = ['ml_scripts/predict.py', 'csce23'];
		// req.body.fields = 20
	params.push(req.body.students, req.body.fields);

	// param = [ 'ml_scripts/predict.py', 'csce23', 2, 20 ]
	console.log("params ban dau = ", params);

	// 
	console.log("req.body.students = ", req.body.students);

	console.log("req.body.fields = ", req.body.fields);



	for(var i in req.body.grade) {
		var thisGrade = req.body.grade[i];
		for(var prop in thisGrade) {
			params.push(prop, thisGrade[prop]);
		}
	}

	// console.log("params = ");
	// console.log(params);

	const spawn = require('child_process').spawn;
	const ls = spawn('python3', params);

	ls.stdout.on('data', (data) => {

		console.log(`stdout in predict: ${data}`);

	});

	ls.stdout.on('data', (data) => {

		var predict = uint8ToString(data).split(',');

		for(var i in req.body.grade) {
			var thisGrade = req.body.grade[i];
			thisGrade.Predict = predict[i];

			// console.log("database cua csce23: ");

			// console.log(thisGrade);
			
			collection.update({ NUID: thisGrade.NUID }, { $set: thisGrade }, { upsert : true }, function(err, account) {
				if (err) console.log(err);
			});
		}


		console.log("update thanh cong");

        return res.json({});
	});
	ls.stderr.on('data', (data) => {
	  console.log("stderr: " + data);
	});
	ls.on('exit', (code) => {
	  console.log("child process exited with code " + code);
	});
});




router.get('/csce156', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	var fs = require('fs');
	fs.readFile('ml_scripts/data/csce156/grade.json', function(err, data) {
		if (err) return console.log(err);
		var wrapObj = {
			grades: uint8ToString(data)
		};
		res.json(wrapObj);
	});
});

router.get('/csce156/db', function(req, res) {
    var collection = db.get('csce156');
    collection.find({}, function(err, accounts) {
        if (err) return console.log(err);
        res.json(accounts);
    });
});

router.get('/csce156/:nuid', function(req, res) {
    var collection = db.get('csce156');
    collection.findOne({ NUID: req.params.nuid }, function(err, account) {
        if (err) return console.log(err);
        if (account == null) {
			return res.json({});
		}
		return res.json(account);
    });
});


router.post('/csce156', function(req, res) {
	var collection = db.get('csce156');
	
	collection.remove({});

    var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	var params = ['ml_scripts/predict.py', 'csce156'];
	params.push(req.body.students, req.body.fields);


	// 
	console.log("req.body.students 156 = ", req.body.students);



	for(var i in req.body.grade) {
		var thisGrade = req.body.grade[i];
		for(var prop in thisGrade) {
			params.push(prop, thisGrade[prop]);
		}
	}

	//console.log("params 156 luc sau = ", params);


	const spawn = require('child_process').spawn;
	const ls = spawn('python3', params);

	ls.stdout.on('data', (data) => {

		 console.log(`stdout in 156 predict: ${data}`);
	});

	ls.stdout.on('data', (data) => {
		var predict = uint8ToString(data).split(',');
		//console.log("predict = ", predict)
		for(var i in req.body.grade) {
			var thisGrade = req.body.grade[i];
			thisGrade.Predict = predict[i];
			console.log("this grade 156 = ");
			console.log(thisGrade);
			collection.update({ NUID: thisGrade.NUID }, { $set: thisGrade }, { upsert : true }, function(err, account) {
				if (err) console.log(err);
			});
		}
        return res.json({});
	});
	ls.stderr.on('data', (data) => {
	  console.log("stderr: " + data);
	});
	ls.on('exit', (code) => {
	  console.log("child process exited with code " + code);
	});
});

/*router.post('/csce235', function(req, res) {
    var collection = db.get('csce235');
    var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
    collection.update({ NUID: req.body.nuid }, { $set: req.body.grades }, { upsert : true }, function(err, account) {
    	if (err) return console.log(err);
    	const spawn = require('child_process').spawn;
    	var params = ['ml_scripts/predict.py', 'csce235'];
    	for(var index in req.body.grades) {
    		params.push(index, req.body.grades[index]);

    	}
		const ls = spawn('python3', params);
    	ls.stdout.on('data', (data) => {
			var wrapObj = {
				predict: uint8ToString(data)
			};
            return res.json(wrapObj);
		});

		ls.stderr.on('data', (data) => {
		  console.log("stderr: " + data);
		});

		ls.on('exit', (code) => {
		  console.log("child process exited with code " + code);
		});
    });
});*/

/*
router.post('/', function(req, res) {
    var collection = db.get('accounts');
    collection.update({ username: req.body.username }, { $set: {
        "hw1" : Number(req.body.hw1),
        "hw2" : Number(req.body.hw2),
        "hw3" : Number(req.body.hw3),
        "hw4" : Number(req.body.hw4),
        "hw5" : Number(req.body.hw5),
        "hw6" : Number(req.body.hw6),
        "q1" : Number(req.body.q1),
        "q2" : Number(req.body.q2),
        "q3" : Number(req.body.q3),
        "q4" : Number(req.body.q4),
        "q5" : Number(req.body.q5),
        "q6" : Number(req.body.q6),
        "q7" : Number(req.body.q7),
        "q8" : Number(req.body.q8),
        "q9" : Number(req.body.q9),
        "q10" : Number(req.body.q10),
        "midterm" : Number(req.body.midterm),
        "final" : Number(req.body.final)
    }}, function(err, account) {
    	if (err) throw err;
    	res.json(account);
    });
});

router.post('/', function(req, res) {
	var collection = db.get('accounts');
	console.log(req.body);
	collection.insert(req.body, {w: 1}, function(err, result) {
		if (err) throw err;
		//console.log(result);
		res.json(result);
	});
}); 
*/
module.exports = router;
