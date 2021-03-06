var express = require('express');
var router = express.Router();


// 连接 mongodb数据库
var MongoClient = require('mongodb').MongoClient;
// 连接到的数据库
var DB_CONN_STR = 'mongodb://localhost:27017/server';

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('halo');
});

// test data
const resData = {
    code: 0,
    data: {
        name: '多多',
        age: 88,
        gender: 'female'
    },
    message: '操作成功',
    status: 'OK',
    success: true
};

let resStatus = {
    code: 0,
    status: 'ok',
    success: true,
    message: '操作成功'
}

/** /users/queryDuoDuo  get **/
router.post('/queryDuoDuo', function (req, res, next) {
    res.send(resData);
});

/** /users/age  post **/
router.get('/age', function (req, res, next) {
    res.send(resData);
});

/** /users/addUser  post */
router.post('/addUser', function (req, res, next) {
    // 此处要连接 mongo 数据库insert数据
    req = req.body;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        insertData(db, req, function (result) {
            // 返回的操作 mongodb的数据
            db.close();
        });
    });
    res.send(resStatus);
})

/** /users/getUsers  get */
router.post('/getUser', function (req, res, next) {
    let id = Number(req.body.id);
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        queryUsers(db, id, function (result) {
            // 返回数据
            // res.status(200);
            // res.json(result);
            resStatus.data = result;
            res.send(resStatus);
            db.close();
        })
    });
})

/** /users/delUsers post */
router.post('/delUser', function (req, res, next) {
    let delName = req.body.name;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        delUser(db, delName, function (result) {
            res.send(resStatus);
            db.close();
        })
    });
})

var insertData = function (db, req, callback) {
    // 定义表 site
    var collection = db.collection('user_base');
    // 表的操作 insert
    req.id = parseInt(new Date().getTime());
    collection.insert(req, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}

var queryUsers = function (db, id, callback) {
    let queryInfo = !!id ? {id: id} : {};
    // 定义表 site
    var collection = db.collection('user_base');
    collection.find(queryInfo).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    })
}

var delUser = function (db, delName, callback) {
    // 定义表 site
    var collection = db.collection('user_base');
    collection.remove({
        name: delName
    }, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    })
}

module.exports = router;