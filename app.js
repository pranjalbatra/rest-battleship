require('dotenv').config();
const express = require('express')
const apiRouter = require('./routers/api')
var cors = require('cors');
const port = process.env.PORT || 5000
require('./db/db')

const app = express()
app.use(cors());

app.use(express.json())
app.use(apiRouter)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

module.exports = app;