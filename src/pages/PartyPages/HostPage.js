import React, {useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../App.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {PrimaryButton} from "../../components/PrimaryButton.js";


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

const RoutePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const {host, partyName, date, time, description, partyCode} = location.state || {};
	const [tooltipVisible, setTooltipVisible] = useState(false);

	const handleCopyClick = () => {
		navigator.clipboard.writeText(partyCode);
		setTooltipVisible(true);
		setTimeout(() => setTooltipVisible(false), 2000);
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
				<div style={{backgroundColor: 'var(--accent-color)', color: "var(--text-color)", padding: '10px', borderRadius: '15px'}}>
					<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
						<h2 style={{marginRight: '10px'}}>Welcome to your party!</h2>
						<PrimaryButton text={`Your code is ${partyCode}`} onClick={handleCopyClick}/>
					</div>
					<div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
						<div style={{position: 'relative'}}>

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
										opacity: tooltipVisible ? 1 : 0,
										visibility: tooltipVisible ? 'visible' : 'hidden'
									}}
								>
									Added to clipboard
								</div>
							)}
						</div>
					</div>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '12px',
						}}
					>
						<div style={{textAlign: 'left', fontSize: '1.25rem', color: "var(--text-color)",}}>
							<p>Host name: {host}</p>
							<p>Party name: {partyName}</p>
							<p>Date: {date}</p>
							<p>Time: {time}</p>
							<p>Description: {description}</p>
						</div>
					</div>

				</div>


				<MapContainer center={[51.505, -0.09]} zoom={13}
				              style={{height: '55vh', width: '100%', marginTop: '20px', borderRadius: 15, border: "tan"}}>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={[51.505, -0.09]} icon={sourceIcon}>
						<Popup>
							Source
						</Popup>
					</Marker>
					<Marker position={[51.505, -0.085]} icon={destinationIcon}>
						<Popup>
							Destination
						</Popup>
					</Marker>

				</MapContainer>
			</div>

			<div style={{width: '45%', padding: '20px', textAlign: 'center', backgroundColor: 'var(--accent-color)', color: 'white'}}>
				<h2>Right Side Content</h2>
				<p>This is the content on the right side.</p>
			</div>
		</div>
	);
};

export default RoutePage;