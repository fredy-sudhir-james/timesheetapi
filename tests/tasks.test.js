const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../app');
const Tasks    = require('../models/tasks');


let id;
describe( 'test tasks router', () => {
	afterAll( async () => {
		await mongoose.disconnect();
	});

	// test get all tasks route.
	describe( 'GET/tasks', () => {
		it( 'retrieve all the tasks from DB', async (done) => {
			const res = await request(app)
				.get('/tasks');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual(
				expect.any(Object)
			);
			done();
		});
		it( 'should not retrieve tasks from DB, server error', async (done) => {
			jest.spyOn(Tasks, 'find').mockRejectedValueOnce(new Error());
			const res = await request(app)
				.get('/tasks');
			expect(res.statusCode).toEqual(500);
			expect(res.body).toEqual(
				expect.any(Object)
			);
			done();
		});
	});

	// test post data to tasks route.
	describe( 'POST/tasks', () => {
		it( 'post data to tasks route and save in DB', async (done) => {
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
			done();
		});
		it( 'should not save tasks to DB, server error', async (done) => {
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
			done();
		});
	});
});

