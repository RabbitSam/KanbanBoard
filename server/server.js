const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const dbURI = process.env.DBURI;
const port = process.env.port;

// Body Parser middleware setup
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes setup
app.use("/api/sign-up", require("./paths/signUp"));
app.use("/api/sign-in", require("./paths/signIn"));
app.use("/api/boards", require("./paths/boards"));
app.use("/api/isUserAuth", require("./paths/isUserAuth"));

// Connect DB
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    // Only listen for requests once the database is live
    app.listen(port, () => console.log("Hello darkness my old friend"));
}).catch(err => console.log(err));