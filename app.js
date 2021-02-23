var https = require('https');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
// create application/json parser
var jsonParser = bodyParser.json();
//Base dir
global.__basedir = __dirname;
//=== Point static path to app 
app.use(express.static(__dirname + '/app'));

//=== Get port from environment and store in Express.
var port = process.env.PORT || 900;
app.listen(port, function () {
  console.log("Server Stated ======= in Port", port);
});

//======== Cors Orgin Request Set ========//
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token, authKey ");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

// Reading File service
const fs = require('fs');
const directoryPath = __basedir + "/files/";
const baseUrl = "http://localhost:900/files/";
app.get('/get_filelist', function (req, res, next) {
  // const testFolder = './files';
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).json({ status: false, fileList: [], message: "Unable to fetch files!", });
      return;
    }
    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    // console.log(files, '-------');
    res.status(200).json({ status: true, fileList: fileInfos });
  });
});

app.get('/get_filelist/:filename', function (req, res, next) {
  const fileName = req.params.filename;
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});
