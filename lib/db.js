// const mongoose = require('mongoose');

// // Set up the MongoDB URI from environment or default
// // const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://myhelth:myhelth@cluster0.5b4f2dy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Yugi:Yugi@cluster0.l63lbgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// if (!global.mongoose) {
//   global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   // If there's an existing connection, use it
//   if (global.mongoose.conn) {
//     return global.mongoose.conn;
//   }

//   // Otherwise, create a new connection promise
//   if (!global.mongoose.promise) {
//     global.mongoose.promise = mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 30000
//     }).then((mongoose) => mongoose);
//   }

//   // Await the promise to establish the connection
//   global.mongoose.conn = await global.mongoose.promise;
//   return global.mongoose.conn;
// }

// module.exports = dbConnect;



import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://myhelth:myhelth@cluster0.5b4f2dy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('Connected to MongoDB');
            return mongoose;
        }).catch((err) => {
            console.error('Error connecting to MongoDB', err);
            throw err;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;