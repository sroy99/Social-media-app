import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [pics, setPics] = useState([]);
  const [image, setImage] = useState("");

  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
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
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
    <div style={{ maxWidth: "950px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state ? state.pic : ""} />
          </div>
          <div>
            <h4>{state ? state.name : "loading"}</h4>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{pics.length} posts</h6>
              <h6>{state.followers.length} followers</h6>
              <h6>{state.following.length} following</h6>
            </div>
          </div>
        </div>

        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {pics.map((pic) => {
          return <img key={pic._id} src={pic.photo} alt="gal"></img>;
        })}
      </div>
    </div>
  );
};

export default Profile;
