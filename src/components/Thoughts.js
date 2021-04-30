import React, { useEffect, useRef, useState } from "react";
import Speech from "react-speech";

import "./thoughts.css";

import StackGrid from "react-stack-grid";
import { useHotkeys } from "react-hotkeys-hook";

export default function Thoughts({
  subreddit,
  setSubreddit,
  previousSubreddit
}) {
  // the displayMode gets set to $TESTINGMODE after every subreddit change.
  const TESTINGMODE = "stack";
  let [dataReceived, setDataReceived] = useState(false);
  const validModes = ["focus", "stack"];
  const [displayMode, setDisplayMode] = React.useState("");
  const [postsData, setPostsData] = React.useState([]);
  // comments will be loaded by children components.
  const [comments, setComments] = React.useState([]);

  // Code to show post referenced in URL pathname
  useEffect(() => {
    if (window.location.pathname !== "/") {
      // isRedditPosturl
      // window.location.pathname doesnt show ?params at end.
      // console.log(window.location.pathname);
      let postUrl = `${window.location.pathname.slice(1)}.json`;
      // let postUrl = `https://www.reddit.com/r/${window.location.pathname}.json`
      fetch(postUrl)
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((data) => {
          let d = data[0].data.children;
          // set posts
          setPostsData(d);
          // set comments
          let commOBJ = {
            // check other declaration for duplicae // in url and search
            url: data[0].data.children[0].data.permalink,
            comments: data[1].data.children
          };
          setComments([commOBJ]);
          setDisplayMode("focus");
        })
        .catch(console.log);
    }
  }, []);

  // fetching the data on mount;
  React.useEffect(() => {
    // const url = "https://www.reddit.com/r/Showerthoughts/top/?t=month";
    // by default .json at the end pulls the hot listings
    // is this try-catch useless lol.
    try {
      const url = `https://www.reddit.com/r/${subreddit}.json`;
      fetch(url)
        .then((res) => {
          if (res.status === 200) return res.json();
          // ok so the try-catch cant catch errors thrown in these callbacks hmmm.
          else if (res.status === 403) throw Error("private");
          else if (res.status === 404) throw Error("Not Found");
        })
        .then((json) => {
          console.log(json.data.children);
          setPostsData(json.data.children.slice(1));
          // if we set the data before we have the data the other components try to render using the data which results in errors.
          setDisplayMode(TESTINGMODE);
          setDataReceived(true);
        })
        .catch((e) => {
          // todo: add msg for community doesnt exist 404
          if (e.message === "private") {
            alert("cannot browse private community");
          } else if (e.message === "Not Found") {
            alert("no such community exists");
          }
          setSubreddit(previousSubreddit.current);
        });
    } catch (e) {
      console.log(e);
    }
  }, [subreddit]);

  const findComment = (link) =>
    comments.filter((val) => `${val.link}.json` === link);

  const getComments = async (postUrl) => {
    console.log("HEY", postUrl);
    // todo: FIX: find comment is not working
    let foundCom = findComment(postUrl);
    console.log({ foundCom });
    if (foundCom.length !== 0) return foundCom[0];

    // if comments are not in comments fetch them;
    try {
      const res = await fetch(postUrl);
      const c = await res.json();
      let link = c[0].data.children[0].data.permalink; // | id | subreddit_id | title | permalink | url;
      // kind: "listing" | "t1" | "t3"
      let comObj = {
        link: link,
        comments: c[1].data.children
      };
      setComments((coms) => coms.concat([comObj]));
      return comObj;
    } catch (e) {
      // ok try to know why it failed
      // wait why did this url even appear here .....
      // todo: inspect the listings obj
      console.log("got here");
      if (e.message === "Failed to fetch") {
        // likely an image
        const img = await fetch(postUrl.slice(0, postUrl.length - 5));
        const blob = await img.blob();
        // blob to base64data;
        let base64data = "";
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          base64data = reader.result;
          console.log(base64data);
        };
      }
      return 1;
    }
  };

  const initPostNo = useRef(0);
  const expandView = (postNo) => {
    console.log(postNo);
    initPostNo.current = Number(postNo);
    setDisplayMode("focus");
  };
  // hmmm is passing initPostNo instead of setInitPostNo gonna take more memry ?

  return (
    <div className="viewarea">
      {/*should we add a powerbar here to control the view styles etc ?? */}
      {displayMode === "stack" && (
        <StackGrid columnWidth={300}>
          {postsData &&
            // this doesnt need any initial no data phase protection coz postsData has 0 elements at that time
            postsData.map((post, i) => (
              <Post
                key={i}
                index={i}
                {...post.data}
                expandView={expandView}
              ></Post>
            ))}
        </StackGrid>
      )}
      {/*when i used the useRef hook to store dataReceived it didnt work coz after being set to true it did not cause a re-render */}
      {displayMode === "focus" && dataReceived && (
        <Focus
          postsData={postsData}
          getComments={getComments}
          initPostNo={initPostNo.current}
        />
      )}
    </div>
  );
}

