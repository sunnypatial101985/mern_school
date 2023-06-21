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
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://schoolapp-ibph.onrender.com/"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);

    next();
});
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