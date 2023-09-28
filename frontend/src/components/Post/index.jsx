import "./style.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { setUser_id, setToggleProf } from "../redux/authSlicer/auth";
import Comment from "./Comment/comment";
import Like from "./Like/like";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon, RepeatIcon, EditIcon } from "@chakra-ui/icons";

const Post = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState("");
  const [commentUP, setCommentUP] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.userInfo);
  const users = useSelector((state) => state.auth.users);
  const user_id = useSelector((state) => state.auth.user_id);
  const toggleProf = useSelector((state) => state.auth.toggleProf);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    setTimeout(() => {
      toggleProf ? getPostsByUser(user_id) : getPosts();
    }, 1000);
  }, []);

  const getPosts = async () => {
    await axios
      .get(`http://localhost:5000/posts/`, config)
      .then((res) => {
        const rever = res.data.result;
        setPosts([...rever].reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPostsByUser = async (id) => {
    await axios
      .get(`http://localhost:5000/posts/search_1/${id}`)
      .then((res) => {
        const rever = res.data.result;
        setPosts([...rever].reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeletePost = async (id) => {
    await axios
      .delete(`http://localhost:5000/posts/${id}`)
      .then((res) => {
        toggleProf ? getPostsByUser(user_id) : getPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const UpdatePost = async (id, content) => {
    await axios
      .put(`http://localhost:5000/posts/${id}`, {
        content,
      })
      .then((res) => {
        toggleProf ? getPostsByUser(user_id) : getPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="post">
      <div className="containerP">
        {posts.map((post) => {
          const userPost = users.find((user1) => post.user_id === user1.id);
          return (
            <div key={post.post_id} className="postA">
              <div className="userP">
                <Link
                  to="/ProfilePage"
                  onClick={() => {
                    dispatch(setToggleProf(true));
                    dispatch(setUser_id(post.user_id));
                  }}
                >
                  <div className="userInfoP">
                    <img
                      className="userInfoP_img"
                      src={userPost.image}
                      alt=""
                    />
                    <div className="details">
                      <span className="name">{userPost.username}</span>
                      <span className="date">{post.created_at}</span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="content">
                <p>{post.content}</p>
                {post.image_url && (
                  <img
                    className="content_img"
                    src={post.image_url}
                    alt=""
                    style={{ borderRadius: "10px" }}
                  />
                )}
              </div>
              <div className="itemP">
                 <Like post={post} getPostsByUser={getPostsByUser} getPosts={getPosts}/> 
                <TextsmsOutlinedIcon
                  onClick={() => {
                    setCommentUP((show) => !show);
                    setPostId(post.post_id);
                  }}
                />
                Comments
                <ShareOutlinedIcon />
                Share
              </div>
              {commentUP && post.post_id === postId && (
                <Comment post_id={post.post_id}/>
              )}
              {user?.id === post.user_id && (
                <div className="menuP">
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      onClick={() => {
                        setPostId(post.post_id);
                      }}
                    />
                    {post.post_id === postId && (
                      <MenuList>
                        <MenuItem
                          icon={<RepeatIcon />}
                          command="⌘⇧N"
                          onClick={() => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Yes, delete it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                DeletePost(post.post_id);
                                Swal.fire(
                                  "Deleted!",
                                  "Your file has been deleted.",
                                  "success"
                                );
                              }
                            });
                          }}
                        >
                          Delete
                        </MenuItem>
                        <MenuItem
                          icon={<EditIcon />}
                          command="⌘O"
                          onClick={() => {
                            (() => {
                              Swal.fire({
                                input: "textarea",
                                inputLabel: ` What's on your mind ${user.username} ...`,
                                inputPlaceholder: "Type in your mind here...",
                                inputAttributes: {
                                  "aria-label": "Type your message here",
                                },
                                showCancelButton: true,
                              }).then((result) => {
                                UpdatePost(post.post_id, result.value);
                              });
                            })();
                          }}
                        >
                          Update
                        </MenuItem>
                      </MenuList>
                    )}
                  </Menu>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Post;
