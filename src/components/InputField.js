import React from 'react';

const InputField = ({type, value, onChange, placeholder}) => {
	return (
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			style={{
				padding: '12px 18px',
				fontSize: '18px',
				borderRadius: '8px',
				border: '2px solid var(--primary-color)',
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
				outline: 'none',
				transition: 'border-color 0.3s, box-shadow 0.3s',
				textAlign: 'center',
			}}
			onFocus={(e) => {
				e.target.style.borderColor = 'var(--secondary-color)';
				e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
			}}
			onBlur={(e) => {
				e.target.style.borderColor = 'var(--primary-color)';
				e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
			}}
		/>
	);
};

export default InputField;
