// Require necessary modules
const fs = require("fs");
const path = require("path");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize db by reading the contents of db.json file
let db = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "db.json")));

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON data
app.use(express.json());

// API endpoint to read notes from db.json
app.get("/api/notes", (req, res) => {
  res.json(db);
});

// API endpoint to save a new note to db.json
app.post("/api/notes", (req, res) => {
  // Create a new note and add it to the db array
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate a unique ID
  db.push(newNote);

  // Save the updated db array to the db.json file
  fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(db));

  // Respond with the updated db array
  res.json(db);
});

// API endpoint to delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  // Filter out the note with the given ID from the db array
  db = db.filter((note) => note.id !== noteId);

  // Save the updated db array to the db.json file
  fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(db));

  // Respond with the updated db array
  res.json(db);
});

// Serve the notes.html page when the "/notes" route is requested
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Catch-all route for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
