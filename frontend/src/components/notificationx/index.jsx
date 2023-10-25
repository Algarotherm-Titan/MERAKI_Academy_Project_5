import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import './style.css'
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const users = useSelector((state) => state.auth.users);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("https://backend-kxp7.onrender.com/notif");
        if (response && response.data) {
          setNotifications(response.data.result);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchNotifications();
  }, []);
  notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const getSenderUsername = (senderId) => {
    if (senderId !== null) {
      const user = users.find((user) => user.id === senderId);
      return user ? user.username : senderId.toString();
    }
    return "Unknown Sender";
  };

  return (
    <Box p="4">
      <div className="noticaction">
        <ul className="news__tab__list">
          <li className="news__tab__item news__tab__item--active">
          Notification
          </li>
        </ul>
        <ul className="news__list">
          {notifications.slice(0, 5).map((notification) => (
            <li  class="news__item" key={notification.id}>
              <p>{getSenderUsername(notification.sender_id)}</p>
              {notification.comment_id !== null && (
                <p class="news__title ellipsis">Comment </p>
              )}
              {notification.like_id !== null && (
                <p class="news__title ellipsis">Like </p>
              )}
              <p class="news__date">{new Date(notification.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="background-video">
        
      </div>
    </Box>
  );
};

export default Notification;
