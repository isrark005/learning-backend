const express = require('express');
const jwt = require("jsonwebtoken")
const app = express();
const mongoose = require("mongoose");
const { UserModel } = require('./db');

mongoose.connect("mongodb+srv://isrark005:xOr2VzmQAIGzKBRF@cluster0.da83u.mongodb.net/todo-app-database")
app.use(express.json());
const JWT_SECRET = "myJWTpassowrd"

app.post('/signup', async function (req, res) {
    const createUser = await UserModel.create(req.body);
    if (createUser) res.json(createUser);
})


app.post('/signin', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            if (user.password === password) {
                const token = jwt.sign({
                    userId: user._id.toString(),
                    userName: user.name
                }, JWT_SECRET);

                if (token) res.status(200).json({
                    message: "login successfully!",
                    token
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
})

app.get('/my-name', auth, async function(req, res) {
    const email = req.params.email;
    
    if(email){
        const foundIt = await UserModel.findOne({email})
        foundIt && res.json({name: foundIt.name})
    }
})


function auth(req, res, next) {
    const token = req.headers?.token;

    if(token){
        const decodeToken = jwt.verify(token, JWT_SECRET);
        res.json({
            decodeToken
        })
        next();
    }else{
        res.json({
            message: "Authentication Problem"
        })
    }
}


app.listen(3000);