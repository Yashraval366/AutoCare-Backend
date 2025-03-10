const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler');
dotenv.config();

const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(errorHandler)
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use("/api/users", require("./Routes/usersRoute"))
app.use("/api/garageown", require('./Routes/garageownerRoutes'))
app.use("/api/garages", require('./Routes/garagesRoute'))

app.get("/", (req, res) => {
    res.send("app is working");
})

app.listen(port, () => {
    console.log(`app is listening on the port http://localhost:${port}`)
})


