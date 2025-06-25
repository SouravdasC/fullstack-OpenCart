import express from "express"
import cookieParser from "cookie-parser"
import { error } from "./middlewares/error.js"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express()

// Environment-based CORS configuration
const allowedOrigins = [
'http://localhost:5173',
  'https://fullstack-open-cart.vercel.app',
  'https://fullstack-opencart-1.onrender.com',
  /^https:\/\/fullstack-open-cart-git-[\w-]+-souravdascs-projects\.vercel\.app$/ 
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

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
app.use("/api/v1", dashboradRouter)

//for contact
app.use('/api/v1', contactdRouter)

// 🛠 React frontend serving + SPA fallback
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist'))); // adjust if needed
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}



app.use(error)

export { app }

