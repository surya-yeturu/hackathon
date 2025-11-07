import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    default: '',
  },
  initials: {
    type: String,
    required: true,
  },
  githubUsername: {
    type: String,
    default: '',
  },
  trelloUsername: {
    type: String,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

export default mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);

