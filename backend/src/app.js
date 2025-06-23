import express from "express"
import cookieParser from "cookie-parser"
import { error } from "./middlewares/error.js"
import cors from 'cors';

const app = express()

// Environment-based CORS configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://fullstack-open-cart-dn9j.vercel.app"] // ✅ Replace with your actual Vercel domain
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())






// import routes 
import productRouter from "./routes/product.routes.js"
import userRouter from "./routes/user.routes.js"
import orderRouter from "./routes/order.routes.js"
import paymentRouter from "./routes/payments.routes.js"
import dashboradRouter from "./routes/dashboard.routes.js"
import contactdRouter from "./routes/contact.routes.js"



//product
app.use("/api/v1", productRouter)

//user
app.use("/api/v1", userRouter)

//Order
app.use("/api/v1", orderRouter)

// for payment process
app.use('/api/v1', paymentRouter)

// for admin dashboard
app.use("/api/v1/", dashboradRouter)

//for contact
app.use('/api/v1', contactdRouter)


app.use(error)

export { app }

