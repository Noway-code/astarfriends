import React from 'react';
import '../App.css';

export const PrimaryButton = ({text, onClick}) => {
	return (
		<div style={{padding: 16, margin: 5}}>
			<button
				style={{
					padding: '12px 24px',
					backgroundColor: 'var(--primary-color)',
					color: '#304b30',
					border: 'none',
					borderRadius: '5px',
					fontSize: '1.5rem',
					cursor: 'pointer',
					transition: 'background-color 0.2s ease',
					boxShadow: '0 4px 8px rgba(0, 0.1, 0.1, 0.2)',
					fontFamily: 'Jua, sans-serif'
				}}
				onMouseOver={(e) => (e.target.style.backgroundColor = 'var(--tertiary-color)')}
				onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--primary-color)')}
				onClick={onClick}
			>
				{text}
			</button>
		</div>
	);
};
