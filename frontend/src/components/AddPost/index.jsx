import "./style.css";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const AddPost = () => {
  const [content, setContent] = useState("");
  const [image_url, setImage_url] = useState("");
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);
  const users = useSelector((state) => state.auth.users);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const processFile = async (files) => {
    setLoading(true);
    const CLOUD_NAME = "dv7ygzpv8";
    const UNSIGNED_UPLOAD_PRESET = "dpybqbgc";
    const file = files;
    const FETCH_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const DATA = new FormData();

    DATA.append("file", file);
    DATA.append("cloud_name", CLOUD_NAME);
    DATA.append("upload_preset", UNSIGNED_UPLOAD_PRESET);
    await fetch(FETCH_URL, {
      method: "post",
      mode: "cors",
      body: DATA,
    })
      .then((res) => res.json())
      .then((data) => {
        setImage_url(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const userP = users?.find((user1) => user?.id === user1.id);

  return (
    <div className="add-post">
      <div className="containerA">
        <div className="userAa">
          <div className="userInfoA">
            <img className="userInfoA_img" src={userP?.image} alt="" />
          </div>
          <input
            className="tt"
            placeholder={`What's on your mind ${userP?.username} . . . .`}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <div
            className="itemPh"
            onClick={() => {
              (async () => {
                const { value: file } = await Swal.fire({
                  title: "Select image",
                  input: "file",
                  inputAttributes: {
                    accept: "image/*",
                    "aria-label": "Upload your profile picture",
                  },
                });
                if (file) {
                  processFile(file);
                }
              })();
            }}
          >
            {/* <img src="" alt=""></img> */}
            <span>Add image</span>
          </div>
          <button
            className="learn-more"
            onClick={() => {
              axios
                .post(
                  "http://localhost:5000/posts/",
                  {
                    content,
                    image_url,
                  },
                  config
                )
                .then((result) => {
                  setContent("");
                  setImage_url("");
                  <>
                    {Swal.fire({
                      position: "top",
                      icon: "success",
                      title: result.data.message,
                      showConfirmButton: false,
                      timer: 1500,
                    })}
                  </>;
                })
                .catch((error) => {
                  <>
                    {Swal.fire({
                      position: "top",
                      icon: "warning",
                      title: "Please Add",
                      showConfirmButton: false,
                      timer: 1500,
                    })}
                  </>;
                });
            }}
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Share</span>
          </button>
          {image_url.length > 0 && (
            <img src={image_url} alt="" className="picU" />
          )}
        </div>
      </div>
      {loading && "loading...."}
    </div>
  );
};

export default AddPost;
