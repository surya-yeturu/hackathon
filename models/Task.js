import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  externalId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  source: {
    type: String,
    enum: ['github', 'trello', 'manual'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'blocked'],
    default: 'open',
    index: true,
  },
  assignedTo: {
    type: String,
    default: '',
  },
  project: {
    type: String,
    default: 'default',
    index: true,
  },
  labels: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes for performance
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ updatedAt: -1 });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);

