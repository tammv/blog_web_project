import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const queryOptions = {};

    if (req.query.userId) {
      queryOptions.userId = req.query.userId;
    }
    if (req.query.topicID) {
      queryOptions.topicID = req.query.topicID;
    }
    if (req.query.category) {
      queryOptions.category = req.query.category;
    }
    if (req.query.slug) {
      queryOptions.slug = req.query.slug;
    }
    if (req.query.postId) {
      queryOptions._id = req.query.postId;
    }
    if (req.query.searchTerm) {
      queryOptions.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }
    const postsQuery = Post.find(queryOptions)
      .populate("topicID") // Populate the 'topicID' field with the corresponding topic document
      .populate("userId", "username email") // Populate the 'userId' field with 'username' and 'email'
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPostsQuery = Post.countDocuments(queryOptions);

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPostsQuery = Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...queryOptions, // Include other query options
    });

    const [posts, totalPosts, lastMonthPosts] = await Promise.all([
      postsQuery.exec(),
      totalPostsQuery.exec(),
      lastMonthPostsQuery.exec(),
    ]);

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
