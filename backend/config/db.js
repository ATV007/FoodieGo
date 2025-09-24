import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('//mongodb+srv://atv907thanish_db_user:root1234@cluster0.yzzeumc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
       console.log('DB connected') ;
    })
}