import UserSwapHistory from "../model/UserSwapHistory.js";

export const getSwapHistoryByUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    const historyDoc = await UserSwapHistory.findOne({ user_id });

    if (!historyDoc || historyDoc.swap_requests.length === 0) {
      return res.status(200).json({ count: 0, history: [] });
    }

    // Sort by created_at descending
    const sortedHistory = historyDoc.swap_requests.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.status(200).json({
      count: sortedHistory.length,
      history: sortedHistory,
    });
  } catch (error) {
    console.error("Error fetching swap history:", error);
    res.status(500).json({ error: "Server error" });
  }
};
