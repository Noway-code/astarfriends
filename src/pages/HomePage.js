import React, {useState} from 'react';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import {PrimaryButton} from '../components/PrimaryButton';
import InputField from '../components/InputField';
import {useNavigate} from 'react-router-dom';

const HomePage = () => {
	const [showInput, setShowInput] = useState(false);
	const [showStart, setShowStart] = useState(false);
	const [partyCode, setPartyCode] = useState('');
	const [name, setName] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [description, setDescription] = useState('');
	const [host, setHost] = useState('');
	const [partyName, setPartyName] = useState('');
	const navigate = useNavigate();

	const handleJoinParty = () => {
		setShowInput(!showInput);
		setShowStart(false);
	};

	const handleStartParty = () => {
		setShowStart(!showStart);
		setShowInput(false);
	};

	const handleStartPartySubmit = () => {
		const nameValid = host.match('^[a-zA-Z _]{1,20}$');
		console.log(nameValid);

		if (nameValid && date && time) {
			const url = 'http://localhost:8000/create-party';
			const myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			const raw = JSON.stringify({
				host: host,
				name: partyName,
				date: date,
				time: time,
				description: description || 'No description provided',
			});
			const requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow',
			};

			fetch(url, requestOptions)
				.then(response => response.json()) // Expecting JSON response
				.then(result => {
					console.log(result);
					alert('Party created successfully! Party Code: ' + result.party_code);
					navigate('/party/host', {state: {host, partyName, date, time, description, partyCode: result.party_code}});
				})
				.catch(error => console.error('Error:', error));
		} else {
			alert('Invalid input! Please check your data.');
		}
	};

	const handleJoinSubmit = () => {
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
					navigate('/party/guest', {state: {name, partyCode}});
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
							onClick={handleJoinSubmit}
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
								value={host}
								onChange={(e) => setHost(e.target.value)}
							/>
							<InputField
								type="text"
								placeholder="Enter your event's name"
								value={partyName}
								onChange={(e) => setPartyName(e.target.value)}
							/>

							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								style={{
									fontFamily: 'Jua, sans-serif',
									padding: '12px 18px',
									fontSize: '18px',
									borderRadius: '8px',
									border: '2px solid var(--primary-color)',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
									outline: 'none',
									transition: 'border-color 0.3s, box-shadow 0.3s',
								}}
							/>

							<input
								type="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
								style={{
									fontFamily: 'Jua, sans-serif',
									padding: '12px 18px',
									fontSize: '18px',
									borderRadius: '8px',
									border: '2px solid var(--primary-color)',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
									outline: 'none',
									transition: 'border-color 0.3s, box-shadow 0.3s',
								}}
							/>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Enter a description"
								rows={2}
								style={{
									fontFamily: 'Jua, sans-serif',
									padding: '12px 4px',
									fontSize: '18px',
									borderRadius: '8px',
									border: '2px solid var(--primary-color)',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
									width: '200%',
									resize: 'vertical',
									outline: 'none',
									transition: 'border-color 0.3s, box-shadow 0.3s',
								}}
							/>
						</div>

						<button
							onClick={handleStartPartySubmit}
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
