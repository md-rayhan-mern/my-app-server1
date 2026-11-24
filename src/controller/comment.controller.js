import { asyncWrapper } from "../utils/asyncWrapper/asyncWrapper.js";
import { apiResponse } from "../utils/apiRespons/apiResponse.js";
import { commentService } from "../service/comment.service.js";

// নতুন কমেন্ট বা কমেন্টের রিপ্লাই যোগ করা
export const addComment = asyncWrapper(async (req, res) => {
  const { postId, content, parentCommentId } = req.body;

  const comment = await commentService.createComment({
    userId: req.user._id,
    postId,
    content,
    parentCommentId: parentCommentId || null,
  });
  return res
    .status(201)
    .json(new apiResponse(201, comment, "Comment added successfully"));
});

// নির্দিষ্ট পোস্টের কমেন্ট বা কোনো কমেন্টের রিপ্লাই দেখা
export const getPostComments = asyncWrapper(async (req, res) => {
  const { postId } = req.params;
  const { parentCommentId } = req.query;

  const comments = await commentService.getComments({
    postId,
    parentCommentId: parentCommentId || null,
  });

  return res
    .status(200)
    .json(new apiResponse(200, comments, "Comments fetched successfully"));
});
