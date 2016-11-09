var http = require('http');
var cors = require('cors');
var _ = require('lodash');
var express = require("express");
var app = express();
var formidable = require('formidable');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var mongodb = require("mongodb");
//Lets define a port we want to listen to
const PORT = 8080;

app.use(cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/uploads')));
app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:63342");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// $inc - increment a particular value by a certain amount
// $set - set a particular value
// $unset - delete a particular field (v1.3+)
// $push - append a value to an array
// $pushAll - append several values to an array
// $addToSet - adds value to the array only if its not in the array already
// $pop - removes the last element in an array
// $pull - remove a value(s) from an existing array
// $pullAll - remove several value(s) from an existing array
// $rename - renames the field
// $bit - bitwise operations
// Retrieve
var db;
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/socialNetworkDB", function(err, db) {
    if(!err) {
        console.log("We are connected");
    }
    var collection = db.collection('users');
    var user = {'name':'u1','pass':'123'};
    collection.insert(user);
});

var users = [];
var messages = [];
var listRequestBeforeApproved = [];
var listRequestAfterApproved = [];
var abouts = [];
var listFriends = [];
var interests = [
    {name: "football"},
    {name: "basketball"},
    {name: "swimming"},
    {name: "comics"},
    {name: "travling"},
    {name: "cooking"},
    {name: "reading"},
    {name: "learning"}
];

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null});
    });
});


// function readFiles(dirname, onFileContent, onError) {
//     fs.readdir(dirname, function(err, filenames) {
//         if (err) {
//             onError(err);
//             return;
//         }
//         filenames.forEach(function(filename) {
//             fs.readFile(dirname + filename, 'utf-8', function(err, content) {
//                 if (err) {
//                     onError(err);
//                     return;
//                 }
//                 onFileContent(filename, content);
//             });
//         });
//     });
// }
// var data = {};
// readFiles('./uploads/', function(filename, content) {
//     data[filename] = content;
//     console.log(data);
// }, function(err) {
//     throw err;
// });

// function getFiles (dir, files_){
//     files_ = files_ || [];
//     var files = fs.readdirSync(dir);
//     for (var i in files){
//         var name = dir + '/' + files[i];
//         if (fs.statSync(name).isDirectory()){
//             getFiles(name, files_);
//         } else {
//             files_.push(name);
//         }
//     }
//     return files_;
// }
//
// console.log(getFiles('uploads'));

app.get('/upload', function (req, res) {

    fs.readdir('./uploads/', function (err, items) {
        // console.log(items);
        res.json(items)
    });
});

function removeDuplicates(arr, prop, prop2) {
    var new_arr = [];
    var lookup = {};

    for (var i in arr) {
        lookup[arr[i][prop][prop2]] = arr[i];
    }

    for (i in lookup) {
        new_arr.push(lookup[i]);
    }

    return new_arr;
}

function GetID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

app.post('/register', function (req, res) {
    var firstname1 = req.body.firstName;
    var lastname1 = req.body.lastName;
    var password1 = req.body.password;
    var username1 = req.body.username;

    var user = {
        id: GetID(),
        firstname: firstname1,
        lastname: lastname1,
        password: password1,
        username: username1,
        about: ''
    };
    for (i = 0; i < users.length; i++) {
        if (firstname1 === users[i].firstname) {
            return res.send(404, 'FirstName already exists');
        }
        if (username1 === users[i].username) {
            return res.send(404, 'Username already exists');
        }
    }
    users.push(user);// push user to array users
    res.json(user);
});

app.post('/login', function (req, res, next) {
    var isLooged = 0;
    var password1 = req.body.password;
    var username1 = req.body.username;
    var foundUser = _.find(users, function (u) {
        return u.password == password1 && u.username == username1;
    });
    if (foundUser) {
        isLooged = 1;
        res.json(foundUser);
    }

    if (isLooged === 0) {
        return next();
    }
});

app.get('/messages/:id', function (req, res) {

    var currentUserID = req.params.id;
    var list = [];

    for (i = 0; i < users.length; i++) {
        list.push(users[i]);
    }

    for (i = 0; i < list.length; i++) {
        if (currentUserID === list[i].id) {
            list.splice(i, 1);
        }
    }
    res.json(list); // send all users to select in messages page
});

