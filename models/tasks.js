/**
 * Task database schema.
 */

const mongoose = require( 'mongoose' );
const Schema   = mongoose.Schema;

const taskSchema = new Schema({
	date: {
		type: Date,
		required: true
	},
	task: {
		type: String,
		required: true
	},
	hours: {
		type: Number,
		required: true,
		default: 0.25,
	},
	invoiced: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

var Tasks = mongoose.model('Task', taskSchema);
module.exports = Tasks;
