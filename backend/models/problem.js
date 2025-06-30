import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        require: true,
    },
    inputFormat: {
        type: String
    },
    outputFormat: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'], 
        default: 'Easy'
    },
    createAt: {
        type: Date, 
        default: Date.now
    }
});

const problem = mongoose.model('Problem', problemSchema);

export default problem;