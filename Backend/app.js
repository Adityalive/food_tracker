import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import user from "./Routers/User.route.js";
import uploadRoutes from "./Routers/upload.route.js"
connectDB();

const app =express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({"message":"hi"});
});
app.use("/api/auth",user);

app.use("/api/upload", uploadRoutes); // NEW

// Error handling middleware for multer errors
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }    }
    
    if (error.message) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    return res.status(500).json({
        success: false,
        message: 'An error occurred'
    });
});

app.listen(3000,()=>{
    console.log("Server is working")
})