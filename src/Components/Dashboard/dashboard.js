import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { axiosInstance } from "../../App";
import Modal from "react-modal";
import "./dashboard.css";
import logo from "../../assets/sobflous.png";
import io from "socket.io-client";
const ENDPOINT = "http://51.75.253.157:7354";
let socket = io.connect(ENDPOINT);

Modal.setAppElement("#root");

export default function Dashboard() {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [talkingTo, setTalkingTo] = useState("");
  const [talkingToId, setTalkingToId] = useState("");
  const [nbRequests, setNbRequests] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [requestsModal, setrequestsModal] = useState(false);
  const [blockedModal, setblockedModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [chatLive, setChatLive] = useState([]);
  const [changes, setChanges] = useState(0);
  const [friendsRecherche, setFriendsRecherche] = useState("");
  var messageend;
  useEffect(() => {
    socket.off("message");
    socket.on("message", (data) => {
      console.log(data);
      console.log(talkingToId);
      if (
        (data.receiverId == talkingToId &&
          data.senderId == window.sessionStorage.getItem("id")) ||
        (data.receiverId == window.sessionStorage.getItem("id") &&
          data.senderId == talkingToId)
      ) {
        setChatLive([...chatLive, data]);
        console.log(chatLive);
      }
    });
  }, [chatLive, talkingToId]);
  useEffect(() => {
    messageend.scrollIntoView({ behavior: "smooth" });
  }, [chat, chatLive]);
  useEffect(() => {
    if (!window.sessionStorage.getItem("token")) {
      history.push("/");
    } else {
      setUsername(window.sessionStorage.getItem("username"));
      axiosInstance
        .get("/friends", {
          headers: {
            Authorization: window.sessionStorage.getItem("token"),
          },
        })
        .then((resp) => {
          setFriends(resp.data.friends);
        });
      axiosInstance
        .get("/friends/requests", {
          headers: {
            Authorization: window.sessionStorage.getItem("token"),
          },
        })
        .then((resp) => {
          setNbRequests(resp.data.requests.length);
        });

      setInterval(() => {
        axiosInstance
          .get("/friends", {
            headers: {
              Authorization: window.sessionStorage.getItem("token"),
            },
          })
          .then((resp) => {
            setFriends(resp.data.friends);
          });
        axiosInstance
          .get("/friends/requests", {
            headers: {
              Authorization: window.sessionStorage.getItem("token"),
            },
          })
          .then((resp) => {
            setNbRequests(resp.data.requests.length);
          });
      }, 5000);
    }
  }, []);
  useEffect(() => {
    if (addModal) {
      axiosInstance
        .get("/users", {
          headers: {
            Authorization: window.sessionStorage.getItem("token"),
          },
        })
        .then((resp) => {
          setUsersList(resp.data.users);
        });
    }
  }, [addModal, changes]);
  useEffect(() => {
    if (requestsModal) {
      axiosInstance
        .get("/friends/requests", {
          headers: {
            Authorization: window.sessionStorage.getItem("token"),
          },
        })
        .then((resp) => {
          setUsersList(resp.data.requests);
        });
    }
  }, [requestsModal, changes]);
  useEffect(() => {
    if (blockedModal) {
      axiosInstance
        .get("/blacklist", {
          headers: {
            Authorization: window.sessionStorage.getItem("token"),
          },
        })
        .then((resp) => {
          setUsersList(resp.data.users);
        });
    }
  }, [blockedModal, changes]);

  useEffect(() => {
    setChatLive([]);
    if (talkingToId.length > 0) {
      axiosInstance
        .get("/messages/" + talkingToId, {
          headers: {
            Authorization: window.sessionStorage.getItem("token"),
          },
        })
        .then((resp) => {
          setChat(resp.data.messages);
        });
    }
  }, [talkingToId]);
  return (
    <div className="dashboard_container">
      <div className="dashboard_gauchecontainer">
        <div className="dashboard_iconandname">
          <span className="dashboard_icon">
            <i className="fas fa-user"></i>
          </span>

          <div className="dashboard_username">
            {username}
            <span
              className="dashboard_disconnect"
              onClick={() => {
                window.sessionStorage.removeItem("id");
                window.sessionStorage.removeItem("username");
                window.sessionStorage.removeItem("token");
                window.location.reload();
              }}
            >
              se deconnecter
            </span>
          </div>
        </div>

        <hr className="dashboard_hr" />
        <div className="dashboard_icons">
          <i
            className="fas fa-user-plus"
            onClick={() => {
              setAddModal(true);
            }}
          ></i>
          <i
            className={
              nbRequests > 0
                ? "fas fa-user-friends dashboard_haverequests"
                : "fas fa-user-friends"
            }
            onClick={() => {
              setrequestsModal(true);
            }}
          ></i>
          <i
            className="fas fa-users-slash"
            onClick={() => {
              setblockedModal(true);
            }}
          ></i>
        </div>
        <hr className="dashboard_hr" />
        <div className="dashboard_messangescontainer">
          {friends.map((el, key) => {
            if (el.username.includes(friendsRecherche)) {
              return (
                <div key={key} className="dashboard_userelement">
                  <i
                    className="fas fa-user"
                    onClick={() => {
                      setTalkingTo(el.username);
                      setTalkingToId(el._id);
                      document.getElementById("textboxinput").focus();
                    }}
                  ></i>
                  <span
                    className="dashboard_usersname"
                    onClick={() => {
                      setTalkingTo(el.username);
                      setTalkingToId(el._id);
                      document.getElementById("textboxinput").focus();
                    }}
                  >
                    {el.username}
                  </span>
                  <i
                    className="fas fa-user-minus"
                    onClick={() => {
                      axiosInstance
                        .delete("/friends", {
                          data: {
                            id: el._id,
                          },
                          headers: {
                            Authorization: window.sessionStorage.getItem(
                              "token"
                            ),
                          },
                        })
                        .then((resp) => {
                          if (resp.data.error) {
                            alert(resp.data.error);
                          } else {
                            window.location.reload();
                          }
                        });
                    }}
                  ></i>
                  <i
                    className="fas fa-ban"
                    onClick={() => {
                      axiosInstance
                        .delete("/friends", {
                          data: {
                            id: el._id,
                          },
                          headers: {
                            Authorization: window.sessionStorage.getItem(
                              "token"
                            ),
                          },
                        })
                        .then((resp) => {
                          if (resp.data.error) {
                            alert(resp.data.error);
                          } else {
                            axiosInstance
                              .post(
                                "/blacklist",
                                {
                                  id: el._id,
                                },
                                {
                                  headers: {
                                    Authorization: window.sessionStorage.getItem(
                                      "token"
                                    ),
                                  },
                                }
                              )
                              .then((resp) => {
                                if (resp.data.error) {
                                  alert(resp.data.error);
                                } else {
                                  window.location.reload();
                                }
                              });
                          }
                        });
                    }}
                  ></i>
                </div>
              );
            }
          })}
        </div>
        <div>
          <input
            className="dashboard_recherche"
            type="text"
            placeholder="Rechercher"
            value={friendsRecherche}
            onChange={(event) => {
              setFriendsRecherche(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="dashboard_droitecontainer">
        <div className="dashboard_talkingtoname">
          <i
            style={talkingTo.length > 0 ? {} : { display: "none" }}
            className="fas fa-user"
          ></i>
          {talkingTo}
        </div>
        <img
          style={talkingTo.length == 0 ? {} : { display: "none" }}
          className="dashboard_sobflousimage"
          src={logo}
        />
        <hr className="dashboard_separating" />
        <div className="dashboard_msg">
          {chat.map((el, key) => {
            return (
              <div
                key={key}
                className={
                  el.receiverId == talkingToId ? "msg-sent" : "msg-receive "
                }
              >
                {el.content}
              </div>
            );
          })}
          {chatLive.map((el, key) => {
            return (
              <div
                key={key}
                className={
                  el.receiverId == talkingToId ? "msg-sent" : "msg-receive "
                }
              >
                {el.content}
              </div>
            );
          })}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              messageend = el;
            }}
          ></div>
        </div>
        <div
          className="dashboard_sendmsg"
          style={talkingTo.length > 0 ? {} : { display: "none" }}
        >
          <input
            id="textboxinput"
            className="dashboard_txtbox"
            type="text"
            placeholder="Aa"
            onKeyPress={(event) => {
              if (event.key == "Enter") {
                axiosInstance
                  .post(
                    "/messages",
                    {
                      receiverId: talkingToId,
                      content: msg,
                    },
                    {
                      headers: {
                        Authorization: window.sessionStorage.getItem("token"),
                      },
                    }
                  )
                  .then((resp) => {
                    if (resp.data.error) {
                      alert(resp.data.error);
                    } else {
                      setMsg("");
                    }
                  });
              }
            }}
            value={msg}
            onChange={(event) => {
              setMsg(event.target.value);
            }}
          />
          <div
            className="dashboard_send_icon"
            onClick={() => {
              axiosInstance
                .post(
                  "/messages",
                  {
                    receiverId: talkingToId,
                    content: msg,
                  },
                  {
                    headers: {
                      Authorization: window.sessionStorage.getItem("token"),
                    },
                  }
                )
                .then((resp) => {
                  if (resp.data.error) {
                    alert(resp.data.error);
                  } else {
                    setMsg("");
                  }
                });
            }}
          >
            <i className="fas fa-paper-plane"></i>
          </div>
        </div>
      </div>
      <Modal isOpen={addModal} className="dashboard_modal">
        <div className="dashboard_addmodal">
          <div className="dashboard_addmodaltop">
            <span>Rechercher</span>
            <span
              className="dashboard_modalclose"
              onClick={() => {
                setAddModal(false);
              }}
            >
              X
            </span>
          </div>
          <div className="dashboard_addsearch">
            <input
              placeholder="Rechercher"
              onChange={(event) => {
                axiosInstance
                  .get("/users/" + event.target.value, {
                    headers: {
                      Authorization: window.sessionStorage.getItem("token"),
                    },
                  })
                  .then((resp) => {
                    setUsersList(resp.data.users);
                  });
              }}
            />
            <div className="dashboard_addmodalpersons">
              {usersList.map((el, key) => {
                let check = true;
                friends.map((ele) => {
                  if (el._id == ele._id) {
                    check = false;
                  }
                });
                if (check) {
                  return (
                    <div
                      key={key}
                      style={
                        el.username == window.sessionStorage.getItem("username")
                          ? { display: "none" }
                          : {}
                      }
                      className="dashboardaddmodalperson"
                    >
                      <span>{el.username}</span>
                      <button
                        onClick={() => {
                          axiosInstance
                            .post(
                              "/friends",
                              {
                                id: el._id,
                              },
                              {
                                headers: {
                                  Authorization: window.sessionStorage.getItem(
                                    "token"
                                  ),
                                },
                              }
                            )
                            .then((resp) => {
                              alert(resp.data.message);
                            });
                        }}
                      >
                        Ajouter
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={requestsModal} className="dashboard_modal">
        <div className="dashboard_addmodal">
          <div className="dashboard_addmodaltop">
            <span>Invitations</span>
            <span
              className="dashboard_modalclose"
              onClick={() => {
                setrequestsModal(false);
              }}
            >
              X
            </span>
          </div>
          <div className="dashboard_addsearch">
            <div className="dashboard_addmodalpersons">
              {usersList.map((el, key) => {
                return (
                  <div key={key} className="dashboardaddmodalperson">
                    <span>{el.username}</span>
                    <button
                      onClick={() => {
                        axiosInstance
                          .put(
                            "/friends",
                            {
                              id: el._id,
                              accepted: true,
                            },
                            {
                              headers: {
                                Authorization: window.sessionStorage.getItem(
                                  "token"
                                ),
                              },
                            }
                          )
                          .then((resp) => {
                            alert(resp.data.message);
                            setChanges(changes + 1);
                          });
                      }}
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => {
                        axiosInstance
                          .put(
                            "/friends",
                            {
                              id: el._id,
                              accepted: false,
                            },
                            {
                              headers: {
                                Authorization: window.sessionStorage.getItem(
                                  "token"
                                ),
                              },
                            }
                          )
                          .then((resp) => {
                            alert(resp.data.message);
                            setChanges(changes + 1);
                          });
                      }}
                    >
                      Refuser
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={blockedModal} className="dashboard_modal">
        <div className="dashboard_addmodal">
          <div className="dashboard_addmodaltop">
            <span>Liste des utilisateurs bloqués</span>
            <span
              className="dashboard_modalclose"
              onClick={() => {
                setblockedModal(false);
              }}
            >
              X
            </span>
          </div>
          <div className="dashboard_addsearch">
            <div className="dashboard_addmodalpersons">
              {usersList.map((el, key) => {
                return (
                  <div key={key} className="dashboardaddmodalperson">
                    <span>{el.username}</span>
                    <button
                      onClick={() => {
                        axiosInstance
                          .delete("/blacklist", {
                            data: {
                              id: el._id,
                            },
                            headers: {
                              Authorization: window.sessionStorage.getItem(
                                "token"
                              ),
                            },
                          })
                          .then((resp) => {
                            if (resp.data.error) {
                              alert(resp.data.error);
                            } else {
                              setChanges(changes + 1);
                            }
                          });
                      }}
                    >
                      Débloquer
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
