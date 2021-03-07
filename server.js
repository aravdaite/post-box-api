const express = require('express');
const http = require('http');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();
app.use(express.json());

//connect to database
connectDB();

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', process.env.DOMAIN);
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.append('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

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
