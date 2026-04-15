// require('dotenv').config({Path: './env'})

import dotenv from "dotenv"
import connectDB from "./src/db/index.js"
import app from "./src/app.js"

dotenv.config({
  path : './.env'
})

console.log("CWD:", process.cwd());
console.log("ENV:", process.env.PORT);

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8005, () => {
    console.log(`server is active on http://localhost:${process.env.PORT}`,)
  })
})
.catch((err) => {
  console.log("MONGO DB connection failed !!!",err)
})