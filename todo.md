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
17. found bug by pressing down `p` rapidly until the comments were out of sync with the post.
18. i think the post are not ordered in the stack mode.
