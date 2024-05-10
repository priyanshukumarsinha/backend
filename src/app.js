import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// make an app
const app = express()

// to use a middleware or for any configuration setting, we use app.use()
app.use((cors({// cors congig
    // we can also add some options to our cors 
    origin: process.env.CORS_ORIGIN,
    credentials : true,
    
}))) 



// export this app to index.js
export {app}