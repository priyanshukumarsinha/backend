// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'

// code to connect to database (using mongoose and DB_NAME from constants.js)
import connectDB from "./db/index.js";

// import app from app.js
import { app } from './app.js';

// Now, we need to config dotenv
dotenv.config({
    path : './env'
})





// connectDB is an async function, so it will return a promise
// hence we can use .then and .catch here to handle the response and error
connectDB()
  .then(
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running at Port ${process.env.PORT}`)
    })
  )
  .catch((error) => {
    console.log("MongoDB Connection Failed :: ", error)
  })

























/*
//----------------------------------------------------------------------------------------------------------------------------
// express
import express from "express";
const app = express();

// to connect to database : using IIFE
(async () => {
  // whenever talking to DB, always use try-catch, since DB might be in another continent
  try {
    // connection
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\nMongoDB Connected !! DB HOST : ${connectionInstance}`)

    // if DB is connected but we get any error while connecting to the app, we handle it like this :
    app.on("error", (error) => {
      console.log("ERROR : ", error);
      throw EvalError;
    });

    // setting up a port
    app.listen(process.env.PORT, () => {
      console.log(`App is Listerning on Port : ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR : ", error);
    throw error;
  }
})();
   //--------------------------------  This is one way to do it : But we will do it in a better way  --------------------------------  
*/