

const express = require ('express');
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require ('body-parser')
const connectDB = require ('./config/db.js');
const User = require ('./models/user.js');
const { generateToken,verifyToken} = require("./utils/auth");





const app = express();
connectDB();

const path = require("path"); // important
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); 

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));//If you want to link CSS/JS files



//routes
app.get("/", (req, res) => {
  res.send("Welcome to the page👍");
});

// Login routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find the user first
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // create token
    const token = generateToken(user);

    // store in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

        res.redirect("/dashboard");

  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
});


// Register routes
app.get("/register",async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try{
    const {name,email,password} = req.body;

  const hashedPassword = await bcrypt.hash(password,10);

  await User.create({
      name,
      email,
      password: hashedPassword,
    });
     
    // redirect after successful signup
    res.redirect("/login");

    // res.status(201).json({ message: "User registered successfully" });
    
  }catch(err){
    res.status(500).json({message:"some server error"})
  }
  
});



// Dashboard route
app.get("/dashboard",verifyToken, (req, res) => {
  res.render("dashboard",{ user: req.user });
});


 app.listen(8080,()=>{
    console.log("server is connected on port 8080");
});
           
