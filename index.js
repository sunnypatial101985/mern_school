import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
const app = express()
app.use(cors())
import bodyParser from 'body-parser';
import connectDb from './db/connection.js';
import api from './api/api.js'
const port = process.env.PORT;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())
    // CONNECT DATABASE
connectDb(process.env.DB_URL + '/' + process.env.DB_NAME)
    // INCLUDE api's
app.use('/api', api)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, './school/build')))

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './school/build/index.html'))
})

app.listen(port, () => {

})