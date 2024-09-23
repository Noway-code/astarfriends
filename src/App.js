import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import DebugPartyPage from './pages/DebugPartyPage';
import RoutePage from './pages/RoutePage';
import HomePage from './pages/HomePage';
import GuestPage from './pages/PartyPages/GuestPage';
import HostPage from './pages/PartyPages/HostPage';
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
				<Route path="/party/host" element={<HostPage/>}/>
				<Route path="/party/guest" element={<GuestPage/>}/>
				<Route path="/party/route" element={<RoutePage/>}/>
				<Route path="/DebugPartyPage" element={<DebugPartyPage/>}/>
			</Routes>
		</Router>
	);
};

export default App;
