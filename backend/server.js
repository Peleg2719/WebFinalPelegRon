const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
//express app
const app = express();


const taskRoutes = require('./routes/tasks')
const userRoutes = require('./routes/users')
//

const path = require("path");
const { fileURLToPath } = require("url");

const correntfilename = __filename
const correntdirname = path.dirname(correntfilename);


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  if (!req.url.endsWith(".js") && !req.url.endsWith(".css")) {
    res.type("text/html");
  }
  next();
});
app.use((req, res, next) => {
  if (req.url.endsWith(".js")) {
    res.type("text/javascript");
  }
  next();
});

app.use(
    '/assets',
    express.static(
      path.join(__dirname, '..', 'frontend', 'build', 'assets')
    )
  );
  app.use(
    express.static(path.join(__dirname, '..', 'frontend', 'build'))
  );
  
  app.get('/index-*.js', function (req, res) {
    res.type('application/javascript');
    res.sendFile(
      path.join(
        __dirname,
        '..',
        'frontend',
        'build',
        'assets',
        req.path
      )
    );
  });




//using the routers with the app
//when we make request to the route then use workoutRoutes
app.use('/api/tasks',taskRoutes)
app.use('/api/users',userRoutes)


//setting the requests as json object
app.use(express.json())

//middleware so we can advance with requests.
app.use((req,res,next)=>{
    console.log(req.path,req.method);
    next();
})

//connect to db
mongoose.connect(process.env.MONGO_URI).then(()=>{
    //listen for requests
    app.listen(process.env.PORT,()=>{
    console.log(`connected to db && Listening on port ${process.env.PORT}`);
});

}).catch((err)=>{
    console.log(err);
})

app.get('*', (req, res) => {
    const filePath = path.join(
      __dirname,
      '..',
      'frontend',
      'build',
      'index.html'
    );
    console.log('File path:', filePath);
    res.sendFile(filePath);
  });