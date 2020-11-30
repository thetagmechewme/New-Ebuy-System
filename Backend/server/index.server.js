const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { readdirSync } = require('fs');


//ENV config
env.config();

//MongoDB Local Connection
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(error => console.log(`DB Connection error: ${error}`))


//Imported Routes
// const authRouter = require('./routes/auth.route');

//App Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());

//Route Middleware
// app.use('/api', authRouter);

//Routes Auto-loading
readdirSync('./routes').map(r);
function r(r) {
    return app.use('/api', require('./routes/' + r));
}

//Server port listen
app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`);
});
