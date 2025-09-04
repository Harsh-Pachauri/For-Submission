import Roast from "../models/Roast.js";

// @desc Create a roast entry
export const createRoast = async (req, res) => {
  try {
    const { name, age, gender, upvotes, roastText, roastScore } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const rScore = Number(roastScore);
    const roast = new Roast({
      name,
      age,
      gender,
      upvotes,
      roastText,
      roastScore: rScore,
      imageUrl: req.file.path,         // Cloudinary auto-provides URL
      imageId: req.file.filename       // Cloudinary public_id
    });

    await roast.save();
    res.status(201).json(roast);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all roasts
export const getRoasts = async (req, res) => {
  try {
    const roasts = await Roast.find().sort({ createdAt: -1 });
    res.json(roasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Increment upvotes of a roast
export const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;

    const roast = await Roast.findById(id);
    if (!roast) {
      return res.status(404).json({ message: "Roast not found" });
    }

    roast.upvotes = (roast.upvotes || 0) + 1; // increment upvotes
    await roast.save();

    res.json({ message: "Upvote added", upvotes: roast.upvotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
