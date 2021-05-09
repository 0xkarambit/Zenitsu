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


https://www.reddit.com/r/memes/comments/my7u7e/bee_movie_was_weird_times.json/
what is this "post_hint": "image" in here ?
preview
	images
		source: {
			url:,
		}
		resolutions: [
			{}
		]

found "is_video"
"media"

this doesnt work as expected
{selftext && (
				<p className="postbody">
					{displayMode === "stack"
						? selftext.slice(0, 200)
						: selftext}
				</p>
			)}
// mod posts
distinguished: moderator

how do i know what ."url" is ? | post link | video link | image | forwarding link |

the ones withoit images dont have a thumbnail ???
we can use the "thumbnail_height", "thumbnail_width"....

post Object properties: pinned, over_18, archived, spoiler, locked, send_replies?, is_video?, subreddit_type

how do we use the preview object ???? (cors err ifirc)

VIDEO
| ok so url ie (https://v.redd.it/7dqo4hc1itx61) takes you to the post url eventually. SO ADD DASH_360.mp4?source=fallback at end


OK it says rich:video for external sources.

ok so we will have to parse FancyPants comments and markdown comments differently.
some have <div class="md"></div>