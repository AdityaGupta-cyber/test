const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', authRoutes); 

app.listen(3000, () => {
    console.log("Hey, What's up Dawg!?")
});
