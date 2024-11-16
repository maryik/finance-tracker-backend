import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
}, { timestamps: true});

export default mongoose.model('Budget', BudgetSchema);