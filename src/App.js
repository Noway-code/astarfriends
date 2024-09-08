import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PartyPage from './pages/PartyPage';
import RoutePage from "./pages/RoutePage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PartyPage />} />
				<Route path="/route" element={<RoutePage />} />
			</Routes>
		</Router>
	);
};

export default App;
