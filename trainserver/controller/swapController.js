import getSwapModelByTrainNo from '../model/trainswaprequest.js';
import swapGroup from '../model/swapgroup.js';
import { uvid } from '../utils/uvid.js';

export const submitSwapRequest = async (req, res) => {

  const { train_no } = req.body;
  const user_id = req.user.id;

  const SwapModel = getSwapModelByTrainNo(train_no);
  const newRequest = await SwapModel.create({ ...req.body, user_id });

  // Check for existing group for user + train_no
  let group = await swapGroup.findOne({ train_no, 'request_ids': { $exists: true } });

  if (!group) {
    group = await swapGroup.create({
      uvid: uvid(), // auto-generate new uvid
      train_no,
      request_ids: [newRequest._id]
    });
  } else {
    group.request_ids.push(newRequest._id);
    await group.save();
  }

  res.status(201).json({
    message: "Request submitted",
    uvid: group.uvid,
    request_id: newRequest._id
  });
};
