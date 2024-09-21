import React from 'react';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import {PrimaryButton} from '../components/PrimaryButton';
import 'reactjs-popup/dist/index.css';

const HomePage = () => {
	const handleGoToPartyPage = () => {
		alert("Navigating to the Party Page!");
	};

	return (
		<div
			style={{
				fontFamily: 'Jua, sans-serif',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				width: '100vw',
				backgroundColor: 'var(--background-color)',
			}}
		>
			<div style={{textAlign: 'center'}}>
				<h1 style={{fontSize: '6vh', padding: '1rem 4rem'}}>Welcome to AStarFriends!</h1>
				<div style={{display: 'flex', justifyContent: 'center', gap: '10px', padding: '1rem 4rem'}}>
					<PrimaryButton text="Start a party?" onClick={handleGoToPartyPage}/>
				</div>
			</div>
		</div>
	);
}

export default HomePage;