import Signupuser from "../models/usersignup.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; // ✅ Add this import

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await Signupuser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user_id = uuidv4(); // ✅ Match your schema
    console.log(user_id);
    const user = new Signupuser({ email, password: hashedPassword, user_id });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default signup;
