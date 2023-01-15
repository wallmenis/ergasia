const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.port || 4000;

app.use(express.static(__dirname + "/client"));
app.use(favicon(path.join(__dirname, "client", "favicon.png")));

//AUTH CODE
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const users = { user1: "password1", user2: "password2", 1: "1" };

app.post("/login", (req, res) => {
  // get username from the client form data
  const username = req.body.username;
  const password = users[username];
  if (password === req.body.password) {
    jwt.sign({ username: username }, "secretkey", (err, token) => {
      res.status(200).json(token);
    });
  } else {
    res.sendStatus(401);
  }
});

function isAuthenticated(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, "secretkey", (err, authData) => {
      if (err) res.sendStatus(403);
      else if (users[authData?.username]) next();
      else res.sendStatus(403);
    });
  } else {
    res.sendStatus(403);
  }
}
/*app.get("/api/data", isAuthenticated, function (req, res) {
  var data = [
    { name: "Nick", age: 21 },
    { name: "Maria", age: 22 },
  ];
  res.status(200).send(JSON.stringify(data));
});*/



//DB CODE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ThingWithId
{
  constructor(id,name)
  {         
    this.id;
    this.name;
  }
}

class Link extends ThingWithId
{
  constructor(id,name,urlthing)
  {         
    super(id,name);
    this.urlthing;
  }
}

class Work extends ThingWithId
{
  constructor(id,name,description,date)
  {         
    super(id,name);
    this.description;
    this.date;
  }
}

let linksFile = __dirname + '/content/links.json';

//app.get('/api/links', isAuthenticated, (req, res) => getSthings(req, res, linksFile));
app.get('/api/links', (req, res) => getSthings(req, res, linksFile));
//app.get('/api/links/:id', isAuthenticated, (req, res) => getSth(req, res, linksFile));
app.get('/api/links/:id', (req, res) => getSth(req, res, linksFile));
app.post('/api/links', isAuthenticated, (req, res) => addSth(req, res, linksFile, Link));
app.put('/api/links/:id', isAuthenticated, (req, res) => updateSth(req, res, linksFile, Link));
app.delete('/api/links/:id', isAuthenticated, (req, res) => deleteSth(req, res, linksFile));

let worksFile = __dirname + '/content/works.json';

//app.get('/api/works', isAuthenticated, (req, res) => getSthings(req, res, worksFile));
app.get('/api/works', (req, res) => {
  getSthings(req, res, worksFile);
  console.log("GotSomeStuff");
});
//app.get('/api/works/:id', isAuthenticated, (req, res) => getSth(req, res, worksFile));
app.get('/api/works/:id', (req, res) => {
  getSth(req, res, worksFile)
  console.log("GotAnId");
});
app.post('/api/works', isAuthenticated, (req, res) => {
  addSth(req, res, worksFile, Work);
  console.log("AddedSomething");
});
app.put('/api/works/:id', isAuthenticated, (req, res) => updateSth(req, res, worksFile, Work));
app.delete('/api/works/:id', isAuthenticated, (req, res) => deleteSth(req, res, worksFile));


function getSthings(req, res, daFile) {
	fs.readFile(daFile, function (err, data) {
		let things = [];
    
		if (!err) {
      things = JSON.parse(data);
      //console.log("HereIn");
    }
		res.status(200).json(things);
	});
}

function getSth(req, res, daFile) {
  
	const id = parseInt(req.params.id);
	fs.readFile(daFile, function (err, data) {
		let things = [];
		if (!err) things = JSON.parse(data);
		res.status(200).json(things.filter(p => p.id === id));
	});
}

function addSth(req, res, daFile, classtype) {
  let linkCopy = new Link();
  let workCopy = new Work();
  console.log("HERE", classtype);
  let id = req.body.id;
  linkCopy.id = parseInt(req.body.id);
  linkCopy.name = req.body.name;
  linkCopy.urlthing = req.body.urlthing;
  workCopy.id = parseInt(req.body.id);
  workCopy.name = req.body.name;
  workCopy.description = req.body.description;
  workCopy.date = req.body.date;
  console.log("req.body: "+req.body.id, req.body.name, req.body.urlthing);
	
	fs.readFile(daFile, function (err, data) {
		let things = [];
		if (!err) things = JSON.parse(data);
    if (linkCopy instanceof classtype)
    {
      things.push(linkCopy);
    }
		else
    {
      things.push(workCopy);
    }
		fs.writeFile(daFile,JSON.stringify(things),function(err){
				if (err){
					res.status(200).json(`Error adding id: ${id}`);
				}
				else{
					res.status(200).json(`Data added with id: ${id}`);
				}
			});
	});
}

function updateSth(req, res, daFile, classtype) {
  let linkCopy = new Link();
  let workCopy = new Work();
	if (linkCopy instanceof classtype)
  {
    const { id, name, urlthing } = req.body;
    const newThing = {id:parseInt(id), name, urlthing};
  }
  else if (linkCopy instanceof classtype)
  {
    const { id, name, description, date } = req.body;
    const newThing = {id:parseInt(id), name, description, date};
  }

	fs.readFile(daFile, function (err, data) {
		let things = [];
		if (!err) things = JSON.parse(data);
		const THEIndex = things.findIndex(p=>p.id===aPerson.id);
		if (THEIndex < 0 ) {
			res.status(200).json(`Cannot find ID: ${id}`);
			return;
		}
		things[THEIndex] = aThing;
		fs.writeFile(daFile,JSON.stringify(things),function(err){
				if (err){
					res.status(200).json(`Error updating id: ${id}`);
				}
				else{
					res.status(200).json(`Updated id: ${id}`);
				}
			});
	});
}

function deleteSth(req, res, daFile) {
  
	const id = parseInt(req.body.id)
	fs.readFile(daFile, function (err, data) {
		let things = [];
		if (!err) things = JSON.parse(data);
		const THEIndex = things.findIndex(p=>p.id===id);
		if (THEIndex < 0 ) {
			res.status(200).json(`Cannot find ID: ${id}`);
			return;
		}
		things.splice(THEIndex, 1)
		fs.writeFile(daFile,JSON.stringify(things),function(err){
				if (err){
					res.status(200).json(`Error deleting id: ${id}`);
				}
				else{
					res.status(200).json(`Deleted id: ${id}`);
				}
			});
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, function () {
  console.log("Server listening at port " + port);
});
