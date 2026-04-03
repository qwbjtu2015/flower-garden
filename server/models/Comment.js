import mongoose from '../db/mongodb.js';

const { Schema } = mongoose;

// 评论模型
const commentSchema = new Schema({
  flower_id: {
    type: Schema.Types.ObjectId,
    ref: 'Flower',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// 添加索引
commentSchema.index({ flower_id: 1, created_at: -1 });

export const Comment = mongoose.model('Comment', commentSchema);
