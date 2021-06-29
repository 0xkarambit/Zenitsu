// TODO: add focus selection.

import React, { useState, useEffect } from "react";

// stores
import { useListingType } from "./../stores/listingType.js";
import { useLoaded } from "./../stores/listingLoaded.js";
import { useLoggedIn } from "./../stores/loggedIn.js";

import "./ListingController.css";

const POSSIBLE_LISTING_TYPES = ["hot", "new", "rising", "top"];
const POSSIBLE_LISTING_TIMES = ["hour", "day", "week", "month", "year", "all"];

const ListingController = () => {
	const loggedIn = useLoggedIn((s) => s.loggedIn);

	const { listingType, listingTime, setListingType, setListingTime } =
		useListingType();

	const setLoaded = useLoaded((s) => s.setLoaded);

	// should i change displayMode to stack on value change ????
	const onListingTypeChange = (e) => {
		if (e.target.value === listingType) return null;
		setLoaded(false);
		setListingType(e.target.value);
	};
	const onListingTimeChange = (e) => {
		if (e.target.value === listingTime) return null;
		setLoaded(false);
		setListingTime(e.target.value);
	};

	if (!loggedIn) return <></>;

	return (
		<div className="ListingController">
			<select
				name="listingType"
				id="listingType"
				onChange={onListingTypeChange}
			>
				{POSSIBLE_LISTING_TYPES.map((type) => (
					<option value={type} selected={type === listingType}>
						{type}
					</option>
				))}
			</select>
			{/* we only want to show/use time when listingType is "top" */}
			{listingType === "top" && (
				<select
					name="listingTime"
					id="listingTime"
					onChange={onListingTimeChange}
				>
					{POSSIBLE_LISTING_TIMES.map((time) => (
						<option value={time} selected={time === listingTime}>
							{time}
						</option>
					))}
				</select>
			)}
		</div>
	);
};

export default ListingController;

// ? datalist vs select
// datalist is used with input | okk this is useful !!
