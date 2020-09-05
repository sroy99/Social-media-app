// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { UserContext } from "../../App";
// import { CubeGrid } from "styled-loaders-react";

// const UserProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const { state, dispatch } = useContext(UserContext);
//   const { userId } = useParams();
//   useEffect(() => {
//     fetch(`/user/${userId}`, {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("jwt"),
//       },
//     })
//       .then((res) => res.json())
//       .then((result) => {
//         console.log(result);
//         setProfile(result);
//       });
//   }, []);
//   return (
//     <>
//       {profile ? (
//         <div style={{ maxWidth: "950px", margin: "0px auto" }}>
//           <div
//             style={{
//               margin: "18px 0px",
//               borderBottom: "1px solid grey",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-around",
//               }}
//             >
//               <div>
//                 <img
//                   style={{ width: "160px", height: "160px", borderRadius: "80px" }}
//                   src="https://res.cloudinary.com/shatadrucld/image/upload/v1597497121/pa6uxra518rdmhsj0amm.jpg"
//                 />
//               </div>
//               <div>
//                 <h4>{profile.user.name}</h4>

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     width: "108%",
//                   }}
//                 >
//                   <h6>{profile.posts.length} posts</h6>
//                   <h6>40 followers</h6>
//                   <h6>40 following</h6>
//                 </div>
//               </div>
//             </div>

//             <div className="file-field input-field" style={{ margin: "10px" }}>
//               <div className="btn #64b5f6 blue darken-1">
//                 <span>Update pic</span>
//                 <input type="file" />
//               </div>
//               <div className="file-path-wrapper">
//                 <input className="file-path validate" type="text" />
//               </div>
//             </div>
//           </div>
//           <div className="gallery">
//             {profile.posts.map((pic) => {
//               return <img key={pic._id} src={pic.photo} alt="gal"></img>;
//             })}
//           </div>
//         </div>
//       ) : (
//         <CubeGrid color="#64b5f6" />
//       )}
//     </>
//   );
// };

// export default UserProfile;

import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { CubeGrid } from "styled-loaders-react";

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true);

  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)

        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter((item) => item !== data._id);
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={userProfile.user.pic} />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {!userProfile.user.followers.includes(state._id) ? (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              )}
              {/* {!userProfile.user.followers.includes(state._id) ?(
                  <button style={‌{margin: "10px"}} onClick={followUser} className="btn #64b5f6 blue darken-1" type="submit" name="action">
                     Follow
                  </button>) :
                  (<button style={‌{margin: "10px"}} onClick={unFollowUser} className="btn #64b5f6 blue darken-1" type="submit" name="action">
                      UnFollow
                  </button>)} */}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return <img key={item._id} className="item" src={item.photo} alt={item.title} />;
            })}
          </div>
        </div>
      ) : (
        <CubeGrid color="#64b5f6" />
      )}
    </>
  );
};

export default UserProfile;
