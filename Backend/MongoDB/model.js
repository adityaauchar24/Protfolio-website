import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    maxlength: [255, 'Email cannot exceed 255 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [5, 'Address must be at least 5 characters long'],
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  }
}, {
  timestamps: true,
  collection: 'users', // Explicitly set collection name
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });

// Virtual for formatted createdAt
userSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Static method to get recent submissions
userSchema.statics.getRecentSubmissions = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Instance method to get summary
userSchema.methods.getSummary = function() {
  return {
    id: this._id,
    fullname: this.fullname,
    email: this.email,
    messagePreview: this.message.length > 50 
      ? this.message.substring(0, 50) + '...' 
      : this.message,
    submitted: this.formattedDate
  };
};

const User = mongoose.model('User', userSchema);

export default User;