require('dotenv').config()
const express = require('express')
const app = express(); 
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const encrypt = require("mongoose-encryption")

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))




mongoose.connect('mongodb://localhost:27017/userDB',  { useNewUrlParser: true, useUnifiedTopology: true} )


const userSchema = new mongoose.Schema({
    email: String, 
    password: String
})


userSchema.plugin(encrypt, { secret: process.env.DB_SECRET, encryptedFields: ["password"] });




const User = mongoose.model('User', userSchema)





app.get('/', function(req, res ) {
    res.render('home')
})
/////////////////////////////////////////////////////////REGISTER////////////////////////////////////////////////////////
app.get('/register', function(req, res ) {
    res.render('register')
})

app.post('/register', function(req, res) {
    const email = req.body.username
    const password = req.body.password

    const newUser = new User({
        email: email, 
        password: password
    })

    newUser.save(function(err) {
        if(!err) {
            res.render('secrets')
        } else {
            console.log('There was an error creating your account')
        }
    })

})


/////////////////////////////////////////////////////////LOGIN///////////////////////////////////////////////////////////


app.get('/login', function(req, res ) {
    res.render('login')
})

app.post('/login', function(req, res) {
    const email = req.body.username
    const password = req.body.password

    User.findOne({email: email}, function(err, foundUser) {
        if(err) {
            console.log(err)
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
      
    })
    
})


/////////////////////////////////////////////////////////SECRETS///////////////////////////////////////////////////////////














app.listen(3000, function(req, res) {
    console.log('Your server has started on port 3000')
})