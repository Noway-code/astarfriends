// src/pages/PartyPage.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const customIcon = L.icon({
	iconUrl: 'https://cdn-icons-png.flaticon.com/512/609/609803.png',
	iconSize: [38, 38],
	iconAnchor: [22, 38],
	popupAnchor: [-3, -36]
});

const sourceIcon = L.icon({
	iconUrl: 'https://cdn-icons-png.freepik.com/512/5723/5723249.png',
	iconSize: [48, 48],
	iconAnchor: [22, 38],
	popupAnchor: [-3, -36]
});

const destinationIcon = L.icon({
	iconUrl: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/14_2-512.png',
	iconSize: [38, 38],
	iconAnchor: [22, 38],
	popupAnchor: [-3, -36]
});

const PartyPage = () => {
	const [driverMarkers, setDriverMarkers] = useState([]);
	const [markers, setMarkers] = useState([{ id: 0, position: [51.505, -0.09], name: 'House Marker 0', editable: false }]);
	const [destinationMarkers, setDestinationMarkers] = useState([{ id: 0, position: [51.515, -0.1], name: 'Destination Marker 0', editable: false }]);
	const [polylines, setPolylines] = useState([]);
	const navigate = useNavigate();

	const addMarker = () => {
		const newMarker = {
			id: markers.length,
			position: [51.505 + (Math.random() - 0.5) * 0.2, -0.09 + (Math.random() - 0.5) * 0.2],
			name: `House Marker ${markers.length}`,
			editable: false
		};
		setMarkers([...markers, newMarker]);
	};

	const addSourceMarker = () => {
		const newSourceMarker = {
			id: driverMarkers.length,
			position: [51.505 + (Math.random() - 0.5) * 0.2, -0.09 + (Math.random() - 0.5) * 0.2],
			name: `Driver Marker ${driverMarkers.length}`,
			editable: false
		};
		setDriverMarkers([...driverMarkers, newSourceMarker]);
	};

	async function getRequest(data) {
		let url = `http://localhost:8000/data`;

		let response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		let result = await response.json();
		let decodedPolylines = decodePolyline(result);
		setPolylines(decodedPolylines);
		return decodedPolylines;
	}

	function decodePolyline(encodedPolyline) {
		let decodePolylines = [];
		encodedPolyline.polylines.forEach(encoded => {
			const decodedPolyline = polyline.decode(encoded, 5);
			decodePolylines.push(decodedPolyline);
		});

		return decodePolylines;
	}

	const sendMarkersToServer = async () => {
		const data = {
			driverMarkers: driverMarkers,
			destinationMarkers: destinationMarkers,
			houseMarkers: markers,
			allMarkers: [...driverMarkers, ...destinationMarkers, ...markers]
		};

		const decodedPolylines = await getRequest(data);
		navigate('/route', { state: { markers, driverMarkers, destinationMarkers, decodedPolylines } });
	}

	const updateMarkerPosition = (id, newPosition, type = 'regular') => {
		if (type === 'source') {
			setDriverMarkers(
				driverMarkers.map(marker =>
					marker.id === id ? { ...marker, position: newPosition } : marker
				)
			);
		} else if (type === 'destination') {
			setDestinationMarkers(
				destinationMarkers.map(marker =>
					marker.id === id ? { ...marker, position: newPosition } : marker
				)
			);
		} else {
			setMarkers(
				markers.map(marker =>
					marker.id === id ? { ...marker, position: newPosition } : marker
				)
			);
		}
	};

	const handleDragEnd = (id, event, type = 'regular') => {
		const newPosition = event.target.getLatLng();
		updateMarkerPosition(id, [newPosition.lat, newPosition.lng], type);
	};

	const toggleEditMode = (id, type = 'regular') => {
		if (type === 'source') {
			setDriverMarkers(
				driverMarkers.map(marker =>
					marker.id === id ? { ...marker, editable: !marker.editable } : marker
				)
			);
		} else if (type === 'destination') {
			setDestinationMarkers(
				destinationMarkers.map(marker =>
					marker.id === id ? { ...marker, editable: !marker.editable } : marker
				)
			);
		} else {
			setMarkers(
				markers.map(marker =>
					marker.id === id ? { ...marker, editable: !marker.editable } : marker
				)
			);
		}
	};

	const handleNameChange = (id, newName, type = 'regular') => {
		if (type === 'source') {
			setDriverMarkers(
				driverMarkers.map(marker =>
					marker.id === id ? { ...marker, name: newName } : marker
				)
			);
		} else if (type === 'destination') {
			setDestinationMarkers(
				destinationMarkers.map(marker =>
					marker.id === id ? { ...marker, name: newName } : marker
				)
			);
		} else {
			setMarkers(
				markers.map(marker =>
					marker.id === id ? { ...marker, name: newName } : marker
				)
			);
		}
	};

	const colors = ['blue', 'red', 'green', 'magenta','#215d17', 'cyan', 'purple', 'yellow', 'pink', 'brown' ];

	return (
		<div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#82bfb7' }}>
			<div style={{ flex: 1 }}>
				<button onClick={addMarker} style={{ margin: '10px', padding: '10px' }}>
					Add House Marker
				</button>
				<button onClick={addSourceMarker} style={{ margin: '10px', padding: '10px' }}>
					Add Driver Marker
				</button>
				<button onClick={sendMarkersToServer} style={{ margin: '10px', padding: '10px', color:"forestgreen", fontWeight:"bold", fontSize:"14px"}}>
					Send data down to server
				</button>
				<MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '80vh', width: '100%', margin: '10px' }}>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					{markers.map(marker => (
						<Marker
							key={marker.id}
							position={marker.position}
							draggable={true}
							icon={customIcon}
							eventHandlers={{
								dragend: event => handleDragEnd(marker.id, event),
							}}
						>
							<Tooltip permanent>
								ID: {marker.id}
							</Tooltip>
							<Popup>
								{marker.editable ? (
									<input
										type="text"
										value={marker.name}
										onChange={e => handleNameChange(marker.id, e.target.value)}
									/>
								) : (
									<span>{marker.name}</span>
								)}
								<button onClick={() => toggleEditMode(marker.id)}>
									{marker.editable ? 'Save' : 'Edit'}
								</button>
								<br />
								Marker {marker.id}: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
							</Popup>
						</Marker>
					))}
					{driverMarkers.map(sourceMarker => (
						<Marker
							key={sourceMarker.id}
							position={sourceMarker.position}
							draggable={true}
							icon={sourceIcon}
							eventHandlers={{
								dragend: event => handleDragEnd(sourceMarker.id, event, 'source'),
							}}
						>
							<Tooltip permanent>
								ID: {sourceMarker.id}
							</Tooltip>
							<Popup>
								{sourceMarker.editable ? (
									<input
										type="text"
										value={sourceMarker.name}
										onChange={e => handleNameChange(sourceMarker.id, e.target.value, 'source')}
									/>
								) : (
									<span>{sourceMarker.name}</span>
								)}
								<button onClick={() => toggleEditMode(sourceMarker.id, 'source')}>
									{sourceMarker.editable ? 'Save' : 'Edit'}
								</button>
								<br />
								Source Marker {sourceMarker.id}: {sourceMarker.position[0].toFixed(4)}, {sourceMarker.position[1].toFixed(4)}
							</Popup>
						</Marker>
					))}
					{destinationMarkers.map(destinationMarker => (
						<Marker
							key={destinationMarker.id}
							position={destinationMarker.position}
							draggable={true}
							icon={destinationIcon}
							eventHandlers={{
								dragend: event => handleDragEnd(destinationMarker.id, event, 'destination'),
							}}
						>
							<Tooltip permanent>
								ID: {destinationMarker.id}
							</Tooltip>
							<Popup>
								{destinationMarker.editable ? (
									<input
										type="text"
										value={destinationMarker.name}
										onChange={e => handleNameChange(destinationMarker.id, e.target.value, 'destination')}
									/>
								) : (
									<span>{destinationMarker.name}</span>
								)}
								<button onClick={() => toggleEditMode(destinationMarker.id, 'destination')}>
									{destinationMarker.editable ? 'Save' : 'Edit'}
								</button>
								<br />
								Destination Marker {destinationMarker.id}: {destinationMarker.position[0].toFixed(4)}, {destinationMarker.position[1].toFixed(4)}
							</Popup>
						</Marker>
					))}
					{polylines.map((polyline, index) => (
						<Polyline key={index} positions={polyline} color={colors[index % colors.length]} weight={5} />
					))}
				</MapContainer>
			</div>
			<div style={{ flex: 0.3, padding: '20px' }}>
				<h3>House Marker Positions</h3>
				<table border="1" cellPadding="10">
					<thead>
					<tr>
						<th>House Marker ID</th>
						<th>Name</th>
						<th>Latitude</th>
						<th>Longitude</th>
					</tr>
					</thead>
					<tbody>
					{markers.map(marker => (
						<tr key={marker.id}>
							<td>{marker.id}</td>
							<td>{marker.name}</td>
							<td>{marker.position[0].toFixed(4)}</td>
							<td>{marker.position[1].toFixed(4)}</td>
						</tr>
					))}
					</tbody>
				</table>
				<h3>Driver Marker Positions</h3>
				<table border="1" cellPadding="10">
					<thead>
					<tr>
						<th>Driver Marker ID</th>
						<th>Name</th>
						<th>Latitude</th>
						<th>Longitude</th>
					</tr>
					</thead>
					<tbody>
					{driverMarkers.map(marker => (
						<tr key={marker.id}>
							<td>{marker.id}</td>
							<td>{marker.name}</td>
							<td>{marker.position[0].toFixed(4)}</td>
							<td>{marker.position[1].toFixed(4)}</td>
						</tr>
					))}
					</tbody>
				</table>
				<h3>Destinations Marker Positions</h3>
				<table border="1" cellPadding="10">
					<thead>
					<tr>
						<th>Destination Marker ID</th>
						<th>Name</th>
						<th>Latitude</th>
						<th>Longitude</th>
					</tr>
					</thead>
					<tbody>
					{destinationMarkers.map(marker => (
						<tr key={marker.id}>
							<td>{marker.id}</td>
							<td>{marker.name}</td>
							<td>{marker.position[0].toFixed(4)}</td>
							<td>{marker.position[1].toFixed(4)}</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PartyPage;
