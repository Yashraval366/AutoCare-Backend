const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler');
dotenv.config();

const port = process.env.PORT || 5000;

// middlewares
app.use(express.json())
app.use(cors())
app.use(errorHandler)
app.use("/api/users", require("./Routes/usersRoute"))

app.get("/", (req, res) => {
    res.send("app is working");
})

app.listen(port, () => {
    console.log(`app is listening on the port http://localhost:${port}`)
})