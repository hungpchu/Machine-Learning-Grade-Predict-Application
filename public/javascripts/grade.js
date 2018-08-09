
// 
// 
// 
// 
// có 2 tham số: tham số 1 = tên module ta cần tạo; 
// tham số 2: danh sách các dependencies, các modules khác ta cần
// ngResource' + ngRoute = module depend

var voice = {
  file : []

};

// var voiceFiles = ["good1"];


// var voiceFiles = [];

var app = angular.module('Grade', ['ngResource', 'ngRoute']);


// voiceFiles.push("high-risk");


var hung = "hung1";





//console.log("hello = " + angular.element(document.querySelector("#hello")));


app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'LoginCtrl'
    })
    .when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl'
    })
    .when('/professor/:username', {
        templateUrl: 'partials/professor.html',
        controller: 'ProfCtrl'
    })
    .when('/professor/:username/uploadGrade/:course', {
        templateUrl: 'partials/uploadGrade.html',
        controller: 'UploadCtrl'
    })
    .when('/student/:username', {
        templateUrl: 'partials/student1.html',
        controller: 'StudCtrl'
    })
	.when('/student/:username/viewGrade/:course', {
		templateUrl: 'partials/viewGrade.html',
		controller: 'ViewCtrl'
	})
	/*
    .when('/editGrade/:username', {
        templateUrl: 'partials/editGrade.html',
        controller: 'EditCtrl'
    })
	*/
    .otherwise({
        redirectTo: '/'
    })
}]);


// có biến chung app để tạo controller vs 2 tham số
// tham số 1: tên controller
//tham số 2: function định nghĩa controller
// cách viết tắt

//login.html -> controller = LoginCtrl
app.controller('LoginCtrl', ['$scope', '$resource', '$location',
	

function($scope, $resource, $location) {

        $scope.validate = function() {
			$scope.username = $scope.username == undefined ? "" : $scope.username;
			
            if (($scope.username).trim() == "") {
                $scope.message = "Username cannot be empty!";
                return;
            }
            var correctPassword = "";
            var Account = $resource('/api/accounts/:username');
            Account.get({username: $scope.username}, function(account) {
				if (account.Password == undefined) {
					$scope.message = "Username does not exist!";
					return;
				}

				correctPassword = account.Password;
				
                if ($scope.password == correctPassword) {
					if (account.Role == "Professor") {
						$location.path('/professor/' + $scope.username);
					}
					else {
						$location.path('/student/' + $scope.username);
					}
                }
                else {
                    $scope.message = "Wrong credential!";
                }
            });
        }
    }
]);

//register.html
app.controller('RegisterCtrl', ['$scope', '$resource', '$location', 

    function($scope, $resource, $location) {

		var format = function(input) {
			return (input == undefined ? "" : input.trim());
		}
        correctCode = "";
        confirmed = false;
		usernameChecked = false;
		$scope.checkUsername = function() {
			$scope.message = "";
			$scope.username = format($scope.username);
			if ($scope.username == "") {
				$scope.message = "Username cannot be empty!";
				return;
			}

			// declare from account.js
			var Account = $resource('/api/accounts/:username');

			// check user exist or not
			Account.get({username: $scope.username}, function(account) {
				if (account.Username != undefined) {
					$scope.message = "Username has already existed!";
					return;
				}
				else {
					$scope.message = "You can use this username";
					usernameChecked = true;
				}
			});
		}

		

		// send email 
        $scope.sendEmail = function() {
            $scope.message = "";
			$scope.email = format($scope.email);
			
            if (($scope.email).trim() == "") {
                $scope.message = "You have to enter your email to receive confirmation code.";
                return;
			}
			
			// declare trong accounts also -> 
			var Email = $resource('/api/accounts/register');
			
            Email.save({email: $scope.email}, function(data) {
                correctCode = data.code;
            });
		}
		
		// verify
        $scope.verify = function() {
            $scope.message = "";
            if (correctCode == "") {
                $scope.message = "The confirmation code has not been generated.";
                return;
			}
			
			// press verify
            if (($scope.confirmCode).trim() == correctCode) {
                confirmed = true;
                $scope.message = "Email confirmed!";
            } else {
                $scope.message = "Incorrect code!";
            }
		}
		

        $scope.reset = function() {
            document.getElementById("registerForm").reset();
            $scope.message = "";
		}
		

        $scope.regist = function() {

			var roles = document.getElementsByName("optradio");
			var role = "";
			for(var i = 0; i < roles.length; i++) {
				if (roles[i].checked) {
					role = roles[i].value;
				}
			}

			if (role == "") {
				$scope.message = "You need to select your role.";
				return;
			}

			$scope.nuid = format($scope.nuid);

			if ($scope.nuid == "") {
				$scope.message = "NUID cannot be empty!";
				return;
			}
			else {
				var Account = $resource("/api/accounts/:nuid");
				Account.get({nuid: $scope.nuid}, function(account) {
					if (account.username != undefined) {
						$scope.message = "NUID has already existed!"
						return;
					}
				});
			}


            if (!usernameChecked) {
				$scope.message = "Your username has not been checked yet!";
				return;
			}

			if (!confirmed) {
                $scope.message = "Your email has not been confirmed yet!";
                return;
			}
			
			if ($scope.password == undefined || $scope.password == "") {
				$scope.message = "Password cannot be empty!";
				return;
			}


            if ($scope.password != $scope.rpassword) {
                $scope.message = "Password does not match!";
                return;
			}
			
			var account = {
				"Full name": $scope.fullname,
				"Role": role,
				"NUID": $scope.nuid,
				"Email": $scope.email,
				"Username": $scope.username,
				"Password": $scope.password
			};


			var Accounts = $resource('/api/accounts');

			Accounts.save(account, function() {
				alert("You have successfully registered!\nYou will be redirected to the login page.");
	            $location.path("/");
			});
        }
    }
]);

