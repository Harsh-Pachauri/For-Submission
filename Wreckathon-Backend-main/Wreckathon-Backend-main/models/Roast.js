import mongoose from "mongoose";

const roastSchema = new mongoose.Schema({

  name: { type: String, required: true },
  roastText: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  roastScore: { type: Number, default: 0 },
  imageUrl: { type: String, required: true },   // Cloudinary URL
  imageId: { type: String }                     // Cloudinary public_id (for deleting later if needed)
}, { timestamps: true });

const Roast = mongoose.model("Roast", roastSchema);
export default Roast;
