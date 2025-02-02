//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt =require("mongoose-encryption");

const app=express();

console.log(process.env.API_KEY);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

const userSchema= new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields:["password"]});


const User=new mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
      const newUser = new User({
        email: req.body.username,
        password: req.body.password,
      });
  
      await newUser.save();
      res.render("secrets"); // Assuming you have a view named "secrets"
    } catch (err) {
      console.error(err);
      res.status(500).send("Error while registering the user.");
    }
  });

  app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    try {
      const foundUser = await User.findOne({ email: username });
  
      if (foundUser && foundUser.password === password) {
        res.render("secrets"); // Assuming you have a view named "secrets"
      } 
      else {
        res.status(401).send("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
    //   res.status(500).send("Error while processing login");
    }
  });

//   app.post("/login", async (req, res) => {
//     const username = req.body.username;
//     const password = md5(req.body.password);
  
//     try {
//       const foundUser = await User.findOne({ email: username });
  
//       if (foundUser && foundUser.password === password) {
//         res.render("secrets");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   });
  
  

app.listen(3000, function(){
    console.log("Server started on port 3000");

});