// professor.html
app.controller('ProfCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams) {


		var Account = $resource('/api/accounts/:username');
		var Properties = $resource('/api/multipp/properties');

		// use resource Account here -> get accounts/hasan3
		Account.get({username: $routeParams.username}, function(account) {
			$scope.fullname = account["Full name"];

			console.log(" account[Full name] =  " + account["Full name"]);
			
			// use resource Properties here -> post /api/multipp/properties
			Properties.save({filename: "UserInfo"}, function(data) {
				
				console.log("trong propertise, data = ");
				console.log(data.list);
				
				var table = document.getElementById("profileTable");
				while (table.firstChild) {
					table.removeChild(table.firstChild);
				}
				
				for(var prop in data.list) {
					var tr = document.createElement("tr");
					var td_name = document.createElement("td");
					var td_val = document.createElement("td");
					var name = document.createTextNode(data.list[prop]);
					var val = document.createTextNode(account[data.list[prop]]);
					var b = document.createElement("B");
					b.appendChild(name);
					td_name.appendChild(b);
					td_val.appendChild(val);
					tr.appendChild(td_name);
					tr.appendChild(td_val);
					table.appendChild(tr);
				}
			});
		});


		var addRow = function(table, fullname) {
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			var name = document.createTextNode(fullname);
			td.appendChild(name);
			tr.appendChild(td);
			table.appendChild(tr);
		};

		var resetTable = function(table) {
			while (table.children[1]) {
				table.removeChild(table.children[1]);
			}
		};


		$scope.getLists = function() {


			document.getElementById('counter').innerHTML = '';
			var option = $scope.courseStat;
			var goodList = document.getElementById('goodList');
			var okList = document.getElementById('okList');
			var hrList = document.getElementById('hrList');
			var counter = [0, 0, 0];
			resetTable(goodList);
			resetTable(okList);
			resetTable(hrList);

			if (option == "") return;

			console.log("option = "+ option);

			// take option to put here -> generate table on the web
			var Students = $resource('/api/grades/' + option + '/db');

			// Students return all the info from database 
			Students.query(function(data) {
				for(var i in data) {
					var student = data[i];
					if (student.Predict == "Good") {
						addRow(goodList, student["Full name"]);
						counter[0] += 1;
					}
					else if (student.Predict == "OK") {
						addRow(okList, student["Full name"]);
						counter[1] += 1;
					}
					else if (student.Predict == "High-risk") {
						addRow(hrList, student["Full name"]);
						counter[2] += 1;
						hung = "hung3";
					}
				}
				document.getElementById('counter').innerHTML = 'There are ' + counter[0].toString() + ' Good students, ' + counter[1].toString() + ' OK students, and ' + counter[2].toString() + ' High-risk students.';
			});
		}

		// Run button
		$scope.rerunModel = function() {
			if ($scope.courseToRun == "") {
				$scope.message = "No course is chosen.";
				return;
			}

			if ($scope.weekToRun == "") {
				$scope.message = "No week is chosen.";
				return;
			}



			var Model = $resource('/api/models');
			Model.save({course: $scope.courseToRun, week: $scope.weekToRun},  function (newdata) {
				var i;
				for (i = 0; i < 10000; i++) {console.log("done");}
				$scope.message = "Finished update course !";
			});

			// Model.save({week: $scope.weekToRun}, function (newdata) {
			// 	var i;
			// 	for (i = 0; i < 10000; i++) {console.log("done");}
			// 	$scope.message = "Finished update week!";
			// });
		};


		// Predict button
		$scope.predict = function() {
			if ($scope.courseToRun == "") {
				$scope.message = "No course is chosen.";
				return;
			}
			var Grades = $resource('/api/grades/' + $scope.courseToRun);


			Grades.get(function(jsonGrade) {
				var fullGrade = JSON.parse(jsonGrade.grades);
				var wrapObj = {
					grade: [],
					students: 0,
					fields: 0
				};


				Properties.save({filename: $scope.courseToRun, week: $scope.weekToRun}, function(data) {
					for(var i in fullGrade) {
						wrapObj.students++;
						wrapObj.fields = 0;
						var thisGrade = fullGrade[i];
						var validGrade = {};
						for(var prop in data.list) {
							wrapObj.fields++;
							if (thisGrade[data.list[prop]] != undefined) {
								validGrade[data.list[prop]] = thisGrade[data.list[prop]];
							}

							// invalid grade = -1.
							else {
								validGrade[data.list[prop]] = -1;
							}
						}
						wrapObj.fields++;
						validGrade.NUID = thisGrade["SIS User ID"].toString();
						wrapObj.fields++;
						validGrade["Full name"] = thisGrade["Full name"];
						wrapObj.grade.push(validGrade);
					}


					Grades.save(wrapObj, function(data) {
						$scope.message = "Predictions are generated!"
					});
				});


			});
		};


		// upload thing1
        $scope.upload = function() {
			if ($scope.course == "") {
				$scope.message = "No course is chosen.";
				return;
			}
			console.log("To Upload page");
			// to the upload page
            $location.path('/professor/' + $routeParams.username + '/uploadGrade/' + $scope.course);
		};


		

    }
]);


