# IDEAS

1. switching to the colorful logo when the user changes the theme.
2. check https://rdddeck.com/ API calls to get a direction
3. add fullscreen API support, add detail mode view, keyboard shortcuts, OAUTH and transitions, animations and text-to-speech mode !
4. adding react-form and react-fetch libraries.
5. show loading screen in Thoughts component until posts load.
6. add a reading on loop mode.
7. when we try to load comments of a post in focus mode we get response as [post, comments] so we can update the stats of the post.
8. use ChakraUI ? idk.
9. add shift + p command pelet.
10. add keyboard shortcuts menu with `ctrl + /` and key bindings to go through threads smoothly.
11. add controller support.
12. [not related to this project but make a lazy JSON parsing website]

# todo

1. check the links, and yt bookmarks to find api call urls.
2. change the current fullscreen mechanism.
3. `WORK-IN-PROGRESS` implement focus mode components and navigation (with full keyboard shortcuts).
4. `DONE` find "distinguished":"moderator" key in posts to filter mod posts.
5. read https://github.com/AndrewKeig/react-speech#styles.
6. fix powerbar.
7. cancel the fetch request once the post has changed.
8. fix array index out of bounds on pressing p error.
9. fix comments not updating automatically after subreddit change.
10. watch out for 403 forbidden {reason: "private"}
11. inspect https://www.reddit.com/r/MechanicalKeyboards/comments/mxdn24/somehow_i_took_a_photo_that_looks_like_a_render.json/
12. and deal with the image loading CORS issue.
13. show URLs in comments as 'a' tag.
14. add click outside to unfocus & close the subreddit selection input.
15. add history to get back in stack from focus mode with react-dom.
16. do something about the bad rendering of stack mode on r/mechanicalkeyboards
17. found bug by pressing down `p` rapidly until the comments were out 5. of sync with the post.
18. i think the post are not ordered in the stack mode.
19. full post discription is not being shown check https://www.reddit.com/r/nosleep/comments/mys1be/my_neighbor_has_been_paying_me_to_spend_time_with/.
20. how are cross posts shown ??
21. link at body. https://www.reddit.com/r/nosleep/comments/myqgz0/scariest_nosleep_story_of_2020_voting_thread/
22. notify user if a community has no posts.
23. not rendered correctly https://www.reddit.com/r/Showerthoughts/comments/myp61j/the_amount_of_batman_sightings_in_a_neighborhood/gvwa74n?utm_source=share&utm_medium=web2x&context=3
24. Sometimes the stack layout gets jittery when changing subreddits.
25. sometimes videos get mistaken for photos with current implementation of Post component.
26. look at network tab while browsing r/mechanicalkeyboards in focus mode.
27. shows broken image @ reddit.com/r/todayilearned/comments/n1ed0s/til_all_beaches_in_hawaii_outside_of_military/

28. implement vertical split
29. comments & post sort by
30. add search posts/sub reddits
31. add video player
32. add see post based on url.
    Left image | Right Image
    INF. add OAuth

33. add load more comments button.
    24 solve the 'design' problem with loading more comments.
34. use "body_html" in comments to render with markdown.
35. error image not loading https://www.reddit.com/r/ShittyLifeProTips/comments/n1pmj5/slpt_feeling_lonely_or_unwanted_just_cancel/
36. error image not loading https://www.reddit.com/r/ShittyLifeProTips/comments/n1p3uf/slpt_if_youre_ever_feeling_scared_home_alone_just/
37. if you click any post on subreddit stack view when the post is bing loaded from url an error occurs.
38. https://stackoverflow.com/questions/20295875/how-to-load-more-pages-from-the-reddit-api
    {
    after: 't3\_' + lastId
    }
    maybe kind: "more" object's children.length should be greater than 1 ?

    https://www.reddit.com/r/MechanicalKeyboards/comments/mztkm7/girlfriend_has_been_converted/gw35txq/
    will get comments objects for just one comment ie the one with id gw35txq !

    last more object returns the next comments in line, not the very next apparently

39. look into url_overridden_by_dest. https://www.youtube.com/watch?v=b1oKDLoAHaI
40. paginnation : data.after https://youtu.be/b1oKDLoAHaI?t=488
41. video imp view -> https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#usage_notes

https://www.reddit.com/r/Showerthoughts/comments/n3hepl/one_day_in_the_future_cancer_will_be_treated_as_a/ in url pathname not working.

42. if we go back from a direct post load from the url the thoughts component is not rerendered and hence
    there is no data to render.
43. how about we try to get/find the post from the post url too.
44. update the url when the user scrolls the post in focus view without changing the history.
45. fix the inf loading screen on pressing n,p in direct post view.
46. add crosspost display https://www.reddit.com/r/MechanicalKeyboards/comments/n4etmq/seems_fit/
47. change url without changing history when scrolling through posts.
