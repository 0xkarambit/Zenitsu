import React from "react";

import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import Thoughts from "./components/Thoughts.js";

function App() {
	return (
		<div className="App">
			<Header />
			<div className="container">
				<Sidebar />
				<Thoughts />
			</div>
		</div>
	);
}

export default App;
