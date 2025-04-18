const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

DB_FILE = "db.json";
PORT = 3000;

function readDB() {
	const db = fs.readFileSync(DB_FILE);
	return JSON.parse(db);
}

function writeDB(data) {
	fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req,res) => {
	db = readDB();
	res.status(200).json(db);
});

app.post('/user/find', (req,res) => {
	const { username, password } = req.body;	

	if ( !username || !password ) {
		return res.status(500).send("Lacking fields");
	}

	const db = readDB();
	const user = db.find(u => (u.username === username && u.password === password));
	if (!user) {
		return res.status(404).send("User not found!");
	}

	return res.status(204); //return 200 if found
});

app.post('/user/add', (req,res) => {
	const { username, password } = req.body;	

	if ( !username || !password ) {
		return res.status(500).send("Lacking fields");
	}

	const db = readDB();
	const user = db.find(u => (u.username === username && u.password === password));

	if ( user ) {
		return res.status(400).send("User exists");
	}

	const newUser = { 'username': username, 'password': password };
	db.push(newUser);
	writeDB(db);

	return res.status(200).send(db);
});


app.listen(port=PORT, () => {
	console.log(`Running at port ${PORT}`);
});
