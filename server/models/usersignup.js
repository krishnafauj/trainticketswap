import mongoose from 'mongoose';
const signupSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  }
  
}, 
{
  timestamps: true  
});
const Signupuser = mongoose.model('user', signupSchema);
export default Signupuser;