var express = require('express');
var router = express.Router();

var texttomp3 = require("./index");
var fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

var monk = require('monk');
var db = monk('localhost:27017/grade');

function textToMP3(fn, text){
	var texttomp3 = require("./index1");
	var fs = require('fs');
	const ffmpeg = require('fluent-ffmpeg');
	const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
	ffmpeg.setFfmpegPath(ffmpegInstaller.path);
	
	
	
		console.log("text = ",text);
		console.log("fn = ",fn);
	
		let track = fn + '.mp3';//your path to source file
	
		// if(typeof text ===  "undefined" || text === ""  || typeof fn === "undefined" || fn === "") { // just if I have a text I'm gona parse
		// 		console.log("missing required params, check out the help with -?");
		// 	}
		
		// if(text.length > 200){ // check longness of text, because otherways google translate will give me a empty file
		// 		console.log("Text to long, split in text of 200 characters")
		// 	}
	
			texttomp3.getMp3(text, function(err, data){
				if(err){
					console.log(err);
					return;
			}
	
			// if(fn.substring(fn.length-4, fn.length) !== ".mp3"){ // if name is not well formatted, I add the mp3 extention
			// 			fn+=".mp3";
			// }
			
			var file = fs.createWriteStream(fn+=".mp3"); // write it down the file
					file.write(data);
					file.end();
				console.log( fn + ".MP3 SAVED!");
			});

}

function textToWav(fn){

	var texttomp3 = require("./index1");
	var fs = require('fs');
	const ffmpeg = require('fluent-ffmpeg');
	const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
	ffmpeg.setFfmpegPath(ffmpegInstaller.path);
	
	
	
		// console.log("text = ",text);
		console.log("fn = ",fn);
	
		let track = fn + '.mp3';//your path to source file
	
		// if(typeof text ===  "undefined" || text === ""  || typeof fn === "undefined" || fn === "") { // just if I have a text I'm gona parse
		// 		console.log("missing required params, check out the help with -?");
		// 	}
		
		// if(text.length > 200){ // check longness of text, because otherways google translate will give me a empty file
		// 		console.log("Text to long, split in text of 200 characters")
		// 	}
	
		// 	texttomp3.getMp3(text, function(err, data){
		// 		if(err){
		// 			console.log(err);
		// 			return;
		// 	}
	
		// 	if(fn.substring(fn.length-4, fn.length) !== ".mp3"){ // if name is not well formatted, I add the mp3 extention
		// 				fn+=".mp3";
		// 	}
			
		// 	var file = fs.createWriteStream(fn); // write it down the file
		// 			file.write(data);
		// 			file.end();
		// 		console.log("MP3 SAVED!");
		// 	});
	
	
		// setTimeout(function(track){	
		
	// const ffmpeg = require('fluent-ffmpeg');
	// const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
	ffmpeg.setFfmpegPath(ffmpegInstaller.path);
	
			ffmpeg(track).toFormat('wav').on('error', (err) => {
					console.log('An error occurred: ' + err.message);
				}).on('progress', (progress) => {
		// console.log(JSON.stringify(progress));
		var i = 0;
		while( i < 1000000000){
			i++;
		}
		console.log('Processing: ' + progress.targetSize + ' KB converted');
	})
	.on('end', () => {
		console.log('Processing' + fn + '.WAV file finished !');
	})
	.save('./public/items/voice/' + fn + '.env');//path where you want to save your file
		// },2000);

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
		if (account.Predict == null){
			return;
		}
	
		// var name = account.FullName;
		// name = name.split(" ");


		// var text =  "Hello " + name[0] +", I am from your future. Click on the View Grade button to see future!";
		
		
		// textToWav(name[0],text);

		// 	var fn = account.Predict;

		// 	if (fn == "High-risk"){

		// 		var text = "You are at " + account.Predict;
		// 	}else{

		// 		var text = "You are " + account.Predict;
		// 	}	
		
		// 	console.log("text = ",text);
		// 	console.log("fn = ",fn);

		// 	textToWav(fn,text);

		var name = account.FullName;
		name = name.split(" ");
		var text = "";


		var text1 =  "Hello " + name[0] +", I am from your future. Click on the Visit Future button to see future!";
		
		textToMP3(name[0],text1);
		
		
			var fn = name[0] + "_" + account.Predict;
			var countField = Object.keys(account).length - 3;

			console.log("account = ");

			console.log(account);


			console.log("countField 235 = ", countField );

			if ( countField - 2 == 2){
				if (fn == "High-risk"){
	
					 text = "You are at " + account.Predict;
				}else{
	
					 text = "You are " + account.Predict;
				}	
	}else if ( countField - 3 >= 6){

		console.log("countField 235  = ", countField);

		if (countField - 3 == 6){
			var predict1 = account.Predict1;
			var predict2 = account.Predict2;
		}else if (countField - 4 == 9){
			var predict1 = account.Predict2;
			var predict2 = account.Predict3;
		
		}else if (countField - 5 == 12){
			var predict1 = account.Predict3;
			var predict2 = account.Predict4;
		}
	
		// var predict1 = account.Predict1;
		// var predict2 = account.Predict2;

	console.log("predict1  = ", predict1);
	console.log("predict2  = ", predict2);


		if (predict1 == "High-risk" && predict2 == "High-risk"){
				text = "Warning! You are again at High-risk. It is highly that you will fail in this class.";
		}else if (predict1 == "High-risk" && predict2 == "OK"){
			text = "Well done! You are doing OK. Previously you were at High-risk. PLease keep working hard";
		}else if (predict1 == "High-risk" && predict2 == "Good"){
			text = "Congratulations! You are doing Good. Previously you were at High-risk. PLease continue putting your best effort";
		}
	
		if (predict1 == "OK" && predict2 == "High-risk"){
			text = "Warning! You are at High-risk. Your performance degraded. It is highly that you will fail in this class.";
	}else if (predict1 == "OK" && predict2 == "OK"){
		text = "You are doing OK. Previously you were OK as well. There has been no improvement. You need to work hard";
	}else if (predict1 == "OK" && predict2 == "Good"){
		text = "Congratulations! You are doing Good. Previously you were OK. Please keep working hard";
	}
	
	if (predict1 == "Good" && predict2 == "High-risk"){
		text = "Warning! Warning! You are at High-risk. Your performance degraded severely. It is highly that you will fail in this class.";
	}else if (predict1 == "Good" && predict2 == "OK"){
	text = "Warning! You are doing OK. Your performance degraded from Good to OK. If you don't improve, you will do even worse.";
	}else if (predict1 == "Good" && predict2 == "Good"){
	text = "Congratulations! You are doing Good. Previously you were Good as well. Continue your hard work to maintain good performance";
	}
	
	 
		
	}

			
		
			console.log("text = ",text);
			console.log("fn = ",fn);

			textToMP3(fn,text);
			// textToWav(fn1,text);

			textToWav(name[0]);
			textToWav(fn);

			
		return res.json(account);
    });
});


