// HUng Chu 

// có 2 tham số: tham số 1 = tên module ta cần tạo; 
// tham số 2: danh sách các dependencies, các modules khác ta cần
// ngResource' + ngRoute = module depend

var voice = {
	file : []
  
  };
  
  
  
  var app = angular.module('Grade', ['ngResource', 'ngRoute']);
  
  
  
  var hung = "hung1";
  
  var course = "hun";

  var studentName = "hchu3";
  var nameArray = [];

  var imageContent = "";

  var Role = "";

  var predict = "";

  var firstName = "";



  
  
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
	  .when('/partials/student2.html', {
		  templateUrl: 'public/student2.html',
		  controller: 'StudCtrl'
	  })
	  .when('/partials/viewGrade1.html', {
		  templateUrl: 'public/viewGrade1.html',
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
  
  //home.html -> controller = LoginCtrl
  app.controller('LoginCtrl', ['$scope', '$resource', '$location',
  
  
  function($scope, $resource, $location) {

// 	console.log($scope.username);
//   console.log(angular.element('username').attr('ng-model'));

  
		  $scope.validate = function() {
			  $scope.username = $scope.username == undefined ? "" : $scope.username;
			  
			  if (($scope.username).trim() == "") {
				  $scope.message = "Username cannot be empty!";
				  return;
			  }
			  var correctPassword = "";
			  var Account = $resource('/api/accounts/:username');
			  console.log(" scope user = ", $scope.username);
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
                        console.log(" scope user = ", $scope.username);
						sessionStorage.setItem('hung', $scope.username);
						var Account = $resource('/api/accounts/:username');
						var Predicts = $resource('/api/grades/csce235/:nuid');
						var Predicts1 = $resource('/api/grades/csce156/:nuid');
						Account.get({username: $scope.username}, function(account) {
			 
							Predicts.get({nuid: account.NUID}, function(data) {
				
						  
									console.log("chay file WAV trc");
								
							
							});

							Predicts1.get({nuid: account.NUID}, function(data) {
				
						  
								console.log("chay file WAV trc");
							
						
						});
				
						});

						// window.location.href = '../partials/action.html';
						window.location.href = 'student2.html';
						//   $location.path('/student/' + $scope.username);
						//   $location.path('action.html');
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
		  NUIDChecked = false;

		  // checkUser
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
					  $scope.message = "Username has already exists!";
					  return;
				  }
				  else {
					  $scope.message = "You can use this username";
					  usernameChecked = true;
				  }
			  });
		  }






		  $scope.checkNUID = function() {
			  console.log("NUID checked = ", $scope.nuid);
			  
			$scope.message = "";
			// $scope.nuid = format($scope.nuid);
			if ($scope.nuid == "") {
				$scope.message = "NUID cannot be empty!";
				return;
			}

			var Account1 = $resource("/api/accounts/hung/:nuid");
			Account1.get({nuid: $scope.nuid}, function(account) {
				console.log("$scope.nuid = ", $scope.nuid);
			  console.log("exist NUID 2");
			  console.log("account.Email trong NUID 2 = ", account.Email);
				if (account.Username != undefined) {
				  console.log("account.Username trong NUID 3 = ", account.Username);
				  console.log("empty NUID 3");
					$scope.message = "NUID has already exists!";
					return;
				}else{
					$scope.message = "You can use this NUID";
					if ($scope.nuid == "95060618"){

						Role = "Professor";

					}else{
						Role = "Student";
					}
					NUIDChecked = true;

				}
			});



		}
  
		  
  
		  // send email 
		  $scope.sendEmail = function() {
			  $scope.message = "";
			  $scope.email = format($scope.email);
			  
			  if (($scope.email).trim() == "") {
				  $scope.message = "You have to enter your email.";
				  return;
			  }
			  
			  // declare trong accounts also -> 
			  var Email = $resource('/api/accounts/register');
			  
			  Email.save({email: $scope.email}, function(data) {
				  correctCode = data.code;
			  });
		  }
		  
		  // verify
		//   $scope.verify = function() {
		// 	  $scope.message = "";
		// 	  if (correctCode == "") {
		// 		  $scope.message = "The confirmation code has not been generated.";
		// 		  return;
		// 	  }
			  
		// 	  // press verify
		// 	  if (($scope.confirmCode).trim() == correctCode) {
		// 		  confirmed = true;
		// 		  $scope.message = "Email confirmed!";
		// 	  } else {
		// 		  $scope.message = "Incorrect code!";
		// 	  }
		 // }
		  
  
		  $scope.reset = function() {
			  document.getElementById("registerForm").reset();
			  $scope.message = "";
		  }
		  
  
		  $scope.regist = function() {
  
			//   var roles = document.getElementsByName("optradio");
			//   var role = "";
			//   for(var i = 0; i < roles.length; i++) {
			// 	  if (roles[i].checked) {
			// 		  role = roles[i].value;
			// 	  }
			//   }
  
			//   if (role == "") {
			// 	  $scope.message = "You need to select your role.";
			// 	  return;
			//   }

			var genders = document.getElementsByName("optradio");
			var gender = "";
			for(var i = 0; i < genders.length; i++) {
				if (genders[i].checked) {
					gender = genders[i].value;
				}
			}

			if (gender == "") {
				$scope.message = "You forget to select your gender!";
				return ;
			}
  
			  $scope.nuid = format($scope.nuid);

			  if ($scope.firstname == "") {
				$scope.message = "First Name required!";
				return ;
			}


			if ($scope.lastname == "") {
				$scope.message = "Last Name required!";
				return ;
			}

			if ($scope.email == "") {
				$scope.message = "Email required!";
				return ;
			}

			if (!usernameChecked) {
				$scope.message = "Please enter and check username!";
				return ;
			}
			if (NUIDChecked != true) {
				$scope.message = "Please enter and check NUID!";
				return ;
			}
			// if ($scope.username == "") {
			// 	$scope.message = "Username required!";
			// 	console.log("empty NUID");
			// 	return  ;
			// }
			// else {
			//   console.log("exist username");
			//   var Account = $resource('/api/accounts/:username');
			//   // check user exist or not
			//   Account.get({username: $scope.username}, function(account) {
			// 	  if (account.Username != undefined) {
			// 		  $scope.message = "Username has already existed!";
			// 		  break;
			// 	  }
			//   });
			// }
  
			//   if ($scope.nuid == "") {
			// 	  $scope.message = "NUID required!";
			// 	  console.log("empty NUID");
			// 	  return;
			//   }
			//   else {
			// 	console.log("exist NUID 1");
			// 	  var Account = $resource("/api/accounts/hung/:nuid");
			// 	  Account.get({nuid: $scope.nuid}, function(account) {
			// 		console.log("exist NUID 2");
			// 		console.log("account.username trong NUID 2 = ", account.Username);
			// 		  if (account.Username != undefined) {
			// 			console.log("account.username trong NUID 3 = ", account.Username);
			// 			  $scope.message = "NUID has already existed!"
			// 			  break ;
			// 		  }
			// 	  });
			//   }
  

			//   if (!confirmed) {
			// 	  $scope.message = "Your email has not been confirmed yet!";
			// 	  return;
			//   }
			  
			  if ($scope.password == undefined || $scope.password == "") {
				  $scope.message = "Password cannot be empty!";
				  return ;
			  }
  
  
			  if ($scope.password != $scope.rpassword) {
				  $scope.message = "Password does not match!";
				  return ;
			  }

			  console.log("NUID CHECK = ", NUIDChecked);


			  var readImageFile = $resource('/api/multipp/readImageFile');
			  
			  readImageFile.save({filename: "imageURL"}, function(data) {

				 image = data.String;
				console.log("data trong register");
				console.log("data trong imageFile=", image);
				var account = {
					"FullName": $scope.firstname + " " + $scope.lastname ,
					"Role": Role,
					"NUID": $scope.nuid,
					"Email": $scope.email,
					"Username": $scope.username,
					"Password": $scope.password,
					"Gender": gender,
					"imageURL":"billGate.jpg",
					"URL": data.String
				};
	
	
				var Accounts = $resource('/api/accounts');
	
				Accounts.save(account, function() {
					alert("You have successfully registered!\nYou will be redirected to the login page.");
					$location.path("/");
				});
				

				
			  });
			  
			//   var account = {
			// 	  "FullName": $scope.firstname + " " + $scope.lastname ,
			// 	  "Role": "Student",
			// 	  "NUID": $scope.nuid,
			// 	  "Email": $scope.email,
			// 	  "Username": $scope.username,
			// 	  "Password": $scope.password,
			// 	  "Gender": gender,
			// 	  "imageURL":"billGate.jpg",
			// 	  "URL": image
			//   };
  
  
			//   var Accounts = $resource('/api/accounts');
  
			//   Accounts.save(account, function() {
			// 	  alert("You have successfully registered!\nYou will be redirected to the login page.");
			// 	  $location.path("/");
			//   });
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
						  addRow(goodList, student["FullName"]);
						  counter[0] += 1;
					  }
					  else if (student.Predict == "OK") {
						  addRow(okList, student["FullName"]);
						  counter[1] += 1;
					  }
					  else if (student.Predict == "High-risk") {
						  addRow(hrList, student["FullName"]);
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
  
			  if ($scope.predictionToRun == "") {
				  $scope.message = "No Predict is chosen.";
				  return;
			  }
  
  
  
			  var Model = $resource('/api/models');
			  Model.save({course: $scope.courseToRun, prediction: $scope.predictionToRun},  function (newdata) {
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
  
  
				  Properties.save({filename: $scope.courseToRun, prediction: $scope.predictionToRun}, function(data) {
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
						  validGrade["FullName"] = thisGrade["Full name"];
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
	    
		  $scope.back = function() {
			//   $location.path("/student/" + $routeParams.username);
			  window.location.href = '/#/';
		  }
  
  
		  var Predict1 = $resource('/api/grades/csce156/:nuid');
		  var Predicts = $resource('/api/grades/csce235/:nuid');
		
  
		  var course1 = "";
		  var course2 = "";
  
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
              var stud = sessionStorage.getItem('hung');

  
			  console.log("stud =" + stud);
  
			  //console.log(" $location.absUrl() = " + $location.absUrl());
  
  
		 // student username
		 // username se thay the boi $routeParams.username
		 // get() trả về đối tượng rỗng và nó chỉ nó được tự động cập nhật khi có data từ phía server trả về.
		  // Tham số thứ 2 trong hàm get() là một callback được gọi khi có data từ phía server trả về.
		 Account.get({username: stud}, function(account) {
			  /*var Params = $resource('/api/models');
			  Params.get(function(data) {
				  console.log(data.params.split(","));
			  });*/
			//   document.getElementById("header").innerHTML = "Your Future " + account.FullName;
		  
			  // console.log(" voice file ban dau = " + voice.file);
			  // console.log(" account.NUID = " + account.NUID);

			  var name = account.FullName;
			  nameArray = name.split(" ");
			  voiceFiles.push(nameArray[0]);
			  firstName = 

			//   if (localStorage.getItem("rhino1") != account.URL){


			// var like = "lala.png";

			// if ( localStorage.getItem("rhino1") != undefined){
				
			
			//   var Image =  $resource('/api/accounts/image/:username/:image');

			//   Image.get({username: stud,image: "hung"}, function(account) {
			// 		console.log("update picture");

			//   });
			// }


			  imageContent = account.URL;

			//   console.log("URL trong gradetest = ",imageContent);

			  console.log("URL trong gradetest = ",account.URL);

			  document.getElementById("header").innerHTML = "Your Future 'You' "; 




			



			 
			  var voice1 = ["high","high"];
			  function removeDuplicateUsingFilter(arr){
				  let unique_array = arr.filter(function(elem, index, self) {
					  return index == self.indexOf(elem);
				  });
				  return unique_array
			  }
			  console.log("unique voice1 = ");
			  console.log(removeDuplicateUsingFilter(voice1));
		  
			  var array = [];
			  Predict1.get({nuid: account.NUID}, function(data) {

				if (data.Predict == undefined){
					return;
				}

				course1 = "csce156";
  
				console.log(" account.NUID = " + account.NUID);
	
				console.log("vao predict");
				
	
				if (data.Predict == "Good") {
					console.log("good");
					voiceFiles.push(nameArray[0]+ "_" + data.Predict);
					array.push(nameArray[0]+ "_" + data.Predict);
					voiceFiles = removeDuplicateUsingFilter(nameArray[0]+voiceFiles);
					predict = "You are good";
	
	
				} else if (data.Predict == "OK") {
				
					console.log("ok");
					voiceFiles.push(nameArray[0]+ "_" + data.Predict);
					array.push(nameArray[0]+ "_" + data.Predict);
					voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					predict = "You are ok";
	
				} else {
					console.log("High-risk");
					array.push(nameArray[0]+ "_" +data.Predict);
					voiceFiles.push(nameArray[0]+ "_" + data.Predict);
					voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					predict = "You are high risk";
					
				}	
				
				console.log(" array = " ,array);
				localStorage.setItem("array", JSON.stringify(array));
				
				localStorage.setItem('voice',voiceFiles);
			  //   console.log(" voiceFiles trong predict = " + voiceFiles);
				
			});
			  Predicts.get({nuid: account.NUID}, function(data) {
  
				  console.log(" account.NUID = " + account.NUID);
	  
				  console.log("vao predict");

				  if (data.Predict == undefined){
					  return;
				  }
				  course2 = "csce235";
				  if (data.Predict == "Good") {
					  console.log("good");
					  voiceFiles.push(data.Predict);
					  array.push(data.Predict);
					  voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					  predict = "You are good";
	  
	  
				  } else if (data.Predict == "OK") {
				  
					  console.log("ok");
					  voiceFiles.push(data.Predict);
					  array.push(data.Predict);
					  voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					  predict = "You are ok";
	  
				  } else {
					  console.log("High-risk");
					  array.push(data.Predict);
					  voiceFiles.push(data.Predict);
					  voiceFiles = removeDuplicateUsingFilter(voiceFiles);
					  predict = "You are high risk";
					  
				  }	
				  
				  console.log(" array = " ,array);
                  localStorage.setItem("array", JSON.stringify(array));
                  
                  localStorage.setItem('voice',voiceFiles);
				  console.log(" voiceFiles trong predict = " + voiceFiles);
				  
			  });
			  
			//   console.log("truoc read image file");
              
			//   var readImageFile = $resource('/api/multipp/readImageFile');
			  
			//   readImageFile.save({filename: "imageURL"}, function(data) {

			// 	var image = data.String;
			// 	console.log("data trong Hung");
			// 	console.log("data trong imageFile=", image);

				

				
			//   });
			  
			//   var Properties = $resource('/api/multipp/properties');
  
  
			//   // userInfo in the UserInfo.txt
			//   Properties.save({filename: "imageURL1"}, function(data) {
			  
			// 	console.log("data trong imageFile= ");
			// 	console.log(data);
			//   });
			  
  
			  //$scope.account = account;
			  //console.log("account =" + account);
			  //console.log("$routeParams.username =" + $routeParams.username);
  
			  var Properties = $resource('/api/multipp/properties');
  
			  //console.log(" Properties = ");
			  //console.log( Properties);
  
			  // userInfo in the UserInfo.txt
			  Properties.save({filename: "UserInfo"}, function(data) {
  
				  var count = 0;

				  console.log("data = ", data);
				  
				  //console.log(data.list);
				  // tìm id của bảng 
				  var table = document.getElementById("profileTable");
  
				  while (table.firstChild) {
					   
					  
					  table.removeChild(table.firstChild);
  
					  
				  }
  
				  for(var prop in data.list) {
  
					  var tr = document.createElement("tr");
					  var td_name = document.createElement("td");
					  var td_val = document.createElement("td");
  
					  var name = document.createTextNode( data.list[prop]);
					  var val = document.createTextNode(account[data.list[prop]]);
					  var b = document.createElement("B");
					 

					//   b.nodeValue =  b.nodeValue + "   " ;

					//   val.nodeValue = "   " + val.nodeValue;

					if ( name.nodeValue ==  "FullName"){
						name.nodeValue = "Full Name";
					}
  
					 console.log("name = ", name);
					 console.log("val = ", val);
					 console.log("b = ", b);
					
					  b.appendChild(name);
					  td_name.appendChild(b);
					  td_val.appendChild(val);

					  console.log("td_val = ",td_val);


					  tr.appendChild(td_name);
					  tr.appendChild(td_val);


					  console.log("tr = ",tr);

					  table.appendChild(tr);	
					  
					  console.log("table = ",table);
				  }		  
			  
			  });
  
		  });
  
  
  
          console.log("scope course = ", $scope.course);
		  
		  $scope.viewGrade = function() {
              
            console.log("scope course = ", $scope.course);
			  if ($scope.course == undefined) {
				  $scope.message = "No course is chosen.";
				  return;
			  }
			  if (course1 == "" && $scope.course == "csce156"){
				$scope.message = "You not enrolled in csce156";
				return;
			  }
			  if (course2 == "" && $scope.course == "csce235"){
				$scope.message = "You not enrolled in csce235";
				return;
			  }
			  if ($scope.course == "csce235"){
					course = "csce235";
					localStorage.setItem("course1", course);
			  }else{
				course = "csce156";
				localStorage.setItem("course1", course);
			  }
              console.log('/student/' + $routeParams.username + "/viewGrade/" + $scope.course);
              localStorage.setItem('course', $scope.course);
              window.location.href = 'viewGrade1.html';
			//   console.log('/student/' + $routeParams.username + "/viewGrade/" + $scope.course);
			//   $location.path('/student/' + $routeParams.username + "/viewGrade/" + $scope.course);
		  
		  }
  
		  
  
  
	  }
	  
  
  ]);
  
  
  //quan tam den cai nay
  app.controller('ViewCtrl', ['$scope', '$resource', '$location', '$routeParams',
 
	  function($scope, $resource, $location, $routeParams) {
  
		  
		  $scope.back = function() {
			//   $location.path("/student/" + $routeParams.username);
			  window.location.href = 'student2.html';
		  }
		var course = localStorage.getItem("course1");
		// var course = "csce156";
		  console.log(" course trong view = " + course);
          $scope.course = course;
  

  
		  var Account = $resource('/api/accounts/:username');
		  var Grade = $resource('/api/grades/:nuid');
		  var Properties = $resource('/api/multipp/properties');
  
		  var voiceFiles = localStorage.getItem('voice');
		  var stud = sessionStorage.getItem('hung');
		 console.log('voiceFile trong view =', voiceFiles);
		 first = false;
  
		 if (course == "csce235"){
			console.log(" trong cs245");
			document.getElementById("text1").innerHTML = "Introduction to Discrete Structures (CSCE 235)";
		 }else{
			document.getElementById("text1").innerHTML = "Introduction to Computer Science II (CSCE 156)";
		 }
  
		  Account.get({username: stud}, function(account) {


			imageContent = account.URL;

			console.log("URL trong gradetest = ",imageContent);


			var name = account.FullName;
			nameArray = name.split(" ");



			document.getElementById("header").innerHTML = "Your Future 'You' ";
  
			  console.log("account123");
              console.log(account);
     
         
			
			var array1 = JSON.parse(localStorage.getItem("array"));

			voiceFiles = array1;



  
			  $scope.account = account;
  
			  var wrapObj = {
				  course: course,
				  nuid: $scope.account.NUID
			  };
			
			console.log(" $scope.account.NUID trong view = " );
				console.log($scope.account.NUID);
              
              var wrapObj = {
                course: course,
                nuid: $scope.account.NUID
            };
  
			var Grades = $resource('/api/grades/' + course);
            //   var Grades = $resource('/api/grades/' + $routeParams.course);
            //   var Grades = $resource('/api/grades/csce235');
			  Grades.get(function(data) {
  
				  var fullGrade = JSON.parse(data.grades);
				  var thisGrade = null;
  
				  console.log(" fullGrade = ");
				  console.log(data.grades);
  
			  
  
				  for(var index in fullGrade) {

  
					  if (fullGrade[index]["SIS User ID"] == $scope.account.NUID) {

						  thisGrade = fullGrade[index];
  
						  console.log("thisGrade = ");
						  console.log(thisGrade);
  
						  break;
					  }
  
				  }
//   console.log("this Grade = ");
//   console.log(thisGrade);
  
				  if (thisGrade == null) {
					  console.log(" this grade = null");
					  $scope.message = "Cannot find your grade!";
					  return;
				  }
			
				
  
				  //console.log(" $scope.account.NUID ngoai = " + $scope.account.NUID);
				  // lay cai predict ra, call back function chay xong moi chay cai nay
				//   var Predicts = $resource('/api/grades/' + $routeParams.course + '/:nuid');
				//   var Predicts = $resource('/api/grades/csce235/:nuid');

		
				  var Predicts = $resource('/api/grades/' + course  + '/:nuid');
  
				  Predicts.get({nuid: $scope.account.NUID}, function(data) {
					console.log(" data.Predict = " );
					//   console.log(" data.Predict = " + data.Predict);

					predict = data.Predict;

				console.log("data.Predict = ", data.Predict);
  
					  document.getElementById("predict").innerHTML = data.Predict;
  
  
					  if (data.Predict == "Good") {
						  document.getElementById("predict").setAttribute("color", "green");
  
  
  
					  } else if (data.Predict == "OK") {
						  document.getElementById("predict").setAttribute("color", "#ecc400");
  
  
					  } else {
						  document.getElementById("predict").setAttribute("color", "red");
					
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
						
						  if (val.nodeValue == "undefined"){
							  val.nodeValue = "N/A";

			
							
						  }

						
						  console.log("val = ", typeof(val.nodeValue));
  
  
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