import { asyncWrapper } from "../utils/asyncWrapper/asyncWrapper.js";
import { apiResponse } from "../utils/apiRespons/apiResponse.js";
import { postService } from "../service/post.service.js";

export const createPost = asyncWrapper(async (req, res) => {
  const { content, media, privacy } = req.body;
  const author = req.user._id;
  const post = await postService.createPost({
    author,
    content,
    media,
    privacy,
  });

  return res
    .status(201)
    .json(new apiResponse(201, post, "Post created successfully"));
});

//newsFeed
export const getNewsfeed = asyncWrapper(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const cursor = req.query.cursor || null; // শেষ পোস্টের createdAt সময়
  console.log(req.user?._id);

  const result = await postService.getNewsFeed({
    userId: req.user?._id || null,
    cursor,
    limit,
  });

  return res
    .status(200)
    .json(new apiResponse(200, result, "Newsfeed fetched successfully"));
});