// ấn vào grade generation step(2) -> POST /api/grades/csce235 
// put data in the table 
// run python3 train_models.py csce235
// press run = activate ml_scripts/predict.py
router.post('/csce235', function(req, res) {

	var collection = db.get('csce235');

	// collection.remove({});


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

	// console.log("req.body.students = ", req.body.students);

	console.log("req.body.fields trong 235 up = ", req.body.fields);
	var countData = req.body.fields - 2;
	console.log("countData 235 k tru = ", countData  + 2);
	console.log("countData 235 up = ", countData);
	if (countData == 2){
		collection.remove({});
	}
	else if (countData == 5){
		// collection.remove({});
		collection.remove({"Predict1":{$nin:["Good","OK","High-risk"]}});
		console.log("collection 235 = ");
		// return;
		// console.log("collection 235 = ");
		// console.log(collection.find({FullName:"Eric Carter"}));
	}
	else if (countData == 9){
		collection.remove({"Predict1":{$nin:["Good","OK","High-risk"]}, "Predict2":{$nin:["Good","OK","High-risk"]}});
	}
	else if (countData == 12){
		collection.remove({"Predict1":{$nin:["Good","OK","High-risk"]}, "Predict2":{$nin:["Good","OK","High-risk"]}, "Predict3":{$nin:["Good","OK","High-risk"]}});
	}


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

			if (countData == 2){
				thisGrade.Predict1 = predict[i];
				}
			else if (countData == 5){
				thisGrade.Predict2 = predict[i];
				}
			else if (countData == 9){
				thisGrade.Predict3 = predict[i];
				}
			else if (countData == 12){
			thisGrade.Predict4 = predict[i];
			}

			console.log("database cua csce235: ");

			console.log(thisGrade);
			
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

		if (account.Predict == null){
			return;
		}

		var name = account.FullName;
		console.log("name trong 156 = ", name);
		firstName = name.split(" ");

		var text = "";
		var text1 =  "Hello " + firstName[0] +", I am from your future. Click on the Visit Future button to see future!";
		
		textToMP3(name[0],text1);
		var countField = Object.keys(account).length - 3;

		console.log("countField 156 = ", countField - 3);

		// console.log(" length of account 156 = ", Object.keys(account).length);
		console.log(" firstName = ", firstName);
			var fn = firstName[0]  + "_" + account.Predict;
if ( countField - 2 == 4){
			if (fn == "High-risk"){

				 text = "You are at " + account.Predict;
			}else{

				 text = "You are " + account.Predict;
			}	
}else if ( countField - 3 >= 8){

	console.log("countField 156  = ", countField);
if (countField - 3 == 8){
	var predict1 = account.Predict1;
	var predict2 = account.Predict2;
}else if (countField - 4 == 13){
	var predict1 = account.Predict2;
	var predict2 = account.Predict3;

}else if (countField - 5 == 17){
	var predict1 = account.Predict3;
	var predict2 = account.Predict4;
}

	if (predict1 == "High-risk" && predict2 == "High-risk"){
			text = "Warning! You are again at High-risk. It is highly that you will fail in this class.";
	}else if (predict1 == "High-risk" && predict2 == "OK"){
		text = "Well done! You are doing OK. Previously you were at High-risk. PLease keep working hard";
	}else if (predict1 == "High-risk" && predict2 == "Good"){
		text = "Congratulations! You are doing Good. Previously you were at High-risk. PLease continue putting your best effort";
	}

	if (predict1 == "OK" && predict2 == "High-risk"){
		text = "Warning! You are at High-risk. Your performance degraded. It is highly that you will fail in this class.";
}else if (predict1 == "OK" && predict2 == "OK"){
	text = "You are doing OK. Previously you were OK as well. There has been no improvement. You need to work hard";
}else if (predict1 == "OK" && predict2 == "Good"){
	text = "Congratulations! You are doing Good. Previously you were OK. Please keep working hard";
}

if (predict1 == "Good" && predict2 == "High-risk"){
	text = "Warning! Warning! You are at High-risk. Your performance degraded severely. It is highly that you will fail in this class.";
}else if (predict1 == "Good" && predict2 == "OK"){
text = "Warning! You are doing OK. Your performance degraded from Good to OK. If you don't improve, you will do even worse.";
}else if (predict1 == "Good" && predict2 == "Good"){
text = "Congratulations! You are doing Good. Previously you were Good as well. Continue your hard work to maintain good performance";
}

 




}
			console.log("text = ",text);
			console.log("fn = ",fn);

			textToMP3(fn,text);
			// textToWav(fn,text);

			textToWav(name[0]);
			textToWav(fn);
		
		return res.json(account);
    });
});


