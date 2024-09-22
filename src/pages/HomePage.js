import React, {useState} from 'react';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import {PrimaryButton} from '../components/PrimaryButton';
import 'reactjs-popup/dist/index.css';
import InputField from '../components/InputField';

const HomePage = () => {
	const [showInput, setShowInput] = useState(false);
	const [showStart, setShowStart] = useState(false);
	const [partyCode, setPartyCode] = useState('');
	const [name, setName] = useState('');

	const handleJoinParty = () => {
		setShowInput(!showInput);
		setShowStart(false);
	};

	const handleStartParty = () => {
		setShowStart(!showStart);
		setShowInput(false);
	};

	const handleSubmit = () => {
		const partyValid = partyCode.match('^\\d{5}$');
		const nameValid = name.match('^[a-zA-Z _]{1,20}$');

		if (partyValid && nameValid) {
			const url = 'http://localhost:8000/join-party';
			const myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			const raw = JSON.stringify({
				name: name,
				party_code: partyCode,
			});

			const requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow',
			};

			fetch(url, requestOptions)
				.then((response) => response.text())
				.then((result) => {
					console.log(result);
					alert('Navigating to the Party Page!');
				})
				.catch((error) => console.error('Error:', error));
		} else {
			alert('Invalid input! Please try again.');
		}
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
				<h1 style={{fontSize: '6vh', padding: '1rem 4rem'}}>
					Welcome to AStarFriends!
				</h1>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gap: '10px',
						padding: '1rem 4rem',
					}}
				>
					<PrimaryButton text="Start a party?" onClick={handleStartParty}/>
					<PrimaryButton text="Join a party?" onClick={handleJoinParty}/>
				</div>

				{showInput && (
					<div
						style={{
							marginTop: '20px',
							padding: 40,
							borderRadius: 15,
							background: 'var(--accent-color)',
						}}
					>
						<h1 style={{color: 'white'}}>Joining...</h1>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: '12px',
							}}
						>
							<InputField
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<InputField
								type="text"
								placeholder="Enter a 5-digit party code"
								value={partyCode}
								onChange={(e) => setPartyCode(e.target.value)}
							/>
						</div>
						<button
							onClick={handleSubmit}
							style={{
								fontFamily: 'Jua, sans-serif',
								padding: '12px 18px',
								fontSize: '18px',
								borderRadius: '8px',
								marginTop: '20px',
								border: 'none',
								backgroundColor: 'var(--primary-color)',
								color: 'white',
								cursor: 'pointer',
								boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
								transition: 'background-color 0.3s, box-shadow 0.3s',
							}}
							onMouseOver={(e) => {
								e.target.style.backgroundColor = 'var(--secondary-color)';
								e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
							}}
							onMouseOut={(e) => {
								e.target.style.backgroundColor = 'var(--primary-color)';
								e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
							}}
						>
							Submit
						</button>
					</div>
				)}

				{showStart && (
					<div
						style={{
							marginTop: '20px',
							padding: 40,
							borderRadius: 15,
							background: 'var(--accent-color)',
						}}
					>
						<h1 style={{color: 'white'}}>Starting...</h1>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: '12px',
							}}
						>
							<InputField
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<InputField
								type="text"
								placeholder="Enter a 5-digit party code"
								value={partyCode}
								onChange={(e) => setPartyCode(e.target.value)}
							/>
							<InputField
								type="text"
								placeholder="Enter a 5-digit party code"
								value={partyCode}
								onChange={(e) => setPartyCode(e.target.value)}
							/>
							<InputField
								type="text"
								placeholder="Enter a 5-digit party code"
								value={partyCode}
								onChange={(e) => setPartyCode(e.target.value)}
							/>
						</div>
						<button
							onClick={handleSubmit}
							style={{
								fontFamily: 'Jua, sans-serif',
								padding: '12px 18px',
								fontSize: '18px',
								borderRadius: '8px',
								marginTop: '20px',
								border: 'none',
								backgroundColor: 'var(--primary-color)',
								color: 'white',
								cursor: 'pointer',
								boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
								transition: 'background-color 0.3s, box-shadow 0.3s',
							}}
							onMouseOver={(e) => {
								e.target.style.backgroundColor = 'var(--secondary-color)';
								e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
							}}
							onMouseOut={(e) => {
								e.target.style.backgroundColor = 'var(--primary-color)';
								e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
							}}
						>
							Submit
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
