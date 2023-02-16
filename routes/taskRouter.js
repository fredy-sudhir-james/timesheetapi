const express    = require( 'express' );
const bodyParser = require( 'body-parser' );
const Tasks      = require( '../models/tasks' );
const cors       = require( './cors' );

const taskRouter = express.Router();
taskRouter.use(bodyParser.json());

// base route - /tasks
taskRouter.route( '/' )
.options( cors.corsWithOptions, ( req, res ) => { res.sendStatus(200); } )
.get( cors.cors, ( req, res, next ) => {
	// Return all tasks
	Tasks.find()
	.then( tasks => {
		res.statusCode = 200;
		res.setHeader( 'Content-Type', 'application/json' )
		res.json( tasks );
	} )
	.catch( ( err ) => next( err ) );
} )
.post( cors.cors, ( req, res, next ) => {
	// pass the incoming data in the body to add data to the collection.
	Tasks.create( req.body )
	.then( ( task ) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(task);
	} )
	.catch( ( err ) => next( err ) );
} );

// route with and id - taskId
taskRouter.route( '/:taskId' )
.options( cors.corsWithOptions, ( req,res ) => { res.sendStatus(200); } )
.put( cors.cors, ( req, res, next ) => {
	Tasks.findByIdAndUpdate( req.params.taskId, {
		$set: req.body
	}, { new: true } )
	.then( ( task ) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json( {"updated": true, "updateTask": task} );
	} )
	.catch( ( err ) => next( err ) );
} )
.delete( cors.cors, ( req, res, next ) => {
	Tasks.findByIdAndRemove( req.params.taskId )
	.then( ( response ) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json( response );
	} )
	.catch( ( err ) => next( err ) );
} );

module.exports = taskRouter;
