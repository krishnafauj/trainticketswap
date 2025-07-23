import getSwapModelByTrainNo from '../model/trainswaprequest.js';
import swapGroup from '../model/swapgroup.js';

export const getSwapRequestsByTrainAndDate = async (req, res) => {
  const { train_no, date } = req.query;
  console.log("request received")

  if (!train_no || !date) {
    return res.status(400).json({ error: "train_no and date are required" });
  }

  try {
    const SwapModel = getSwapModelByTrainNo(train_no);

    // Get the group to get all request IDs for that train
    const group = await swapGroup.findOne({ train_no });

    if (!group || group.request_ids.length === 0) {
      return res.status(404).json({ message: "No requests found for this train" });
    }

    // Filter only those requests matching the same date
    const requests = await SwapModel.find({
      _id: { $in: group.request_ids },
      date: date,
    });

    res.status(200).json({
      train_no,
      date,
      uvid: group.uvid,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error in getSwapRequestsByTrainAndDate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
