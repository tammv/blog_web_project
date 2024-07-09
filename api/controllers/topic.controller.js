import Topic from "../models/topic.model.js";

// Create a new topic
export const createTopic = async (req, res) => {
  try {
    const newTopic = new Topic(req.body);
    const savedTopic = await newTopic.save();
    res.status(201).json(savedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all topics
export const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate('userId', 'username'); // Assuming 'name' is a field in the User model
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a topic by ID
export const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a topic by ID
export const updateTopicById = async (req, res) => {
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a topic by ID
export const deleteTopicById = async (req, res) => {
  try {
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);
    if (!deletedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.status(200).json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserToTopic = async (req, res) => {
  try {
    const { userId } = req.body;
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    if (!topic.followers.includes(userId)) {
      topic.followers.push(userId);
      await topic.save();
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a user from a topic's followers
export const removeUserFromTopic = async (req, res) => {
  try {
    const { userId } = req.body;
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    if (topic.followers.includes(userId)) {
      topic.followers = topic.followers.filter((follower) => follower.toString() !== userId);
      await topic.save();
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

