import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// make an app
const app = express()


// SETTING UP MIDDLEWARES
// to use a middleware or for any configuration setting, we use app.use()
app.use((cors({// cors congig
    // we can also add some options to our cors 
    origin: process.env.CORS_ORIGIN,
    credentials : true,

}))) 

// Now data can come from various types in backend
// maybe from JSON, or from any FORM, etc
// Therefore to config this :
app.use(express.json({limit : "16kb"}))

// 
app.use(express.urlencoded({extended : true, limit : "16kb", }))
// extended : for Nested Objects
app.use(express.static("public"))

// To keep secure Cookies and perform CRUD operation on them : 
// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser())



// ROUTES
// Routes import
import userRouter from './routes/user.routes.js'

// Routes Declaration
app.use("/api/v1/users", userRouter)


// export this app to index.js
export {app}