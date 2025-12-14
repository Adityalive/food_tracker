import mongoose from 'mongoose'

    const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true, // A name is required
    trim: true, // Removes whitespace from both ends of a string
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two users have the same email
    lowercase: true, // Stores the email in lowercase
    trim: true,
      },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Sets the current date/time when the document is created
    immutable: true, // Prevents this field from being updated after creation
  },
 
});

// Create the Mongoose Model from the Schema
const User = mongoose.model('User', UserSchema);

export default User;
