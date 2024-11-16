import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

GoalSchema.methods.checkDeadline = function() {
    const now = new Date();
    const deadline = new Date(this.deadline);
    if (now > deadline && !this.isCompleted) {
        this.isBlocked = true;
    } else if (now <= this.deadline) {
        this.isBlocked = false;
    }
};



export const Goal = mongoose.model('Goal', GoalSchema);
