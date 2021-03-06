var express = require('express');
var router = express.Router();

var texttomp3 = require("./index1");
var fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

var monk = require('monk');
var db = monk('localhost:27017/grade');





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

// save data 
router.get('/image/:username/:url', function(req, res) {
    var collection = db.get('accounts');
    console.log(" trong get image " );

    var myquery = { Username: req.params.username };
    var newvalues = { $set: {  URL: req.params.image } };
    
    collection.update(myquery, newvalues, function(err, res) {
        if (err) return console.log(err);
    console.log("1 document updated");
    // if (account == null) {
    //     return res.json({});
    // }
    
    

    });

 
  
}); 

router.get('/view/:nuid/:viewCount', function(req, res) {
    var collection = db.get('accounts');
    console.log(" trong get view count " );

    var myquery = { NUID: req.params.nuid };
    var newvalues = { $set: {  viewCount: req.params.viewCount } };
    
    collection.update(myquery, newvalues, function(err, res) {
        if (err) return console.log(err);
    console.log("view updated");
     

    });

 
  
}); 

router.get('/allView/:nuid/:allViewCount', function(req, res) {
    var collection = db.get('accounts');
    console.log(" trong get view count " );

    var myquery = { NUID: req.params.nuid };
    var newvalues = { $set: {  allView: req.params.allViewCount } };
    
    collection.update(myquery, newvalues, function(err, res) {
        if (err) return console.log(err);
    console.log("all view updated");
     

    });

 
  
}); 

// change password
router.get('/changePassword/:nuid/:password', function(req, res) {
    var collection = db.get('accounts');
    console.log(" trong get image " );

    var myquery = { NUID: req.params.nuid };
    var newvalues = { $set: {  Password: req.params.password } };
    
    collection.update(myquery, newvalues, function(err, res) {
        if (err) return console.log(err);
    console.log("1 password updated");
    // if (account == null) {
    //     return res.json({});
    // }
    
    

    });

 
  
}); 