router.post('/csce156', function(req, res) {
	var collection = db.get('csce156');
	//,{"Predict0":{$nin:["OK","Good","High-risk"]}}
	// collection.remove({"Predict1":{$nin:["Good","OK","High-risk"]}});

	// collection.remove({});

    var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	var params = ['ml_scripts/predict.py', 'csce156'];
	params.push(req.body.students, req.body.fields);


	// 
	console.log("req.body.students 156 = ", req.body.students);
	console.log("req.body.fields 156 = ", req.body.fields - 2);

	var countData = req.body.fields - 2;


	if (countData == 4){
		collection.remove({});
	}
	else if (countData == 8){
		collection.remove({"Predict1":{$nin:["Good","OK","High-risk"]}});
		console.log("return 156");
		// return;
	}
	else if (countData == 13){
		collection.remove({"Predict1":{$nin:["Good","OK","High-risk"]}, "Predict2":{$nin:["Good","OK","High-risk"]}});
	}
	else if (countData == 17){
		collection.remove({"Predict1":{$nin:["Good","OK","High-risk"]}, "Predict2":{$nin:["Good","OK","High-risk"]}, "Predict3":{$nin:["Good","OK","High-risk"]}});
	}

	for(var i in req.body.grade) {
		var thisGrade = req.body.grade[i];

		for(var prop in thisGrade) {
			// console.log("prop = ", prop);
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
		// print out all the predict
		console.log("predict = ", predict);
		// console.log("lenth of req.body.grade = ", Object.keys(req.body.grade).length);
		// console.log(req.body.grade );
		for(var i in req.body.grade) {
			var thisGrade = req.body.grade[i];
			thisGrade.Predict = predict[i];
			
			if (countData == 4){
				thisGrade.Predict1 = predict[i];
				}
			else if (countData == 8){
				thisGrade.Predict2 = predict[i];
				}
			else if (countData == 13){
				thisGrade.Predict3 = predict[i];
				}
			else if (countData == 17){
			thisGrade.Predict4 = predict[i];
			}
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