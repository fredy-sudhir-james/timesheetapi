# Express server for the timesheet app project

This repo is an express server instance for the Task managment app project. The frontend is maintained separeately built using React, maintained in [another repository](https://github.com/fredy-sudhir-james/timesheetapp)

***Still under development.***

The idea behind this project is to build a task management app, to keep track of tasks, time spend on each task and also generate invoices for the tasks. The project has 2 routes ***Tasks*** and ***Invoices***. Additional details:
- [x] **Tasks** handles the create, update and delete of tasks. Fields - task details, time spent on task and a field for invoice status check. This route is complete.
- [ ] **Invoices** handles the invoice creation. When an invoice creation in initiated all the *non-invoiced* tasks are bundled and an invoice is generated. Still under development


## Code Overview

### Features

+ The application skeleton is generated using [express-generator](https://www.npmjs.com/package/express-generator)
+ [ExpressJS](https://www.npmjs.com/package/express) - for handling and routing requests
+ MongoDB ([Mongoose](https://mongoosejs.com/)) - for modeling and mapping MongoDB data
+ [Mongoose Currency](https://www.npmjs.com/package/mongoose-currency) - to add currency type to Mongoose Schema
+ [Mongoose Sequence](https://www.npmjs.com/package/mongoose-sequence) - autoincrement value for invoice number
+ Use environment variables from `.env` files with [dotenv](https://www.npmjs.com/package/dotenv)
+ Tests with [Jest](https://jestjs.io/) and [supertest](https://www.npmjs.com/package/supertest)
+ [Nodemon](https://www.npmjs.com/package/nodemon) - tool to automatically restart node application of file change.
+ [Dynamic HTML PDF](https://www.npmjs.com/package/dynamic-html-pdf) - tool to convert HTML to PDF with handlebars for dynamic data.

## Models

### Tasks

| Key  | Additional Info |
| ---- | --------------- |
| Date | Date type       |
| Task | String type, task details |
| Hours | Number type, time spend on a task in hours with default set to 0.25 (15 mins) |
| Invoiced | Boolean time, default set to false |

### Invoices

| Key            | Additional Info |
| -------------- | --------------- |
| Invoice number | Number type     |
| Date           | Date type, default `now` |
| Rate           | Currency type, the hourly rate at which the invoice needs to be generated |
| Total Hours    | Number, total invoice hours |
| Amount         | Total invoice amount |
| Tasks          | An object of task ids for which the invoice is generated for, for any features to be added in the future |
| invoice file   | invoice file name |

## Prerequisites

+ [Node](https://nodejs.org/en)
+ [npm](https://www.npmjs.com/)
+ [MongoDB](https://www.mongodb.com/docs/manual/installation/#tutorials)

## Getting Started

To get the server running locally:

+ Clone this repo
+ `npm install` to install all required dependencies.
+ rename `.env.example` to `.env` and fill in the details.
+ `npm start` to start the server.
+ `npm run watch` to restart the server after file change.
+ `npm run test` to run test using Jest and Supertest.
