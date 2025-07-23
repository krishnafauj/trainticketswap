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

    const deletion_at = dayjs(date).add(5, 'day').toDate();

    const SwapModel = getSwapModelByTrainNo(train_no);
    const newRequest = await SwapModel.create({
      ...req.body,
      train_no,
      user_id,
      deletion_at,
    });

    // Check if user already has a history document
    let historyDoc = await UserSwapHistory.findOne({ user_id });

    const swapEntry = {
      swap_request_id: newRequest._id,
      train_no,
      date,
      created_at: new Date()
    };

    if (historyDoc) {
      // Push to existing history
      historyDoc.swap_requests.push(swapEntry);
      await historyDoc.save();
    } else {
      // Create new history document
      await UserSwapHistory.create({
        user_id,
        swap_requests: [swapEntry]
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
