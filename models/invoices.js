/**
 * Schema for invoice.
 */

const mongoose      = require( 'mongoose' );
const Schema        = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const invoiceSchema = new Schema({
	invoiceNo: {
		type: Number,
		required: false,
	},
	date: {
		type: Date,
		required: false,
		default: Date.now(),
	},
	rate: {
		type: Currency,
		required: true,
		min: 10
	},
	totalHours: {
		type: Number,
		required: true,
		default: 0.25,
	},
	amount: {
		type: Currency,
		required: true,
		min: 2.5
	},
	tasks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Task'
		}
	],
	invFile: {
		type: String,
		required: false,
		default: ''
	},
}, {
	timestamps: true
});

invoiceSchema.plugin(AutoIncrement, {inc_field: 'invoiceNo'});

var Invoices = mongoose.model( 'Invoice', invoiceSchema );
module.exports = Invoices;
