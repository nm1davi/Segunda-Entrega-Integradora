import mongoose, { Schema } from 'mongoose';

const documentSchema = new Schema({
  name: {type: String, required: true},
  reference: {type: String, required: true}
})

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  providerId: { type: String },
  provider: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'premium', 'admin'] },
  age: { type: Number, required: false },
  cart:{type: mongoose.Schema.Types.ObjectId, ref:'Cart'},
  documents: [documentSchema],
  last_connection: { type: Date }

}, { timestamps: true });

userSchema.methods.updateLastConnection = async function () {
  this.last_connection = new Date();
  await this.save();
};

export default mongoose.model('User', userSchema);