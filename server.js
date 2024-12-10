const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config()


connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json())
app.use("/api/contacts", require("./routes/contactRouter"));
app.use("/api/users", require("./routes/userRouter"));
app.use(errorHandler)

app.listen(port, () => {
    console.log(`listen to port ${port}`)
})