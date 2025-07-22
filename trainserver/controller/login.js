import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.js";

const JWT_SECRET = "your_jwt_secret"; 

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }


    console.log(user.user_id);
    const token = jwt.sign(
      {
        id: user._id,
        email,
        user_id: user.user_id,
        
      },
      JWT_SECRET,
      {
        expiresIn: "4d", 
      }
    );

    res.status(200).json({
      message: "Login Successful",token, user: 
      {
        id: user._id,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default login;
