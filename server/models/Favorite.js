import mongoose from '../db/mongodb.js';

const { Schema } = mongoose;

// 收藏模型
const favoriteSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flower_id: {
    type: Schema.Types.ObjectId,
    ref: 'Flower',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// 复合唯一索引
favoriteSchema.index({ user_id: 1, flower_id: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
