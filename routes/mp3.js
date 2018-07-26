#!/usr/bin/env nodejs
/**
 * Created by enrico on 29/06/17.
 */
var express = require('express');
var router = express.Router();

var texttomp3 = require("./index");
var fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
//let track = 'hello.mp3';//your path to source file



router.post('/mp3File', function(req, res) {

var text = "You are good";
var fn = "good";





console.log("text = ",text);
console.log("fn = ",fn);

let track = fn + '.mp3';//your path to source file

if(typeof text ===  "undefined" || text === ""
  || typeof fn === "undefined" || fn === "") { // just if I have a text I'm gona parse
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

ffmpeg(track)
.toFormat('wav')
.on('error', (err) => {
    console.log('An error occurred: ' + err.message);
})
.on('progress', (progress) => {
    // console.log(JSON.stringify(progress));
    console.log('Processing: ' + progress.targetSize + ' KB converted');
})
.on('end', () => {
    console.log('Processing finished !');
})
.save('./' + fn + '.env');//path where you want to save your file

});

module.exports = router;