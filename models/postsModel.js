const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model('Post', postsSchema);

module.exports = PostModel;
