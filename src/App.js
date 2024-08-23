import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const customIcon = L.icon({
	iconUrl: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/14_2-512.png',
	iconSize: [38, 38],
	iconAnchor: [22, 38],
	popupAnchor: [-3, -36]
});

const MapComponent = () => {
	const [markers, setMarkers] = useState([
		{ id: 1, position: [51.505, -0.09] }
	]);

	const addMarker = () => {
		const newMarker = {
			id: markers.length + 1,
			position: [51.505 + Math.random() * 0.02, -0.09 + Math.random() * 0.02]
		};
		setMarkers([...markers, newMarker]);
	};

	const updateMarkerPosition = (id, newPosition) => {
		setMarkers(markers.map(marker =>
			marker.id === id ? { ...marker, position: newPosition } : marker
		));
	};

	const handleDragEnd = (id, event) => {
		const newPosition = event.target.getLatLng();
		updateMarkerPosition(id, [newPosition.lat, newPosition.lng]);
	};

	return (
		<div style={{display: "flex", height: "100vh", width: "100vw", background: "#82bfb7"}}>
			<div style={{flex: 1}}>
				<button onClick={addMarker} style={{margin: "10px", padding: "10px"}}>
					Add Draggable Marker
				</button>
				<MapContainer center={[51.505, -0.09]} zoom={13} style={{height: "80vh", width: "100%", margin: "10px"}}>
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
								dragend: (event) => handleDragEnd(marker.id, event),
							}}
						>
							<Popup>
								Marker {marker.id}: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
							</Popup>
						</Marker>
					))}
				</MapContainer>
			</div>
			<div style={{flex: 0.3, padding: "20px"}}>
				<h3>Marker Positions</h3>
				<table border="1" cellPadding="10">
					<thead>
					<tr>
						<th>Marker ID</th>
						<th>Latitude</th>
						<th>Longitude</th>
					</tr>
					</thead>
					<tbody>
					{markers.map(marker => (
						<tr key={marker.id}>
							<td>{marker.id}</td>
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

export default MapComponent;
