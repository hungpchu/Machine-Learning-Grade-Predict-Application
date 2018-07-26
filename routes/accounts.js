var express = require('express');
var router = express.Router();

var texttomp3 = require("./index1");
var fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

var monk = require('monk');
var db = monk('localhost:27017/grade');



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




router.get('/', function(req, res) {
    var collection = db.get('accounts');
    collection.find({}, function(err, accounts) {
        if (err) return console.log(err);
        res.json(accounts);
    });
});

router.get('/students', function(req, res) {
    var collection = db.get('accounts');
    collection.find({Role: "Student"}, function(err, accounts) {
        if (err) return console.log(err);
        return res.json(accounts);
    });
});

// get the accounts info with the username as the input from the database
router.get('/:username', function(req, res) {
    var collection = db.get('accounts');

    var texttomp3 = require("./index1");
var fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

var text = "You are good";
    var fn = "good2";

    console.log("text = ",text);
    console.log("fn = ",fn);

    let track = fn + '.mp3';//your path to source file

    if(typeof text ===  "undefined" || text === ""  || typeof fn === "undefined" || fn === "") { // just if I have a text I'm gona parse
            console.log("missing required params, check out the help with -?");
        }
    
    if(text.length > 200){ // check longness of text, because otherways google translate will give me a empty file
            console.log("Text to long, split in text of 200 characters")
        }

        texttomp3.getMp3(text, function(err, data){
            console.log("hung chuhysduyagduys");
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
.save('./public/items/voice/' + fn + '.env');//path where you want to save your file
    
    //texttomp3();
     //console.log(" trong account.js, router.get('/:username', function(req, res)");


    collection.findOne({ Username: req.params.username }, function(err, account) {

        if (err) return console.log(err);
        if (account == null) {
            //console.log("account null  ");
			return res.json({});
        }
        
        // console.log(" co account ");
        // console.log(account );
        
		res.json(account);
		/*
		var uint8arrayToString = function(data) {
            return String.fromCharCode.apply(null, data);
        };
        const spawn = require('child_process').spawn;
		const ls = spawn('python3', ['ml_scripts/predict.py', 
			account.q1,
			account.q2,
			account.q3,
			account.hw1,
			account.hw2,
			account.hw3,
			account.midterm,
		]);

		ls.stdout.on('data', (data) => {
			account.predict = uint8arrayToString(data);
            return res.json(account);
		});

		ls.stderr.on('data', (data) => {
		  console.log("stderr: " + data);
		});

		ls.on('exit', (code) => {
		  console.log("child process exited with code " + code);
		});*/
    });
});

router.get('/:nuid', function(req, res) {
    var collection = db.get('accounts');
    collection.findOne({ NUID: req.params.nuid }, function(err, account) {
        console.log(" o trong account.js, router.get('/:nuid', function(req, res) ")
        if (err) return console.log(err);
        if (account == null) {

            console.log(" account null trong router.get('/:nuid', function(req, res) ");
			return res.json({});
		}
		var uint8arrayToString = function(data) {
            return String.fromCharCode.apply(null, data);
        };
        const spawn = require('child_process').spawn;
		const ls = spawn('python3', ['ml_scripts/predict.py', 
			account.q1,
			account.q2,
			account.q3,
			account.hw1,
			account.hw2,
			account.hw3,
			account.midterm,
		]);

		ls.stdout.on('data', (data) => {
			account.predict = uint8arrayToString(data);
            return res.json(account);
		});

		ls.stderr.on('data', (data) => {
		  console.log("stderr: " + data);
		});

		ls.on('exit', (code) => {
		  console.log("child process exited with code " + code);
		});
    });
});

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
    	if (err) return console.log(err);
    	res.json(account);
    });
});
*/

// save data 
router.post('/', function(req, res) {
    var collection = db.get('accounts');
    console.log(" trong account.js, req.body  = " );

    // content of request 
    console.log(req.body);
    
    // insert data i guess 
	collection.insert(req.body, {w: 1}, function(err, result) {
        if (err) return console.log(err);
        console.log(" trong router.post('/', function(req, res), result = ");
		console.log(result);
		res.json(result);
	});
}); 

//send email confirm
router.post('/register', function(req, res) {
    const nodemailer = require('nodemailer');
    var wrapObj = {
        code: ""
    };
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        wrapObj.code += possible.charAt(Math.floor(Math.random() * possible.length));
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'predapp.system@gmail.com',
            pass: 'metsysppaderp'
        }
    });
    var mailOptions = {
        from: 'predapp.system@gmail.com',
        to: req.body.email,
        subject: 'Confirmation',
        html: '<h1>Hi! Welcome to the system.</h1><p><i>This is an auto-generated email from Grade Prediction System.</i></p><p>Your confirmation code is: <font size="6"><b>' + wrapObj.code + '</b></font></p>'
    };

    // press send confirmation code 
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.json(wrapObj);
}); 

module.exports = router;
