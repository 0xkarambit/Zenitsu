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

now we have to show tweets too 
look at rdddeck.com | every post has a domain next to the title area

ex : https://www.reddit.com/r/Futurology/comments/n7q6m8/startup_expects_to_have_lab_grown_chicken_breasts/.json
has domain: ft.com
has flair: BioTech

IMP OBS: the domains for which rdddeck.com doesnt have a specific component to display it just shows the link.
what is this "is_reddit_media_domain" ?

give option to truncate the long post titles. 

spoiler was for :/https://www.reddit.com/r/Boxing/comments/n8607o/spoiler_saul_alvarez_vs_billy_joe_saunders/

Q: what is a self post reddit ?
A: A self post is a text post, instead of a link post. A link post directs to an external link. A self post is nothing but the text you enter. A link post earns you link karma, a self post does not.

_____________FOR thumbnail___________________
Submissions have a "submission.thumbnail" attribute.
Although keep in mind, if there are no possible thumbnails, they will be
keywords referring to the default reddit icons ("self", "image", "default"...).

thumbnail images: https://www.reddit.com/r/redditdev/comments/2wwuje/what_does_it_mean_when_the_thumbnail_field_has/


multiple images
wtf there is no post_hint https://www.reddit.com/r/StardustCrusaders/comments/n8e5cr/my_joseph_joestar_cosplay.json


Video wont play: http://localhost:3000/https://www.reddit.com/r/Images/comments/n8fzpm/art_edit_howling_at_the_moon_in_norway/

add FLAIRS |add nsfw flairs.
add locatStorage support.
change the subreddit red innerHTMl

// ? OK SO I CANT GET THE ICON_IMG (without OAuth ig)|| Error 403 also we cant load these for every comment. too much data use
not able to make pos: sticky work.
OK SO NOW WE CANT browse a sub if we see a post directly in single mode.

NOTES for post 

only add attribute if in "focus" mode, set a fixed or user adjustably fixed width for the post and give space to comments
some a half sized : http://localhost:3000/https://www.reddit.com/r/quotes/comments/n8vuz5/before_you_marry_a_person_you_should_first_make/
some take all the space : http://localhost:3000/https://www.reddit.com/r/quotes/comments/n8vuz5/before_you_marry_a_person_you_should_first_make/

are the videos even working ?? and images are lagging too right ??!


video not working: http://localhost:3000/memes/https://www.reddit.com/r/memes/comments/n9wg5r/its_high_noon/

triggered only get popped up if FocusView is reloaded but not if we go back to the same page, from another sub.
image gallery not working : https://www.reddit.com/r/Pictures/comments/nbvy1u/gary_breckheimer_the_transition_from_fashion_to/
image src changings while scrolling are not snappy.
while scrolling focus on the post. to scroll up. 
do different subs do spoiler info differently ? https://www.reddit.com/r/pics/comments/nbzqeh/behind_the_scenes_of_king_kong/

submitting a sub-sel with no change makes you lose the forward history !!.

type prefixes

t1_	Comment
t2_	Account
t3_	Link
t4_	Message
t5_	Subreddit
t6_	Award

checkout:  https://terminal.sexy/
react-split-pane

should i use a wrapper ? https://www.npmjs.com/package/snoowrap

use: https://www.npmjs.com/package/react-scrollbar

when subreddit is changed, the previous posts are shown for some time until new posts are loaded.
no cant do

focus on last Viewed Card. and start slideshow from last viewed card. 
and dim cards that have been viewed.
why does Thoughts get remounted each time i click on a post.


why is this blurred ??? http://localhost:3000/stardustcrusaders/https://www.reddit.com/r/StardustCrusaders/comments/ncslzh/i_got_a_dio_figure_for_16_dollars_but_couldnt/

videos dont switch when scrolling ??? w ! also videos only work for r/stardustcrusaders
check if img has been deleted

ok wtf deleted or not ? http://localhost:3000/stardustcrusaders/https://www.reddit.com/r/StardustCrusaders/comments/ncn9rz/part_6_style_baoh_made_by_me_ref/

remap shift + p to <- and shift + n to -> key.
https://golden-layout.com/

scrollbar: https://css-tricks.com/almanac/properties/s/scrollbar/

untill we fix the gallery situation we can just render a link to the gallery.
should i use url_overridden_by_dest for all links rendered ?

not cool: http://localhost:3000/showerthoughts/https://www.reddit.com/r/Showerthoughts/comments/ncn56i/if_vampires_announced_themselves_to_the_world/

video not working: http://localhost:3000/wholesome/https://www.reddit.com/r/wholesome/comments/ncyc11/3/


YESS I CAN FORCE A RERENDER when i see that the sub has not changed !!!

add img expansion ability.

redesign the colors.

subs to use

stardustCrusades
WatchPeopleDieInside
popular
holup
memes
all
wholesome

add media type and external domain tags.

Gallery study
http://localhost:3000/stardustcrusaders/https://www.reddit.com/r/StardustCrusaders/comments/ndpmux/i_drew_iggy_on_paper_d_oc/

pref: allow user to specify his own color for comment thread lines, random, use progressively darker shades

----------------------
lot of things to learn in css

attr cant use colors
positionings, overflow, sticky cant work with flex parent and certial overflow values sometimes

opacity vs background-color: transparent;
----------------------------

add local stoarage and theme selection and changing. 

main point:
refactoring, better scrolling/slideshow, styling, better code patterns