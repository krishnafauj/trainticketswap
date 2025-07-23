import getSwapModelByTrainNo from '../model/trainswaprequest.js';
import swapGroup from '../model/swapgroup.js';

export const getSwapRequestsByTrain = async (req, res) => {
  const { train_no } = req.params;

  if (!train_no) {
    return res.status(400).json({ error: "train_no is required" });
  }

  try {
    // Get group for the train
    const group = await swapGroup.findOne({ train_no });

    if (!group || group.request_ids.length === 0) {
      return res.status(404).json({ message: "No swap requests found for this train." });
    }

    // Get correct model (bucketed by train_no)
    const SwapModel = getSwapModelByTrainNo(train_no);

    // Fetch all requests using IDs
    const requests = await SwapModel.find({
      _id: { $in: group.request_ids },
    });

    res.status(200).json({
      train_no,
      uvid: group.uvid,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error fetching train swap requests:", error);
    res.status(500).json({ error: "Server error" });
  }
};
