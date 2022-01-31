/////////////////////// Dependecies ///////////////////
// get env 
require ('dotenv').config()

// pull port from .env setting port as a default 
// port is equal to 3001 if process.env doesn't return anything, but if it doesn't return proccess.env
//pull out from env the databse_url
const {PORT = 3001, DATABASE_URL } = process.env

//if in interview = exporting express and express is a function and we are calling that function which we are storing in an app
//import express from 'express'
const express = require ('express')
//create application procces 
const app =express()

//connect to mongoose 
const mongoose=require('mongoose')

//import middleware , stands between request and response req -> middle -> route -> resp
const cors = require ('cors')
// logs all the actions that are being used by the server 
const morgan = require ('morgan')

//Establish connection
mongoose.connect(DATABASE_URL)

// give me a message that my server started and that the database connects seemlessly 
mongoose.connection
    .on ("open", () => console.log ("You are connected to MongoDB"))
    .on ("close", () => console.log ("You are disconnected from MongoDB")) 
    .on ("error", (error) => console.log (error))

//Model 

//Type of data we want 

const RobinhoodSchema=new mongoose.Schema({
    name: String,
    openPrice: Number,
    closePrice: Number
})

//The model creates a corresponding collection called robinhood

const Robinhood = mongoose.model('Robinhood',RobinhoodSchema)

//MidlleWare
app.use(cors())
app.use(morgan('dev')) //morgan has selver options in the 
app.use (express.json()) //we need to parse json when it sent back and fort because it is sending a string of code
//JSON parse ("{"person" : "Joe"}) => {person : Joe }



/////////////// Test Route /////////////////////////////
app.get ('/', (req,res) => {
    res.send ('hello world')
})



////// Watch List page //////////
// async and await go hand in hand 
app.get('/watchlist' , async(req,res) => {
    try {                               //try this if it doesn't work catch this
       
        res.json (await Robinhood.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//Robinhood index route - POST (work wit APIs )
app.post('/watchlist' , async(req,res) => {
    try {
        res.json (await Robinhood.create(req.body))

    } catch (error) {
        res.status(400).json(error)
    }

})


//Robinhood delete route 
app.delete('/watchlist/:id' , async(req,res) => {
    try {
        res.json (await Robinhood.findByIdAndDelete(req.params.id))

    } catch (error) {
        res.status(400).json(error)
    }
})

//Robinhood update route
app.put('/watchlist/:id' , async(req,res) => {
    try {
        res.json (await Robinhood.findByIdAndUpdate(req.params.id, req.body))

    } catch (error) {
        res.status(400).json(error)
    }
})

//Listen to app in terminal/////////////////////////

app.listen (PORT, () => console.log (`listening on port ${PORT}`))
