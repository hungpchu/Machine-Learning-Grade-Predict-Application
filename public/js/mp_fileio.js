var faceFiles = ["face0.bin", "face1.bin", "face2.bin", "face3.bin", "face4.bin", "face5.bin"];
var hairDirs = ["hair0.bin", "hair1.bin", "hair2.bin", "hair3.bin", "hair4.bin"];
var voiceFiles = [];
var cosmeCheeks = ["000","001","002","003","004","005"];
var cosmeEyes = ["000","001","002","003","004","005"];
var cosmeLips = ["000","001","002","003","004"];
var beardDirs = ["beard0.bin", "beard1.bin", "beard2.bin", "beard3.bin"];
var glassesDirs = ["glasses0.bin", "glasses1.bin", "glasses2.bin", "glasses3.bin", "glasses4.bin"];
var animDirs  = ["anim0", "anim1"];
var first = true;
console.log("voiceFiles trong lib = ", voiceFiles);

var MpFS = {
  prepareResource : (function(dir){
    FS.createFolder(
        '/',
        '/temp',
        true,
        true
    );
    FS.createPreloadedFile(
        '/temp',
        'tempface.bin',
        MpConfig["documentPath"] + 'temp/tempface.bin',
        true,
        true
    );
  
    FS.createPreloadedFile(
        '/items',
        'faceanim.txt',
        MpConfig["documentPath"] + 'items/faceanim.txt',
        true, 
        false 
    );    

    FS.createPath(
        '/',  
        '/items/face',
        true, 
        false
    );
    faceFiles.forEach(function (arg) {
      FS.createPreloadedFile(
        '/items/face',
        arg,
        MpConfig["documentPath"] + 'items/face/'+arg,
        true, 
        false 
      );
    });

    FS.createPath(
        '/',  
        '/items/hair',
        true, 
        false
    );
    hairDirs.forEach(function (arg) {
      FS.createPreloadedFile(
        '/items/hair',
        arg,
        MpConfig["documentPath"] + 'items/hair/'+arg,
        true, 
        false 
      );    
    });

    animDirs.forEach(function (arg) {
      FS.createPath(
        '/',
        '/items/anim/'+arg,
        true,
        false
      );
      FS.createPreloadedFile(
        '/items/anim/'+arg,
        'anim.ani2',
        MpConfig["documentPath"] + 'items/anim/'+arg+'/anim.ani2',
        true,
        false
      );
      FS.createPreloadedFile(
        '/items/anim/'+arg,
        'anim.txt',
        MpConfig["documentPath"] + 'items/anim/'+arg+'/anim.txt',
        true,
        false
      );
      FS.createPreloadedFile(
        '/items/anim/'+arg,
        'anim.mp3',
        MpConfig["documentPath"] + 'items/anim/'+arg+'/anim.mp3',
        true,
        false
      );
    });

    FS.createPath(
        '/',  
        '/items/beard',
        true, 
        false
    );
    beardDirs.forEach(function (arg) {
      FS.createPreloadedFile(
        '/items/beard',
        arg,
        MpConfig["documentPath"] + 'items/beard/'+arg,
        true, 
        false 
      );    
    });

    FS.createPath(
        '/',  
        '/items/glasses',
        true, 
        false
    );
    glassesDirs.forEach(function (arg) {
      FS.createPreloadedFile(
        '/items/glasses',
        arg,
        MpConfig["documentPath"] + 'items/glasses/'+arg,
        true,
        false
      );
    });

    // FS.createPath(
    //     '/',
    //     '/items/voice',
    //      true,
    //      false
    // );
    // voiceFiles.forEach(function (arg) {
    //   // FS.createPreloadedFile(
    //   //   '/items/voice',
    //   //   arg+',mp3',
    //   //   MpConfig["documentPath"] + 'items/voice/'+arg+'.mp3',
    //   //   true,
    //   //   false
    //   // );
    //   console.log("trong fileio");
    //   // console.log("voce file trong fileIO = ", voice.file);
    //   // console.log('arg = ', arg);
    //   console.log('voiceFiles trong fileio = ', voiceFiles);
    //   FS.createPreloadedFile(
    //     '/items/voice',
    //     arg+'.env',
    //     MpConfig["documentPath"] + 'items/voice/'+arg+'.env',
    //     true,
    //     false
    //   );
    // });

    cosmeCheeks.forEach(function (arg) {
        FS.createPath(
          '/',
          '/items/cosme/cheek/'+arg,
          true,
          false
        );
        FS.createPreloadedFile(
          '/items/cosme/cheek/' + arg,
          'cosme.csm',
          MpConfig["documentPath"] + 'items/cosme/cheek/'+arg+'/cosme.csm',
          true,
          false
        );
    });
    cosmeEyes.forEach(function (arg) {
        FS.createPath(
          '/',
          '/items/cosme/eye/'+arg,
          true,
          false
        );
        FS.createPreloadedFile(
          '/items/cosme/eye/' + arg,
          'cosme.csm',
          MpConfig["documentPath"] + 'items/cosme/eye/'+arg+'/cosme.csm',
          true,
          false
        );
    });
    cosmeLips.forEach(function (arg) {
        FS.createPath(
          '/',
          '/items/cosme/lip/'+arg,
          true,
          false
        );
        FS.createPreloadedFile(
          '/items/cosme/lip/' + arg,
          "cosme.csm",
          MpConfig["documentPath"] + 'items/cosme/lip/'+arg+'/cosme.csm',
          true,
          false
        );
    });

    FS.createPath(
      '/',
      '/items/voice',
       true,
       false
  );
  voiceFiles.forEach(function (arg) {
    // FS.createPreloadedFile(
    //   '/items/voice',
    //   arg+',mp3',
    //   MpConfig["documentPath"] + 'items/voice/'+arg+'.mp3',
    //   true,
    //   false
    // );
    console.log("trong fileio");
    // console.log("voce file trong fileIO = ", voice.file);
    // console.log('arg = ', arg);
    console.log('voiceFiles trong fileio = ', voiceFiles);
    FS.createPreloadedFile(
      '/items/voice',
      arg+'.env',
      MpConfig["documentPath"] + 'items/voice/'+arg+'.env',
      true,
      false
    );
  });

  }),
//  addVoice: function (var text){
//     voiceFiles.push(text);
//   },
};

// function hung ($scope, $resource, $routeParams, $location) {


//   var Predicts = $resource('/api/grades/csce235/:nuid');


  

//     // route den file accounts.js 
//     var Account = $resource('/api/accounts/:username');


//    Account.get({username: $routeParams.username}, function(account) {
//           /*var Params = $resource('/api/models');
//           Params.get(function(data) {
//               console.log(data.params.split(","));
//     });*/

  
//     console.log(" voice file ban dau = " + voice.file);
//     console.log(" account.NUID = " + account.NUID);
//     //voice.file.push("high-risk");
//     console.log("voiceFiles = ", voiceFiles);

//     Predicts.get({nuid: account.NUID}, function(data) {

//       //console.log(" $scope.account.NUID = " + $scope.account.NUID);



//       if (data.Predict == "Good") {
//         console.log("good");
//         voice.file.push("good");
//         predict = "You are good";


//       } else if (data.Predict == "OK") {
      
//         console.log("ok");
//         voice.file.push("ok");
//         predict = "You are ok";

//       } else {
//         console.log("high-risk");
//         voice.file.push("high-risk");
//         predict = "You are high risk";
        
//       }	
//       // console.log(" voice file luc sau = " + voice.file);
      
//     });
    

   

//   });

    

  


// }