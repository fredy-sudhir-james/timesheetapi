const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const Tasks      = require( '../models/tasks' );
const Invoices   = require( '../models/invoices' );
const cors       = require( './cors' );
const pdfGen     = require( '../helper/invoicepdf' );

const invoiceRouter = express.Router();
invoiceRouter.use(bodyParser.json());

// base route - /invoices
invoiceRouter.route( '/' )
.options( cors.corsWithOptions, ( req, res ) => { res.sendStatus(200); } )
.get( cors.cors, ( req, res, next ) => {
	// Return all invoices
	Invoices.find()
	.then( invoices => {
		if ( invoices != 0 ) {
			res.statusCode = 200;
			res.setHeader( 'Content-Type', 'application/json' )
			res.json({"success": true, "invoices": invoices} );
		} else {
			res.statusCode = 200;
			res.setHeader( 'Content-Type', 'application/json' )
			res.json({"success": false, "invoices": []} );
		}
	}, ( err ) => next( err ) )
	.catch( ( err ) => next( err ) );
} )
.post( cors.cors, ( req, res, next ) => {
	// Find all tasks that are not invoiced yet.
	Tasks.find( {"invoiced": false} )
	.then( ( task ) => {
		if ( task != 0 ) {
			return task;
		} else {
			err = new Error( 'No tasks found to generate invoice!' );
			err.status = 404;
			return Promise.reject(err);
		}
	} )
	.then( ( tasks ) => {
		// Get all task ids.
		let taskIds = tasks.map( task => task._id );
		// Calculate the total number of hours.
		let totalHours = tasks.reduce( (acc, task) => {
			return acc + task.hours;
		}, 0 );
		// Total invoice amount.
		let amount = req.body.rate * totalHours;

		// Add the additional details to the body object.
		req.body.tasks      = taskIds;
		req.body.totalHours = totalHours;
		req.body.amount     = amount;

		// Create invoice with the data in request body and return the response.
		return Invoices.create(req.body)
		.then( ( invoice ) => {
			return {invoice, taskIds};
		}, (err) => next(err) );
	} )
	.then( async ( {invoice, taskIds} ) => {
		// After successful invoice generation, set the status of all invoiced tasks as invoiced to true.
		const tasks = await Tasks.updateMany(
			{ _id: { $in: taskIds } },
			{ $set: { "invoiced": true } });
		// If the tasks update is successful return the invoice details
		if (tasks.acknowledged) {
			return invoice;
		} else {
			// Remove the generated invoice if the tasks update failed and return error.
			Invoices.findByIdAndRemove(inv._id);
			err = new Error( 'Tasks update failed!' );
			err.status = 404;
			return Promise.reject(err);
		}
	})
	.then( ( result ) => {
		// Generate the PDF file and return the invoice object and filename generated.
		return pdfGen(result)
		.then( ( res ) => {
			let file = res.fileName;
			return { invoice: result, filename: file };
		}, (err) => next(err) );
	} )
	.then( ( {invoice, filename} ) => {
		// If file exists add the filename to the invoice object.
		if ( filename ) {
			return Invoices.findByIdAndUpdate( invoice._id, {
				$set: { 'invFile': filename }
			}, { new: true } )
			.then( ( inv ) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json( {inv, file: true} );
			}, (err) => next(err) );
		} else {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json( {invoice, file: false} );
		}
	} )
	.catch( ( err ) => next( err ) );
} );

module.exports = invoiceRouter;