function Post({
  title,
  selftext,
  score,
  author,
  total_awards_received,
  num_comments,
  created_utc,
  permalink,
  thumbnail,
  preview,
  url,
  displayMode = "stack",
  expandView = () => {},
  index
}) {
  const link = `https://www.reddit.com${permalink}`;
  const badThumbnail = ["", "self"];
  // const imageUrl = preview.images[0].resolutions[] // these urls dont work restricted BUT url will work here
  // todo: oh there can be multiple photos
  const dateCreated = new Date(created_utc).toString();
  return (
    <div
      className="post"
      onClick={() => {
        expandView(index);
      }}
    >
      <p className="author">{`u/${author}`}</p>
      <h2 className="title">{title || "title"}</h2>
      <p className="postbody">
        {(() => {
          if (selftext) {
            return displayMode === "stack" ? selftext.slice(0, 200) : selftext;
          }
        })()}
      </p>
      {/* IMAGE imlementaion region */}
      {displayMode === "stack" && !badThumbnail.includes(thumbnail) && (
        <img src={thumbnail} alt="thumbnail"></img>
      )}
      {displayMode === "focus" && (
        <img
          height="400px"
          width="400px"
          src={url}
          alt="thumbnail"
          style={{ objectFit: "contain" }}
        ></img>
      )}
      {/* IMAGE implementation regionEnd */}
      {/* score: {score} {total_awards_received} {num_comments}
				{created_utc} */}
      <span className="details">
        score: {score} {total_awards_received}
        {dateCreated}
      </span>
      {/* <div className="speech">
				<Speech stop={true} pause={true} resume={true} text={title} />
			</div> */}
      {/*todo: OK so the url here that we consider the link to comments is the image link ends in png
			 in r/mechanicalkeyboards but in r/showerthoughts $url is a link to the post comments
			 FIX: instead use permalink [nope didnt work] sometimes it does lol
			 		--oh ya it did work i had a syntax error url : permalink
			 idea: hmm check for png / jpg / gif / mp4 etc at end (for video its v.reddit.... no mp4)
			 idea: can we get image with "thumbnail" ?*/}
      <a href={link}>{link}</a>
    </div>
  );
  // score, total_awards_received
}

const Focus = ({ postsData, getComments, initPostNo = 0 }) => {
  const [currentPost, setCurrentPost] = useState(initPostNo);
  const [currentComments, setCurrentComments] = useState([]);
  // currentComments : {url:[url], comments: obj `children[]]`}
  const currentPostData = postsData[currentPost].data;

  // https://github.com/jaywcjlove/hotkeys/#defining-shortcuts
  useHotkeys("n", () =>
    setCurrentPost((currentPost) =>
      currentPost === postsData.length - 1 ? currentPost : ++currentPost
    )
  );
  useHotkeys(
    "p",
    () =>
      setCurrentPost((currentPost) => (currentPost === 0 ? 0 : --currentPost))
    // practically we should load more posts at this point. or show a msg when the listing has been finished
  );

  useEffect(() => {
    // Load Comments
    // let curl = `${"https://www.reddit.com/r/Showerthoughts/comments/mw2amn/having_to_attend_a_wedding_you_dont_want_to_sucks/"}.json`;
    let curl = `https://www.reddit.com${currentPostData.permalink}.json`;
    // todo: change url to permalink in above line
    const result = getComments(curl);
    result.then((comObj) => {
      if (comObj === 1) {
        // likely fetch request went wrong.
        alert("likely fetch request went wrong");
        // todo we need better error handling lol.
        return null;
      }
      console.log(comObj);
      setCurrentComments(comObj.comments);
    });
    // document.addEventListener("keydown", _handleEscKey);
    // chance to delete comments from memory when post changes ?...
  }, [currentPostData, currentPost]);

  return (
    <>
      <Post {...currentPostData} displayMode={"focus"} />
      {/*<Comments/>*/}
      <div className="comments">
        {currentComments &&
          currentComments.map((commentObj) => {
            if (commentObj.kind === "more") return null;
            return (
              <Comment
                data={commentObj.data}
                topLevel={true}
                key={commentObj.data.id}
              />
            );
          })}
      </div>
    </>
  );
};

const Comment = ({ data, ml = 0, topLevel = false }) => {
  // Comment is a recursive component.
  const styles = { marginLeft: `${ml}px` };
  const mlinc = 20;
  let className = topLevel ? "toplevel comment" : "comment";
  return (
    // using key as [commentObj]data.id idk how the id is used in reddit tho.
    <div className={className}>
      <p style={styles}> {data.body} </p>
      {data.replies !== "" &&
        data.replies.data.children.map((replyData) => {
          // replyData is a standard comment Obj
          if (replyData.kind === "more") return null;
          // todo: return a <load more/> component;
          return (
            <Comment
              data={replyData.data}
              ml={ml + mlinc}
              key={replyData.data.id}
            />
          );
          // {data.replies && <Comment data={data.replies.data.children}></Comment>}
        })}
    </div>
  );
};

// {
// 	data.replies.data.children.map((replyData) => {
// 		// replyData is a standard comment Obj
// 		if (replyData.kind == "more") return null;
// 		// todo: return a <load more/> component;
// 		return <Comment data={replyData.data} ml={ml + 2}></Comment>;
// 		// {data.replies && <Comment data={data.replies.data.children}></Comment>}
// 	});
// }
