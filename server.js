const express = require('express');
const path = require('path');
const {readFile, writeFile}= require('fs').promises;
const PORT = process.env.PORT || 3001;
const { v4: uuidv4 } = require('uuid');
const app = express();

// Import custom middleware, "cLog"

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard route to direct users to a 404 page
app.get('/api/notes', (req, res) =>
  readFile('db/db.json','utf8')
  .then(db=>{
    res.send(db)
  })
);

app.post('/api/notes', (req, res) =>
  readFile('db/db.json','utf8')
  .then(db=>{
    const parseDb= JSON.parse(db)
    const newNote= {
        title:req.body.title,
        text:req.body.text,
        id:uuidv4()
    }
    parseDb.push(newNote);
    return writeFile('db/db.json',JSON.stringify(parseDb))
  })
  .then(()=>{
    res.json("Note_Added")
  })
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
