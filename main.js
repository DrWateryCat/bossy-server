var express = require("express");
var app = express();
var body_parser = require("body-parser");
var mongoose = require("mongoose");
var Todo = require("./app/models/todo");

//Connect to the MongoDB
var connection_str = "mongodb://el_jefe:StR9G4hspzgM0FL8@cluster0-shard-00-00-va8bw.mongodb.net:27017,cluster0-shard-00-01-va8bw.mongodb.net:27017,cluster0-shard-00-02-va8bw.mongodb.net:27017/todos?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
mongoose.connect(connection_str);

//Set up the JSON stuff
app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

//Function that gets called every time there's a request
router.use((req, res, next) => {
    console.log("Got a request");
    next();
});

//This is for /api/
router.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

router.route('/todo').post((req, res) => {
    //POST /api/todo
    //Insert a todo
    var todo = new Todo();
    todo.title = req.body.title;
    todo.desc = req.body.desc;

    todo.save((err) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json({ id: todo._id });
    });
}).get((req, res) => {
    //GET /api/todo
    //Lists all todos
    Todo.find((err, todos) => {
        if (err) {
            res.send(err);
        }
        res.status(200).json(todos);
    });
});

router.route('/todo/:todo_id').get((req, res) => {
    //GET /api/todo/{todo_id}
    //Get a certain todo by ID
    Todo.findById(req.params.todo_id, (err, todo) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(todo);
        }
    });
}).put((req, res) => {
    //PUT /api/todo
    //Modify a todo
    Todo.findById(req.params.todo_id, (err, todo) => {
        if(err) {
            res.send(err);
        } else {

            todo.title = req.body.title;
            todo.desc = req.body.title;

            todo.save((err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
}).delete((req, res) => {
    //DELETE /api/todo
    //Deletes a todo by ID
    Todo.remove({
        _id: req.params.todo_id
    }, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

app.use('/api', router);

app.listen(port);
console.log("Listening on port " + port);

