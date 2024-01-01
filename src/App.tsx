/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, IProvider } from "@web3auth/base";
import { Card, Form } from "react-bootstrap";
import { FaComment, FaRecycle, FaRetweet, FaThumbsUp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import initializeWeb3auth from "./utils/authService";
import Twitter from "./twitter";
import RPC from "./evm";
import { APP_CONSTANTS } from "./constants";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [tweets, setTweets] = useState<Array<any> | null>(null);
  const [comment, setComment] = useState<string | "">("");
  const [userName, setUserName] = useState<string | "">("");
  const [profileImage, setProfileImage] = useState<string | "">("");
  const [newTweetName, setNewTweetName] = useState<string | "">("");
  const [newTweetDescription, setNewTweetDescription] = useState<string | "">("");
  const refreshTime = APP_CONSTANTS.REACT_APP_REFRESH_TIMER * 1000;

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = await initializeWeb3auth()
        if (web3auth) {
          setWeb3auth(web3auth);
          await web3auth.init();
          if (web3auth.connected) {
            if (!provider) {
              logout()
            }
            let user = await web3auth.getUserInfo();
            if (
              user.name &&
              user.name !== null &&
              user.name !== " " &&
              user.name !== ""
            )
              setUserName(user.name);

            if (
              user.profileImage &&
              user.profileImage !== null &&
              user.profileImage !== " " &&
              user.profileImage !== ""
            )
              setProfileImage(user.profileImage);
            console.log(user)
          }

          await fetchAllTweets();
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);


  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setUserName("")
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: 'twitter',
      }
    );

    setProvider(web3authProvider);

    if (web3authProvider) {
      let user = await web3auth.getUserInfo();

      if (
        user.name &&
        user.name !== null &&
        user.name !== " " &&
        user.name !== ""
      )
        setUserName(user.name);

      if (
        user.profileImage &&
        user.profileImage !== null &&
        user.profileImage !== " " &&
        user.profileImage !== ""
      )
        setProfileImage(user.profileImage);
    }
  };

  const refresh = (e: any) => {
    e.preventDefault();
    fetchAllTweets();
  };

  const fetchAllTweets = async () => {
    console.log("fetchalltweetsrunning");
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    try {
      let fetchedTweets = await rpc.getAllTweets();
      let tweets = [...fetchedTweets];
      setTweets(tweets.reverse());
    } catch (error) {
      console.log("error in fetching tweets", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await fetchAllTweets();
    }, 30000); // Run every 30 seconds (30000 milliseconds)
    return () => clearInterval(intervalId);
  }, []);

  const upVote = async (tweetIndex: any) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);
      await rpc.sendUpVoteTransaction(tweetIndex);
      fetchAllTweets();
    } catch (error) {
      console.log("failed to execute upvote transaction", error);
    }
  };

  const addNewTweet = (e: any) => {
    e.preventDefault();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);
      toast.success("Tweet added successfully", {
        position: toast.POSITION.TOP_CENTER,
      });

      rpc.sendWriteTweetTransaction(newTweetName, newTweetDescription);
      setTimeout(function () {
        fetchAllTweets();
      }, refreshTime);
      fetchAllTweets();
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_LEFT,
      });
      console.log("failed to execute new tweet transaction", error);
    }
  };

  const addComment = async (event: any, tweetIndex: any) => {
    event.preventDefault();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);
      toast.success("Comment added successfully - refresh after 30 sec", {
        position: toast.POSITION.TOP_CENTER,
      });

      await rpc.sendAddCommentTransaction(tweetIndex, comment);
      fetchAllTweets();
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_LEFT,
      });
      console.log("failed to execute add comment transaction", error);
    }
  };

  // Event handlers

  const handleCommentChange = async (event: any) => {
    setComment(event.target.value);
  };

  const handleNewTweetNameChange = async (event: any) => {
    setNewTweetName(event.target.value);
  };

  const handleNewTweetDescriptionChange = async (event: any) => {
    setNewTweetDescription(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loggedInView = (
    <>
      <button className="button" onClick={logout}>
        Logout
      </button>

      <div>
        <h1>New Tweet</h1>

        <Card>
          <Card.Body>
            <Card.Title>What are you thinking? Tweet it out!</Card.Title>

            <Card.Text></Card.Text>

            <Form.Control
              as="input"
              onChange={handleNewTweetNameChange}
              placeholder="Tweet Name"
            />

            <br></br>

            <br></br>

            <Form.Control
              as="textarea"
              onChange={handleNewTweetDescriptionChange}
              placeholder="Description"
            />

            <br></br>

            <FaRetweet onClick={addNewTweet} />
          </Card.Body>
        </Card>
      </div>

      <div>
        <h1>
          All Tweets <FaRecycle onClick={fetchAllTweets} />
        </h1>

        {(tweets || []).map((tweet: any, i) => (
          <div key={i}>
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <FaThumbsUp onClick={(event) => upVote(i)} /> {tweet.name}
                  </Card.Title>

                  <p>Total Upvotes: {tweet.upvotes}</p>

                  <p>Tweeted by: {tweet.fromAddress}</p>

                  <Card.Text>{tweet.description}</Card.Text>

                  <div>
                    <h3>All Comments</h3>
                    {tweet.comments.map((comment: any, j: any) => (
                      <div key={j}>
                        Comment {j + 1}: {comment}
                      </div>
                    ))}
                    <h3>New Comment</h3>
                    <span>
                      <Form.Control
                        as="input"
                        onChange={handleCommentChange}
                        placeholder="Your comment..."
                      />
                    </span>
                    &nbsp;
                    <span>
                      <FaComment onClick={(event) => addComment(event, i)} />
                    </span>
                  </div>
                </Card.Body>

                <a
                  href={
                    APP_CONSTANTS.OPENSEA_ASSETS_URL +
                    "/" +
                    APP_CONSTANTS.CONTRACT_ADDRESS +
                    "/" +
                    i
                  }
                  target="_blank" rel="noreferrer"
                >
                  Buy Now
                </a>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <div></div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      <div className="login-account">
        <button className="twitter-bg btn" onClick={login}>
          <img src="images/twitter-white.png" alt=""></img>
          Login to your Twitter account
        </button>
      </div>
    </>
  );

  return (
    <div className="grid">
      {provider ? (
        <Twitter
          logoutButton={logout}
          handleNewTweetDescriptionChange={handleNewTweetDescriptionChange}
          handleNewTweetNameChange={handleNewTweetNameChange}
          addNewTweet={addNewTweet}
          fetchAllTweets={fetchAllTweets}
          tweets={tweets}
          upVote={upVote}
          handleCommentChange={handleCommentChange}
          addComment={addComment}
          refresh={refresh}
          username={userName}
          profileimage={profileImage}
        />
      ) : (
        unloggedInView
      )}{" "}
      <ToastContainer />
    </div>
  );
}

export default App;
