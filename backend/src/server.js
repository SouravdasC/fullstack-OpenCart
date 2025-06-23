import { app } from "./app.js";
import dotenv from "dotenv"
import connectedDB from "./db/db.js";


dotenv.config(
  {
    path: "./.env"
  }
)

// handling uncaught error exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`)
  process.exit(1)
})




const port = process.env.PORT || 3000

//db connectd
connectedDB()
  .then(() => {
    const serverPort = app.listen(port, () => {
      console.log(`server running at http://localhost:${port}`)
    })
})
  .catch((err) => {
    console.log(`Error: ${err.message}`)
    process.exit(1)
  })


  



