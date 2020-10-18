const express = require('express');
const http = require('http');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const routes = require('./routes/routes');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

//connect to database
connectDB();

app.use(cors());
app.options('*', cors());

//mount routes
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
const server = http.Server(app);

server.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
	// close server and exit process
	server.close(() => process.exit(1));
});

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
	// close server and exit process
	server.close(() => process.exit(1));
});
