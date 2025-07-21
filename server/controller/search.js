import Signupuser from "../models/usersignup.js";

const search = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }
    const searchResults = await Signupuser.find({
      email: { $regex: keyword, $options: 'i' } 
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default search;