// get the accounts info with the username as the input from the database
router.get('/:username', function(req, res) {
    var collection = db.get('accounts');

    console.log(" co account trong user ");


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

router.get('/searchFullName/:fullname', function(req, res) {
    var collection = db.get('accounts');

    console.log(" co account trong fullname ");


    collection.findOne({ FullName: req.params.fullname}, function(err, account) {

        if (err) return console.log(err);
        if (account == null) {
            console.log("account null trong fullname ");
			return res.json({});
        }



        
		res.json(account);
		
    });
});

// router.get('/:nuid1', function(req, res) {
//     var collection = db.get('accounts');

  


//     collection.findOne({ NUID: req.params.nuid }, function(err, account) {

//         if (err) return console.log(err);
//         if (account == null) {
//             //console.log("account null  ");
// 			return res.json({});
//         }
        
//         console.log(" co account trong NUID ");
//         console.log(account );
        
// 		res.json(account);
// 		/*
// 		var uint8arrayToString = function(data) {
//             return String.fromCharCode.apply(null, data);
//         };
//         const spawn = require('child_process').spawn;
// 		const ls = spawn('python3', ['ml_scripts/predict.py', 
// 			account.q1,
// 			account.q2,
// 			account.q3,
// 			account.hw1,
// 			account.hw2,
// 			account.hw3,
// 			account.midterm,
// 		]);

// 		ls.stdout.on('data', (data) => {
// 			account.predict = uint8arrayToString(data);
//             return res.json(account);
// 		});

// 		ls.stderr.on('data', (data) => {
// 		  console.log("stderr: " + data);
// 		});

// 		ls.on('exit', (code) => {
// 		  console.log("child process exited with code " + code);
// 		});*/
//     });
// });



router.get('/hung/:nuid', function(req, res) {
    var collection = db.get('accounts');

    console.log(collection);
  
    console.log("vao /hung/:nuid");

    collection.findOne({ NUID: req.params.nuid }, function(err, account) {

        if (err) return console.log(err);
        if (account == null) {
            console.log("account null  ");
			return res.json({});
        }
        
        console.log(" co account trong NUID ");
        console.log(account);
        
		res.json(account);
	
    });
});

router.get('/:nuid', function(req, res) {
    var collection = db.get('accounts');
    console.log(" o trong account.js, router.get('/:nuid', function(req, res) ");
    collection.findOne({ NUID: req.params.nuid }, function(err, account) {
        console.log(" o trong account.js, router.get('/:nuid', function(req, res) ");
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
    console.log("hung chu");
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        wrapObj.code += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log("hung chu 1");
    var transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
            user: 'gradePredict@outlook.com',
            pass: 'Grade1997@'
        }
    });
    console.log("hung chu 2");
    var mailOptions = {
        from: 'gradePredict@outlook.com',
        to: req.body.email,
        subject: 'Confirmation',
        html: '<h1>Hi! Welcome to the system.</h1><p><i>This is an auto-generated email from Grade Prediction System.</i></p><p>Your confirmation code is: <font size="6"><b>' + wrapObj.code + '</b></font></p>'
    };
    wrapObj.code
    console.log(" wrapObj.code = ",  wrapObj.code);
    console.log("req.body.email = ", req.body.email);

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

// change pass 
router.post('/changePassword', function(req, res) {
    const nodemailer = require('nodemailer');
    var wrapObj = {
        code: ""
    };
    console.log("hung chu");
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        wrapObj.code += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log("hung chu 1");
    var transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
            user: 'gradePredict@outlook.com',
            pass: 'Grade1997@'
        }
    });
    console.log("hung chu 2");
    var mailOptions = {
        from: 'gradePredict@outlook.com',
        to: req.body.email,
        subject: 'Student request to change the password',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:3001/#/changePassword\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    wrapObj.code
    console.log(" wrapObj.code = ",  wrapObj.code);
    console.log("req.body.email = ", req.body.email);

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

router.post('/newPrediction', function(req, res) {
    const nodemailer = require('nodemailer');

    var collection = db.get('accounts');

    collection.distinct("Email", {},(function(err, docs){
              if(err){
                  return console.log(err);
              }
              if(docs){  
                 console.log("allEmail");
                  console.log(docs);
            
                 console.log("hung chu");
                 
                 var transporter = nodemailer.createTransport({
                     service: 'Outlook',
                     auth: {
                         user: 'gradePredict@outlook.com',
                         pass: 'Grade1997@'
                     }
                 });
                 console.log("hung chu 2");
                 var mailOptions = {
                    from: 'gradePredict@outlook.com',
                    to: docs,
                    subject: 'New ' + req.body.email + ' available',
                    text: 'There are new prediction in your account.\n\n' +
                      'Please click on the following link to check your new prediction:\n\n' +
                      'http://localhost:3001/#/\n\n'
                };
               
             
                 // press send confirmation code 
                 transporter.sendMail(mailOptions, function(error, info) {
                     if (error) {
                         console.log(error);
                     } else {
                         console.log('Email sent: ' + info.response);
                     }
                 });

                  
              
              
              
                 }
         })
      ); 


}); 


router.post('/viewCount', function(req, res) {
    
    var collection = db.get('accounts');

    collection.distinct("viewCount", {},(function(err, docs){
              if(err) return console.log(err);
            
             // if(docs){  
                 console.log("userView = ");
                  console.log(docs); 
                  var sum = 0;
                  for( var i = 0; i < docs.length; i++){
                          sum += parseInt(docs[i]);
                  }              
                  console.log("sum = " + sum);

                  var myquery = { Role: "Professor" };
              var newvalues = { $set: {  userView: sum } };
    
       collection.update(myquery, newvalues, function(err, res) {
            if (err) return console.log(err);
                         console.log("user view updated");
     

           });


              
                // }
         })
      ); 


}); 



module.exports = router;
