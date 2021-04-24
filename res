TOP: https://oauth.reddit.com/r/pics/top?raw_json=1&count=0&limit=12
AUTHENTICATION: bearer -SXQFyih7bCEp1lpwUNXpq4U3fooLlw

basic NXNDNkROa0RtcHdYZXc6

access_token
new bearer -SO65VqdAzUmw9XhqagZS9tm525ap6g


https://www.reddit.com/api/v1/access_token


website: "bbf993c1-2842-43bb-8aa0-478757f6a2de"

https://news.ycombinator.com/item?id=24004346
authorization: basic NXNDNkROa0RtcHdYZXc6

# Comments fetching
https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks.json
dist = 1 means its the post...

2nd item:
	kind:"listing",
	data:
		children[]: // ok this has all the comments | thread heads |.
			0:
				data:
					ups,
					replies:
						data:
							children[]:
							|	0:
							|		data:
							|			body: "The kind of comment worth opening your inbox for"
							|			author
							|			score
								1:
									data: "Do you think that the people at Epstein's funeral knew he didn't die of natural causes?"
									// (wait 1's data object has a replies obj!)
									// ok makes sense since the 0th child doesnt have any replies and is a singleton kind of thread lol.
										replies:
											data:
												children[]
													0:
														data
															body: "Lol wut? Neither of the 2"
							|// this has the subsequent replies. single thread.
							// last reply has kind: "more", data: {count: 27, }