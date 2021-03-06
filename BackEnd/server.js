const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
res.header("Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept");
next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const mongoose = require('mongoose');

//Connecting to my own Mongo DB Server
const strConnection = 'mongodb+srv://admin:admin@cluster0.ivkbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(strConnection);
}

//Movies String format
const movieSchema = new mongoose.Schema({
    Title:String,
    Year:String,
    Poster:String
});

const movieModel = mongoose.model('movie', movieSchema);

//Gets content to localhost 3000/
app.get('/', (req, res) => {
    res.send('Hello World!')
})

//Posts Movies in the order below and shows 
app.post('/api/movies', (req,res)=>{
    console.log(req.body);
    console.log(req.body.Title);
    console.log(req.body.Year);
    console.log(req.body.Poster);

    movieModel.create({
        Title:req.body.Title,
        Year:req.body.Year,
        Poster:req.body.Poster
    });
    res.send('Data Sent to Server!')
})

//Returns record from data
app.get('/api/movies/:id',(req, res)=>{
    console.log(req.params.id);

    movieModel.findById(req.params.id,(error,data)=>{
        res.json(data);
    })
})

//Deleting data/movies from the database 
app.delete('/api/movies/:id',(req,res)=>{
    console.log('Deleting : '+req.params.id);

    movieModel.deleteOne({_id:req.params.id},
        (error, data)=>{
            if(error)
                res.send(error)
            res.send(data);
        })

})

//Returns record from data and finds id to update
app.put('/api/movies/:id',(req, res)=>{
    console.log('update');
    console.log(req.body);
    console.log("Updating: " + req.params.id);

    movieModel.findByIdAndUpdate(req.params.id, req.body, {new:true},
        (err,data)=>{
            res.send(data);
        })

})

app.get('/api/movies', (req, res) => {
    movieModel.find((err, data)=>{
        res.json(data);
    })
          
           // https://m.media-amazon.com/images/M/MV5BNDQ4YzFmNzktMmM5ZC00MDZjLTk1OTktNDE2ODE4YjM2MjJjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg
      
})


//Listens to the port 4000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})