import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PartyPage from './pages/PartyPage';
import RoutePage from './pages/RoutePage';
import HomePage from './pages/HomePage';
import WebFont from 'webfontloader';

const App = () => {
	useEffect(() => {
		WebFont.load({
			google: {
				families: ['Jua']
			}
		});
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/party" element={<PartyPage/>}/>
				<Route path="/route" element={<RoutePage/>}/>
			</Routes>
		</Router>
	);
};

export default App;
