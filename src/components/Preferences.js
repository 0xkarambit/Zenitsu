import React, { useState, useEffect } from "react";
// import { useKeyMappings } from "./../stores/keymappings.js";

const Preferences = () => {
	// const { keyMappings, setKeyMapping } = useKeyMappings();
	// const keys = Object.keys(keyMappings);
	// gettings called on every rerender.
	// console.log(keyMappings);
	
	// const keyX = keys.map((key) => (
	// 	<tr>
	// 		<td>{keyMappings[key]}</td>
	// 		<td>
	// 			<KeyInput changeMapping={() => alert("nice")} defVal={key} />
	// 		</td>
	// 	</tr>
	// ));

	// useReactHookForms.

	return (
		<div className="" id="#over">
			<div className="overlay">
				<h1>helloworld !</h1>
				<section className="configure-keymappings">
					
				</section>
			</div>
		</div>
	);
};

export default Preferences;

const KeyInput = ({ changeMapping, defVal }) => {
	const [val, setVal] = useState(defVal);
	return <input value={val} onChange={(e) => setVal(e.target.value)} />;
};
