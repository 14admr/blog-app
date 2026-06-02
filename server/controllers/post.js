const Post = require("../models/Post");

module.exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const newPost = new Post({
            title,
            content,
            author: req.user.id,
        });

        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("author", "username email");
        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            "author",
            "username email",
        );

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports.updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.author.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ error: "You are not authorized to update this post" });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        const updatedPost = await post.save();
        return res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res
                .status(403)
                .json({ error: "You are not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
