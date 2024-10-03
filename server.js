const express = require("express");
const app = express();

//  port
require("dotenv").config();
const PORT = process.env.PORT || 4000;
//  middleware
app.use(express.json());

// connection to db
require("./config/database").connect();

// route import and mount
const user = require("./router/user");
app.use("/api/v1", user);

// default route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// activate
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})