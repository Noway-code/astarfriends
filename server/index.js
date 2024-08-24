const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Endpoint to handle OSRM table requests
app.get("/api", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.post('/calculate-route', async (req, res) => {
	try {
		const { coordinates } = req.body;

		if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
			return res.status(400).json({ error: 'Please provide at least two coordinates.' });
		}

		// Convert coordinates array to the format OSRM expects (lon,lat)
		const osrmCoordinates = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';');

		// Make a request to the OSRM table service
		const osrmUrl = `http://router.project-osrm.org/table/v1/driving/${osrmCoordinates}?annotations=duration`;
		const response = await axios.get(osrmUrl);

		// Send back the response from OSRM
		res.json(response.data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while processing the request.' });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
