if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express");
const app = express();
const path=require("path");
const ejsmate=require("ejs-mate");
const MongoStore = require('connect-mongo');
const mongoose=require("mongoose");

const dbUrl=process.env.ATLASDB_URL;

const connectionDB=async()=>{
    try {
        await mongoose.connect(dbUrl);
        console.log(`connected to mongodb ${mongoose.connection.host}`);
    } catch (err) {
        console.log("error found",);
    }
}

connectionDB();

main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
  }

app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.set("view engine", "ejs");
app.engine('ejs',ejsmate);
app.set("layout","layouts/boilerplate");
app.use(express.static(path.join(__dirname,"public")));

app.use((err,req,res,next)=>{ 
    console.log(err);
    let {statuscode=500,message="something went wrong"}=err; 
    res.send(message);
  })

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET
    },
    touchAfter:24*3600
  });

  store.on("error",(err)=>{
    console.log("Error in mongo session store",err);
  })
  
//   const sessionOptions={
//     store,
//       secret:process.env.SECRET,
//       resave:false,
//       saveUninitialized:true,
//       Cookie:{
//           expires:Date.now()+7*24*60*60*1000,
//           maxAge:7*24*60*60*1000,
//           httpOnly:true,
//       }
//   }

//   app.use(sessionOptions);


app.get("/portfolio",(req,res)=>{
    res.render("index.ejs");
})

app.listen(3000,(req,res)=>{
    console.log("app is listening on port 3000");
})