import mongoose from 'mongoose';
const irrigationLogSchema = new mongoose.Schema({
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    duration: { type: String },
    notes: { type: String },
}, { _id: true, timestamps: true });

const farmSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    crop: { type: String, default: '' },
    size: { type: String, default: '' },
    status: { type: String, default: 'Unknown' },
    image: { type: String, default: '' },
    irrigationLogs: [irrigationLogSchema],
}, { timestamps: true });

const farmModel = mongoose.models.farm || mongoose.model('farm', farmSchema);

export default farmModel;