// Upload.html -> form action = api/models/upload
app.controller('UploadCtrl', ['$scope', '$routeParams', 
    function($scope, $routeParams) {
		console.log("in Upload");
        var str = $routeParams.course;
        $scope.course = str.toUpperCase();
    }
]);


// student.html + say here 
app.controller('StudCtrl', ['$scope', '$resource', '$routeParams', '$location',
   
//dependency inject
function($scope, $resource, $routeParams, $location) {


	// voiceFiles.push("high-risk");


		var Predicts = $resource('/api/grades/csce235/:nuid');

		

		var synth = window.speechSynthesis;


		var inputTxt = document.querySelector('.txt');
		var voiceSelect = document.createElement('select');
		
		
		var voices = [];
		
		var male = "male";
		var gender = "male";

		var predict = "";
		
		

		
		var hello = document.getElementById("hello");
		
		

			// route den file accounts.js 
			var Account = $resource('/api/accounts/:username');

			//console.log("Account =" + Account);

			//console.log(" $location.absUrl() = " + $location.absUrl());


	   // student username
	   // username se thay the boi $routeParams.username
	   // get() trả về đối tượng rỗng và nó chỉ nó được tự động cập nhật khi có data từ phía server trả về.
		// Tham số thứ 2 trong hàm get() là một callback được gọi khi có data từ phía server trả về.
	   Account.get({username: $routeParams.username}, function(account) {
            /*var Params = $resource('/api/models');
            Params.get(function(data) {
                console.log(data.params.split(","));
			});*/

		
			// console.log(" voice file ban dau = " + voice.file);
			// console.log(" account.NUID = " + account.NUID);
			console.log("voiceFiles = ", voiceFiles);
			var voice1 = ["high","high"];
			function removeDuplicateUsingFilter(arr){
				let unique_array = arr.filter(function(elem, index, self) {
					return index == self.indexOf(elem);
				});
				return unique_array
			}
			console.log("unique voice1 = ");
			console.log(removeDuplicateUsingFilter(voice1));
		

			Predicts.get({nuid: account.NUID}, function(data) {

				//console.log(" $scope.account.NUID = " + $scope.account.NUID);
	
				// console.log("vao predict");
	
				if (data.Predict == "Good") {
					console.log("good");
					voiceFiles.push(data.Predict);
					voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					predict = "You are good";
	
	
				} else if (data.Predict == "OK") {
				
					console.log("ok");
					voiceFiles.push(data.Predict);
					voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					predict = "You are ok";
	
				} else {
					console.log("High-risk");
					// voice.file.push("high-risk");
					// if (voiceFiles.length == 1){
					// 	voiceFiles.pop();
					// }
					voiceFiles.push(data.Predict);
					voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					// voiceFiles = ["high-risk"];
					predict = "You are high risk";
					
				}	
				console.log(" voiceFiles trong predict = " + voiceFiles);
				
			});
			

			//$scope.account = account;
			//console.log("account =" + account);
			//console.log("$routeParams.username =" + $routeParams.username);

			var Properties = $resource('/api/multipp/properties');

            //console.log(" Properties = ");
			//console.log( Properties);

			// userInfo in the UserInfo.txt
			Properties.save({filename: "UserInfo"}, function(data) {

				var count = 0;
				
				//console.log(data.list);
				// tìm id của bảng 
				var table = document.getElementById("profileTable");

				//console.log("table.1child ngoai");
				//console.log(table.firstChild);

				while (table.firstChild) {
					 
					//count++;
					//console.log("count = "+ count);

					//console.log("table.1child trong");
				//console.log(table.firstChild);
					
					table.removeChild(table.firstChild);

					
				}

				for(var prop in data.list) {

					var tr = document.createElement("tr");
					var td_name = document.createElement("td");
					var td_val = document.createElement("td");

					var name = document.createTextNode(data.list[prop]);
					var val = document.createTextNode(account[data.list[prop]]);
					var b = document.createElement("B");

				
					//console.log("name");
					//console.log( name);

					//console.log("val");
					//console.log( val);

					//console.log("b");
					//console.log( b);




					b.appendChild(name);
					td_name.appendChild(b);
					td_val.appendChild(val);

					tr.appendChild(td_name);
					tr.appendChild(td_val);
					table.appendChild(tr);

					
				}
				//console.log("ene");
				
			
			});

		});

		var done = false;

		function speak(){

			console.log('synth.speaking ban dau = ' + synth.speaking);


			console.log('done ban dau = ' + done);
		

			//synth.speaking &&
			if ( synth.speaking  ) {
				
				console.log("bi lap");
				console.error('speechSynthesis.speaking');
				return;
			}
		  
		    var utterThis = new SpeechSynthesisUtterance(predict);
			
  
			//var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
			
			utterThis.onend = function (event) {
			   
			    console.log('SAY');
			}
			
			utterThis.onerror = function (event) {
				console.error('SAY.onerror');
			}
			
			console.log('Speak');
			done = true;
			synth.speak(utterThis);
			
			console.log('synth.speaking luc sau = ' + synth.speaking);
			console.log('done luc sau = ' + done);
		
		  
		  }
		  
			  var move = true;
		  
		//   hello.addEventListener("click",function(){
		  
		// 	  if (move){
  
		// 	  speak();
		// 	  hello.style.animation = "move 2s steps(3) infinite";
		  
		// 	  move = false;
		  
		// 	  }else{
		  
			  
		  
		//   hello.style.animation = "";
		  
		//   move = true;
		// 	  }
		  
		  
		//   });
		
		


		
		$scope.viewGrade = function() {
			if ($scope.course == undefined) {
				$scope.message = "No course is chosen.";
				return;
			}


			console.log('/student/' + $routeParams.username + "/viewGrade/" + $scope.course);
			$location.path('/student/' + $routeParams.username + "/viewGrade/" + $scope.course);
		
		}

		


	}
	

]);


