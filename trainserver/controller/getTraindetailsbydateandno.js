import getSwapModelByTrainNo from '../model/trainswaprequest.js';
// it is for find the train details
export const getSwapRequestsByTrainAndDate = async (req, res) => {
  const { train_no, date } = req.query;

  if (!train_no || !date) {
    return res.status(400).json({ error: "train_no and date are required" });
  }

  try {
    const SwapModel = getSwapModelByTrainNo(train_no);

    // Fetch all requests matching train_no and date
    const requests = await SwapModel.find({ train_no, date });
    if (!requests.length) {
      return res.status(404).json({ message: "No requests found for this train and date" });
    }

    res.status(200).json({
      train_no,
      date,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error in getSwapRequestsByTrainAndDate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
