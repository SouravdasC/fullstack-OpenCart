import mongoose from "mongoose"
import DB_NAME from "../dbName.js"

const connectedDB = async () => {
  try {

    const connectionDb = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
    console.log(`\n monogodb connection host ${connectionDb.connection.host}`)

  } catch (error) {
    console.log(error, "db connection fail")
  }
}

export default connectedDB