//quan tam den cai nay
app.controller('ViewCtrl', ['$scope', '$resource', '$location', '$routeParams',
// location = 
// 
// 
	function($scope, $resource, $location, $routeParams) {

		
		$scope.back = function() {
			$location.path("/student/" + $routeParams.username);
		}


		$scope.course = $routeParams.course.toUpperCase();

		var Account = $resource('/api/accounts/:username');
		var Grade = $resource('/api/grades/:nuid');
		var Properties = $resource('/api/multipp/properties');

	


		Account.get({username: $routeParams.username}, function(account) {

			console.log("account123");
			console.log(account);

			$scope.account = account;

			var wrapObj = {
				course: $routeParams.course,
				nuid: $scope.account.NUID
			};


			var Grades = $resource('/api/grades/' + $routeParams.course);
			Grades.get(function(data) {

				var fullGrade = JSON.parse(data.grades);
				var thisGrade = null;

				// console.log(" fullGrade = ");
				// console.log(data.grades);

			

				for(var index in fullGrade) {

					if (fullGrade[index]["SIS User ID"] == $scope.account.NUID) {
						thisGrade = fullGrade[index];

						//console.log("thisGrade = ");
						//console.log(thisGrade);

						break;
					}

				}


				if (thisGrade == null) {
					$scope.message = "Cannot find your grade!";
					return;
				}
				/*Properties.save({filename: wrapObj.course}, function(data) {
					var validGrade = {};
					for(var prop in data.list) {
						if (thisGrade[data.list[prop]] != undefined) {
							validGrade[data.list[prop]] = thisGrade[data.list[prop]];
						}
						else {
							validGrade[data.list[prop]] = -1;
						}
					}
					validGrade["NUID"] = wrapObj.nuid;
					Grades.save({nuid: wrapObj.nuid, grades: validGrade}, function(data) {
						document.getElementById("predict").innerHTML = data.predict;
						validGrade["Predict"] = data.predict;
						if (data.predict == "Good") {
							document.getElementById("predict").setAttribute("color", "green");
						} else if (data.predict == "OK") {
							document.getElementById("predict").setAttribute("color", "#ecc400");
						} else {
							document.getElementById("predict").setAttribute("color", "red");
						}								
						var Predicts = $resource('/api/grades/' + $routeParams.course + "/predict");
						Predicts.save({nuid: wrapObj.nuid, grades: validGrade}, function(data) {
							console.log("Prediction is saved!");
						});	
					});
				});*/

				//console.log(" $scope.account.NUID ngoai = " + $scope.account.NUID);
				// lay cai predict ra, call back function chay xong moi chay cai nay
				var Predicts = $resource('/api/grades/' + $routeParams.course + '/:nuid');
				//var Predicts = $resource('/api/grades/csce235/:nuid');

				Predicts.get({nuid: $scope.account.NUID}, function(data) {

					//console.log(" $scope.account.NUID = " + $scope.account.NUID);

					document.getElementById("predict").innerHTML = data.Predict;


					if (data.Predict == "Good") {
						document.getElementById("predict").setAttribute("color", "green");



					} else if (data.Predict == "OK") {
						document.getElementById("predict").setAttribute("color", "#ecc400");


					} else {
						document.getElementById("predict").setAttribute("color", "red");
						//console.log("hung = hung2");
						//hung = "hung2";
					}			
					
					
				});


			});
			Grade.save(wrapObj, function(grade) {
				Properties.save({filename: wrapObj.course}, function(data) {


					var table = document.getElementById("profileTable");


					while (table.firstChild) {
						table.removeChild(table.firstChild);
					}


					for(var prop in data.list) {
						var tr = document.createElement("tr");
						var td_name = document.createElement("td");
						var td_val = document.createElement("td");
						var name = document.createTextNode(data.list[prop]);
						var val = document.createTextNode(grade[data.list[prop]]);
						var b = document.createElement("B");


						b.appendChild(name);
						td_name.appendChild(b);
						td_val.appendChild(val);
						tr.appendChild(td_name);
						tr.appendChild(td_val);
						table.appendChild(tr);
					}
				});
			});
		});
	}
]);

/*app.controller('EditCtrl', ['$scope', '$resource', '$location', '$routeParams', 
    function($scope, $resource, $location, $routeParams) {
        var Account = $resource('/api/accounts/:username');
        Account.get({username: $routeParams.username}, function(account) {
            $scope.account = account;
        });
        $scope.update = function() {
            Account.save($scope.account, function() {
                $location.path('/student/' + $routeParams.username);
            });
        }
    }
]);*/

