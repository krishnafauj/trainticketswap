import getSwapModelByTrainNo from '../model/trainswaprequest.js';
import UserSwapHistory from '../model/UserSwapHistory.js';
import dayjs from 'dayjs';

export const submitSwapRequest = async (req, res) => {
  try {
    const { train_no, date } = req.body;
    const user_id = req.user.id;

    if (!train_no || !date) {
      return res.status(400).json({ error: "train_no and date are required" });
    }

    // Set deletion time (for TTL auto-expiry)
    const deletion_at = dayjs(date).add(5, 'day').toDate();

    // Save the swap request in the correct dynamic collection
    const SwapModel = getSwapModelByTrainNo(train_no);
    const newRequest = await SwapModel.create({
      ...req.body,
      train_no,
      user_id,
      deletion_at,
    });
    // Construct swap history entry (train_no + swap_request_id)
    const swapEntry = {
      swap_request_id: newRequest._id,
      train_no: train_no,
      created_at: new Date(),
    };

    // Find or create the user's swap history
    const historyDoc = await UserSwapHistory.findOne({ user_id });

    if (historyDoc) {
      historyDoc.swap_requests.push(swapEntry);
      await historyDoc.save();
    } 
    else {
      await UserSwapHistory.create({
        user_id,
        swap_requests: [swapEntry],
      });
    }

    res.status(201).json({
      message: "Swap request submitted successfully",
      request_id: newRequest._id,
    });

  } catch (err) {
    console.error("Swap submission error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
