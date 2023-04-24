const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../app');
const Tasks    = require('../models/tasks');


let id;
let wrongId = 124234; // wrong task ID for testing.
describe( 'test tasks router', () => {
	afterAll( async () => {
		await Tasks.deleteMany();
		mongoose.disconnect();
	});

	// test post data to tasks route.
	describe( 'POST/tasks', () => {
		it( 'post data to tasks route and save in DB', async () => {
			const task = {
				date: '02/16/2023',
				task: 'Install add-on',
				hours: 0.25
			}
			const res = await request(app)
				.post('/tasks')
				.send(task);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual(
				expect.any(Object)
			);
			id = res.body._id;
		});
		it( 'should not save tasks to DB, server error', async () => {
			const task = {
				date: '02/16/2023',
				task: 'Install add-on',
				hours: 0.25
			}
			jest.spyOn(Tasks, 'create').mockRejectedValueOnce(new Error());
			const res = await request(app)
				.post('/tasks')
				.send(task);
			expect(res.statusCode).toEqual(500);
			expect(res.body).toEqual(
				expect.any(Object)
			);
		});
	});

	// test get all tasks route.
	describe( 'GET/tasks', () => {
		it( 'retrieve all the tasks from DB', async () => {
			const res = await request(app)
				.get('/tasks');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual(
				expect.any(Object)
			);
		});
		it( 'should not retrieve tasks from DB, server error', async () => {
			jest.spyOn(Tasks, 'find').mockRejectedValueOnce(new Error());
			const res = await request(app)
				.get('/tasks');
			expect(res.statusCode).toEqual(500);
			expect(res.serverError).toEqual(true);
			expect(res.error).toEqual(
				expect.any(Object)
			);
		});
	});

	// test update individual task.
	describe( 'PUT/tasks/:taskId', () => {
		it( 'update specific task by id and save in DB', async () => {
			// Data to be updated.
			const data = {
				invoiced: true,
				hours: 1.25,
			}
			const res = await request(app)
				.put(`/tasks/${id}`)
				.send(data);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual(
				expect.objectContaining({
					updated: true,
					updateTask: expect.any(Object),
				}),
			);
		} );
		it( 'update task fails, server error', async () => {
			// Data to be updated.
			const data = {
				invoiced: true,
				hours: 1.25,
			}
			jest.spyOn(Tasks, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('server error'));
			const res = await request(app)
				.put(`/tasks/${id}`)
				.send(data);
			expect(res.statusCode).toEqual(500);
			expect(res.serverError).toEqual(true);
			expect(res.error).toEqual(
				expect.any(Object)
			);
		} );
		it( 'update task failed for wrong taks ID', async () => {
			// Data to be updated.
			const data = {
				invoiced: true,
				hours: 1.25,
			}
			const res = await request(app)
				.put(`/tasks/${wrongId}`)
				.send(data);
			expect(res.statusCode).toEqual(500);
			expect(res.serverError).toEqual(true);
		} );
	} );

	//test delete individual task.
	describe( 'DELETE/tasks/:taskId', () => {
		// Currently I haven't written a check for wrong ID. Hence the check for error status.
		it( 'delete individual task by id, wrong task ID', async () => {
			const res = await request(app)
				.delete(`/tasks/${wrongId}`);
			expect(res.statusCode).toEqual(500);
			expect(res.serverError).toEqual(true);
		} );
		it( 'delete individual task by id', async () => {
			const res = await request(app)
				.delete(`/tasks/${id}`);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual(
				expect.any(Object)
			);
		} );
	} )
});

