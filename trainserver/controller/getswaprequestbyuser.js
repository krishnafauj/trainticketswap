import UserSwapHistory from "../model/UserSwapHistory.js";
import getSwapModelByTrainNo from "../model/trainswaprequest.js";

export const getSwapHistoryByUser = async (req, res) => {
  try {
    const user_id = req.user.id;
   

    const historyDoc = await UserSwapHistory.findOne({ user_id });

    if (!historyDoc || historyDoc.swap_requests.length === 0) {
      
      return res.status(200).json({ count: 0, history: [] });
    }

  
    const populatedHistory = [];

    for (const entry of historyDoc.swap_requests) {
      const { train_no, swap_request_id, created_at } = entry;
      

      try {
        const SwapModel = getSwapModelByTrainNo(train_no);
    
        const requestDoc = await SwapModel.findById(swap_request_id).lean();

        if (requestDoc) {
          
          populatedHistory.push({
            ...requestDoc,
            created_at,
            train_no,
            swap_request_id,
          });
        } else {
          console.warn("⚠️ Swap request not found in DB for ID:", swap_request_id);
        }
      } catch (err) {
        console.error(`❌ Failed to fetch request for ${swap_request_id} on train ${train_no}:`, err.message);
      }
    }

    const sorted = populatedHistory.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );



    res.status(200).json({
      count: sorted.length,
      history: sorted,
    });
   

  } catch (error) {
    console.error("❌ Error in getSwapHistoryByUser:", error);
    res.status(500).json({ error: "Server error" });
  }
};
