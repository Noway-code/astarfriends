import React from "react";
import { useLocation } from 'react-router-dom';
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import * as L from "leaflet";
import {useNavigate} from "react-router-dom";

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

// src/pages/RoutePage.js
const RoutePage = () => {
	const location = useLocation();
	const { markers, driverMarkers, destinationMarkers, decodedPolylines } = location.state || {}; // Get state from PartyPage
	const colors = ['blue', 'red', 'green', 'magenta','#215d17', 'cyan', 'purple', 'yellow', 'pink', 'brown' ];
	const navigate = useNavigate();
	return (
		<div>
			<h1>New Page</h1>
			<p>This is a new page.</p>
			<button onClick={() => navigate('/')}>Go to Party Page</button>
			<MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '80vh', width: '100%', margin: '10px' }}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				{markers.map(marker => (
					<Marker
						key={marker.id}
						position={marker.position}
						icon={customIcon}
					>
						<Tooltip permanent>
							{marker.name}
						</Tooltip>
						<Popup>
							{marker.name}: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
						</Popup>
					</Marker>
				))}
				{driverMarkers.map(sourceMarker => (
					<Marker
						key={sourceMarker.id}
						position={sourceMarker.position}
						icon={sourceIcon}
					>
						<Tooltip permanent>
							{sourceMarker.name}
						</Tooltip>
						<Popup>
							{sourceMarker.name}: {sourceMarker.position[0].toFixed(4)}, {sourceMarker.position[1].toFixed(4)}
						</Popup>
					</Marker>
				))}
				{destinationMarkers.map(destinationMarker => (
					<Marker
						key={destinationMarker.id}
						position={destinationMarker.position}
						icon={destinationIcon}
					>
						<Tooltip permanent>
							{destinationMarker.name}
						</Tooltip>
						<Popup>
							{destinationMarker.name}: {destinationMarker.position[0].toFixed(4)}, {destinationMarker.position[1].toFixed(4)}
						</Popup>
					</Marker>
				))}
				{decodedPolylines.map((polyline, index) => (
					<Polyline key={index} positions={polyline} color={colors[index % colors.length]} weight={5} />
				))}
			</MapContainer>
		</div>
	);
};

export default RoutePage;
