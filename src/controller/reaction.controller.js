import { asyncWrapper } from "../utils/asyncWrapper/asyncWrapper.js";
import { apiResponse } from "../utils/apiRespons/apiResponse.js";
import { reactionService } from "../service/reaction.service.js";

export const toggleReaction = asyncWrapper(async (req, res) => {
  const { targetId, targetType, type } = req.body;
  const result = await reactionService.toggleReaction({
    userId: req.user._id,
    targetId,
    targetType,
    type,
  });

  return res
    .status(200)
    .json(new apiResponse(200, result, "Reaction updated successfully"));
});
