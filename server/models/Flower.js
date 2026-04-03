import mongoose from './mongodb.js';

const { Schema } = mongoose;

// 花卉模型
const flowerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  name_en: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  care_tips: {
    type: String,
    required: true
  },
  watering: {
    type: String,
    required: true
  },
  sunlight: {
    type: String,
    required: true
  },
  temperature: {
    type: String,
    required: true
  },
  fertilizer: {
    type: String,
    required: true
  },
  fertilizer_link: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  season: {
    type: String
  },
  bloom_time: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// 添加索引
flowerSchema.index({ category: 1 });
flowerSchema.index({ difficulty: 1 });
flowerSchema.index({ name: 'text', name_en: 'text', description: 'text' });

export const Flower = mongoose.model('Flower', flowerSchema);
