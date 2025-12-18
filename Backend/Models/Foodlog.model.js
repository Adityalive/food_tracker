import mongoose from "mongoose";
const { Schema } = mongoose;

const FoodLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  foodName: {
    type: String,
    required: true,
    trim: true,
  },
  portionSize: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
  protein: {
    type: Number,
    required: true,
    min: 0,
  },
  carbohydrates: {
    type: Number,
    required: true,
    min: 0,
  },
  fat: {
    type: Number,
    required: true,
    min: 0,
  },
  fiber: {
    type: Number,
    default: 0,
    min: 0,
  },
  sugar: {
    type: Number,
    default: 0,
    min: 0,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
    default: 'other',
  },
});

const FoodLog = mongoose.model('FoodLog', FoodLogSchema);

export default FoodLog;