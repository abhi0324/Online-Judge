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
    constraints: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'], 
        default: 'Easy'
    },
    examples: [
        {
            input: {type: String},
            output: {type: String},
        }
    ],
    testCases: [
        {
            input: {type: String},
            expectedOutput: {type: String},
        }
    ],
    createAt: {
        type: Date, 
        default: Date.now
    },
    
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;