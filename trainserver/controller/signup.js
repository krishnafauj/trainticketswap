
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; // ✅ Add this import
import User from "../model/user.js";
const signup = async (req, res) => {
  try {
    const { email, password,name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user_id = uuidv4(); 
    console.log(user_id);
    const user = new User({ email, password: hashedPassword, user_id,name });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default signup;