app.post('/messages', function (req, res) {

    var id = req.body.id;
    var msg = req.body.message;
    var sender = req.body.sender;
    var date = req.body.date;

    var message = {
        senderMsg: sender,
        id: id,
        messageFromUser: msg,
        date: date
    };
    messages.push(message);
    res.json(messages);
});

app.get('/profile/:id', function (req, res) {
    var result = [];
    var id = req.params.id;

    for (i = 0; i < users.length; i++) {
        if (id === users[i].id) {
            for (j = 0; j < messages.length; j++)
                if (id === messages[j].id) {
                    result.push(messages[j]);
                }
        }
    }
    res.json(result);
});

app.post('/profile', function (req, res) {
    var id = req.body.id;
    var textAbout = req.body.textAbout;

    var valueAbout = {
        id: id,
        text: textAbout
    };
    for (i = 0; i < users.length; i++) {
        if (users[i].id === valueAbout.id) {
            users[i].about = valueAbout.text;
            res.json(users[i].about);
        }
    }
});

app.put('/profile', function (req, res) {
    var id = req.body.id;
    var textAbout = req.body.textAbout;
    console.log(textAbout);

    var valueAbout = {
        id: id,
        text: textAbout
    };
    for (i = 0; i < users.length; i++) {
        if (users[i].id === valueAbout.id) {
            users[i].about = valueAbout.text;
            res.json(users[i].about);
        }
    }
});

app.get('/people-you-may-know/:id', function (req, res) {
    var currentUserID = req.params.id;
    var list = [];
    for (i = 0; i < users.length; i++) {
        list.push(users[i]);
    }
    for (i = 0; i < list.length; i++) {
        if (currentUserID === list[i].id) {
            list.splice(i, 1);
        }
        if (typeof listRequestBeforeApproved[i] !== 'undefined' && listRequestBeforeApproved.length > 0) {
            if (listRequestBeforeApproved[i].sender.id === list[i].id) {
                list.splice(i, 1);
            }
        }
    }
    res.json(list);
});

app.get('/get-all-friend-requests', function (req, res) {
    res.json(listRequestBeforeApproved);
});

app.post('/send-friend-request', function (req, res) {
    var sendRequest = req.body.sendRequest;
    var getRequest = req.body.getRequest;
    var approved = req.body.approved;

    var userSendReq = {
        sender: sendRequest,
        getter: getRequest,
        approve: approved
    };

    listRequestBeforeApproved.push(userSendReq);
    res.json(listRequestBeforeApproved);
});

app.put('/update-list-friends/:id', function (req, res) {
    var userGetRequest = req.params.id;
    var request = req.request;

    for (i = 0; i < listRequestBeforeApproved.length; i++) {
        if (listRequestBeforeApproved[i].getter.id === userGetRequest) {
            listRequestBeforeApproved[i].approve = true;
            listRequestAfterApproved.push(listRequestBeforeApproved[i]);
            listRequestBeforeApproved.splice(i, 1);
            console.log(listRequestBeforeApproved);
        }
    }
    res.json(listRequestAfterApproved);
});

app.get('/listFriends/:id', function (req, res) {
    var userLogged = req.params.id;

    for (i = 0; i < listRequestAfterApproved.length; i++) {
        if (listRequestAfterApproved[i].getter.id === userLogged) {
            listFriends.push(listRequestAfterApproved[i]);
        }
    }
    if (listFriends.length === 0) {
        return res.send(404, "");
    }

    var finalList = removeDuplicates(listFriends, "sender", "id");
    for (i = 0; i < finalList.length; i++) {
        if (finalList[i].getter.id !== userLogged) {
            finalList.splice(i, 1);
        }
    }
    res.send(finalList);
});

// Retrieve
// var MongoClient = require('mongodb').MongoClient;
//
// // Connect to the db
// MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
//     if(!err) {
//         console.log("We are connected");
//     }
// });

app.listen(process.env.PORT || 4730);