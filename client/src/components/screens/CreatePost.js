import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import { Circular } from "styled-loaders-react";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          picURL: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({ html: "Created post Successfully", classes: "#43a047 green darken-1" });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "shatadrucld");
    fetch("https://api.cloudinary.com/v1_1/shatadrucld/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="card input-field" style={{ maxWidth: "500px", margin: "30px auto", padding: "20px", textAlign: "center" }}>
      <div className="row">
        <div className="input-field col s12">
          <input id="title" type="text" className="validate" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="active" htmlFor="title">
            Title
          </label>
        </div>
      </div>
      <div className="row">
        <div className="row">
          <div className="input-field col s12">
            <textarea id="content" className="materialize-textarea" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
            <label className="active" htmlFor="content">
              Content
            </label>
          </div>
        </div>
      </div>
      <div className="file-field input-field ">
        <div className="btn #64b5f6 blue darken-1">
          <span>File</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={() => {
          setLoaded(true);
          postDetails();
        }}
      >
        Submit
      </button>
      {loaded && <Circular size="20px" />}
    </div>
  );
};

export default CreatePost;
