import React, {useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, Tooltip} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../App.css';
import {useLocation} from 'react-router-dom';
import {PrimaryButton} from '../../components/PrimaryButton.js';

const destinationIcon = L.icon({
	iconUrl: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/14_2-512.png',
	iconSize: [38, 38],
	iconAnchor: [22, 38],
	popupAnchor: [-3, -36],
});

const RoutePage = () => {
	const location = useLocation();
	const {host, partyName, date, time, description, partyCode} = location.state || {};
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [destinationMarkers, setDestinationMarkers] = useState([
		{
			id: 0,
			position: [51.515, -0.1],
			name: 'Destination Marker 0',
			draggable: false,
		},
	]);

	const handleCopyClick = () => {
		navigator.clipboard.writeText(partyCode);
		setTooltipVisible(true);
		setTimeout(() => setTooltipVisible(false), 2000);
	};

	const handleDragEnd = (id, event) => {
		const newPosition = event.target.getLatLng();
		setDestinationMarkers((markers) =>
			markers.map((marker) =>
				marker.id === id ? {...marker, position: [newPosition.lat, newPosition.lng]} : marker
			)
		);
	};

	const toggleDraggable = (id) => {
		setDestinationMarkers((markers) =>
			markers.map((marker) =>
				marker.id === id ? {...marker, draggable: !marker.draggable} : marker
			)
		);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				height: '100vh',
				width: '100vw',
			}}
		>
			<div style={{width: '45%', padding: '20px', textAlign: 'center', color: 'white'}}>
				<div
					style={{
						backgroundColor: 'var(--accent-color)',
						color: 'var(--text-color)',
						padding: '10px',
						borderRadius: '15px',
					}}
				>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<h2 style={{marginRight: '10px'}}>Welcome to your party!</h2>
						<PrimaryButton text={`Your code is ${partyCode}`} onClick={handleCopyClick} padding="8px 16px" fontSize="1.5vh"/>
					</div>
					<div style={{position: 'relative', marginTop: '10px'}}>
						{tooltipVisible && (
							<div
								style={{
									position: 'absolute',
									top: '-15px',
									left: '50%',
									transform: 'translateX(-50%)',
									backgroundColor: 'black',
									color: 'white',
									padding: '5px 10px',
									borderRadius: '4px',
									fontSize: '12px',
								}}
							>
								Added to clipboard
							</div>
						)}
					</div>
					<div style={{textAlign: 'left', fontSize: '1.25rem', color: 'var(--text-color)', marginTop: '20px'}}>
						<p>Host name: {host}</p>
						<p>Party name: {partyName}</p>
						<p>Date: {date}</p>
						<p>Time: {time}</p>
						<p>Description: {description}</p>
						{destinationMarkers.map((marker) => (
							<PrimaryButton text={marker.draggable ? 'Disable Drag Destination' : 'Enable Drag Destination'} key={marker.id}
							               fontSize="2vh"
							               padding="8px 16px"
							               onClick={() => toggleDraggable(marker.id)}/>
						))}
					</div>

				</div>

				<MapContainer
					center={[51.505, -0.09]}
					zoom={13}
					style={{
						height: '50vh',
						width: '100%',
						marginTop: '20px',
						borderRadius: '15px',
						border: '1px solid tan',
					}}
				>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
					{destinationMarkers.map((marker) => (
						<Marker
							key={marker.id}
							position={marker.position}
							draggable={marker.draggable}
							icon={destinationIcon}
							eventHandlers={{
								dragend: (event) => handleDragEnd(marker.id, event),
							}}
						>
							{marker.draggable && (
								<Tooltip permanent>
									<span>Drag me!</span>
								</Tooltip>
							)}

							<Popup>
								Destination Marker {marker.id}: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
							</Popup>
						</Marker>
					))}
				</MapContainer>
			</div>

			<div
				style={{
					width: '45%',
					padding: '20px',
					textAlign: 'center',
					backgroundColor: 'var(--accent-color)',
					color: 'white',
				}}
			>
				<h2>Right Side Content</h2>
				<p>This is the content on the right side.</p>
			</div>
		</div>
	);
};

export default RoutePage;
