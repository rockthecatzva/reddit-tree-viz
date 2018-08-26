import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { select, selectAll } from "d3-selection";
import ReactD3Wrapper from "./ReactD3Wrapper";

class App extends Component {
  state = {
    parentArticle: undefined,
    commentData: []
  };

  componentDidMount() {
    const par = this;
    fetch(
      "http://rockthecatzva.com/reddit-apibounce-php/public/index.php/comments/top/news/year/controversial"
    )
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        // Examine the text in the response
        response.json().then(data => {
          console.log(data);
          const {
            author,
            created_utc,
            domain,
            id,
            num_comments,
            permalink,
            preview,
            score,
            subreddit_subscribers,
            thumbnail,
            thumbnail_height,
            thumbnail_width,
            title,
            ups,
            upvote_ratio,
            url
          } = data[0].data.children[0].data;
          const parentArticle = {
            author,
            created_utc,
            domain,
            id,
            num_comments,
            permalink,
            preview,
            score,
            subreddit_subscribers,
            thumbnail,
            thumbnail_height,
            thumbnail_width,
            title,
            ups,
            upvote_ratio,
            url
          };

          const recursivelyGetChildren = data => {
            return data.map(d => {
              const {
                body,
                title,
                upvote_ratio,
                ups,
                domain,
                score,
                created,
                id,
                author,
                num_crossposts,
                num_comments,
                permalink,
                url,
                subreddit_subscribers,
                created_utc
              } = d.data;

              if (typeof d.data.replies === "object") {
                return {
                  comment: body,
                  title,
                  upvote_ratio,
                  ups,
                  domain,
                  score,
                  created,
                  id,
                  author,
                  num_crossposts,
                  num_comments,
                  permalink,
                  url,
                  subreddit_subscribers,
                  created_utc,
                  replies: recursivelyGetChildren(d.data.replies.data.children)
                };
              } else {
                return {
                  comment: body,
                  title,
                  upvote_ratio,
                  ups,
                  domain,
                  score,
                  created,
                  id,
                  author,
                  num_crossposts,
                  num_comments,
                  permalink,
                  url,
                  subreddit_subscribers,
                  created_utc
                };
              }
            });
          };

          const commentData = recursivelyGetChildren(data[1].data.children);

          par.setState({ parentArticle, commentData });
        });
      })
      .catch(function(err) {
        console.log("Fetch Error :-S", err);
      });
  }

  render() {
    const { parentArticle } = this.state;
    const recursivelyGetReplyCounts = data =>
      data.map(d => {
        if (d.hasOwnProperty("replies")) {
          const r = recursivelyGetReplyCounts(d.replies);
          return { count: r.length, children: r };
        } else {
          return { count: 0 };
        }
      });

    const branchCounts = recursivelyGetReplyCounts(this.state.commentData);
    console.log(branchCounts);
    console.log(this.state.commentData);

    if (this.state.commentData.length > 0) {
      let t = this.state.commentData[0];
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        

        {parentArticle !== undefined && (
          <div>
            <p>{parentArticle.title}</p>
            <p>{parentArticle.ups}</p>
            <p>
              {Date(parentArticle.created_utc).toLocaleString("en-GB", {
                timeZone: "UTC"
              })}
            </p>
            <p>{parentArticle.num_comments}</p>
            <img src={parentArticle.thumbnail} />
            <ReactD3Wrapper chartData={this.state.commentData}  />
            
          </div>
        )}
      </div>
    );
  }
}

export default App;
