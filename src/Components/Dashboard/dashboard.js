import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { axiosInstance } from "../../App";
import Modal from "react-modal";
import "./dashboard.css";

Modal.setAppElement("#root");

export default function Dashboard() {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [talkingTo, setTalkingTo] = useState("Mohamed Khalil Jendoubi");
  const [nbRequests, setNbRequests] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [requestsModal, setrequestsModal] = useState(false);
  const [blockedModal, setblockedModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  var messageend;
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
          console.log(resp.data);
        });
      axiosInstance
        .get("/friends/requests", {
          headers: {
            Authorization: window.sessionStorage.getItem("token"),
          },
        })
        .then((resp) => {
          console.log(resp.data);
          setNbRequests(resp.data.requests.length);
        });
      messageend.scrollIntoView({ behavior: "smooth" });
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
  }, [addModal]);
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
  }, [requestsModal]);
  return (
    <div className="dashboard_container">
      <div className="dashboard_gauchecontainer">
        <div className="dashboard_iconandname">
          <span className="dashboard_icon">
            <i className="fas fa-user"></i>
          </span>

          <div className="dashboard_username">{username}</div>
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
          <div className="dashboard_userelement">
            <i className="fas fa-user"></i>
            <span className="dashboard_usersname">Mohamed Khalil Jendoubi</span>
            <i className="fas fa-user-minus"></i>
            <i className="fas fa-ban"></i>
          </div>
        </div>
        <div>
          <input
            className="dashboard_recherche"
            type="text"
            placeholder="Rechercher"
          />
        </div>
      </div>
      <div className="dashboard_droitecontainer">
        <div className="dashboard_talkingtoname">
          <i className="fas fa-user"></i> {talkingTo}
        </div>
        <hr className="dashboard_separating" />
        <div className="dashboard_msg">
          <div className="msg-receive ">
            There are sometimes places where the fact that the logical and
            therefore reading order of flex items is separate from the visual
            order, is helpful. Used carefully the order property can allow for
            some useful common patterns to be easily implemented.
          </div>
          <div className="msg-sent ">
            There are sometimes places where the fact that the logical and
            therefore reading order of flex items is separate from the visual
            order, is helpful. Used carefully the order property can allow for
            some useful common patterns to be easily implemented.
          </div>
          <div className="msg-sent ">
            sdklfjsdklfjdslkjsdkl jfsdklj fsdlkjf sldkjf lskdjf lksdj flksdj
            lkfsdj flksdj lksfjdlkf jsdlk fjsdlkjf sldkjf
          </div>
          <div className="msg-receive ">
            There are sometimes places where the fact that the logical and
            therefore reading order of flex items is separate from the visual
            order, is helpful. Used carefully the order property can allow for
            some useful common patterns to be easily implemented.
          </div>
          <div className="msg-receive ">
            There are sometimes places where the fact that the logical and
            therefore reading order of flex items is separate from the visual
            order, is helpful. Used carefully the order property can allow for
            some useful common patterns to be easily implemented.
          </div>
          <div className="msg-receive ">
            There are sometimes places where the fact that the logical and
            therefore reading order of flex items is separate from the visual
            order, is helpful. Used carefully the order property can allow for
            some useful common patterns to be easily implemented.
          </div>
          <div className="msg-receive ">
            There are sometimes places where the fact that the logical and
            therefore reading order of flex items is separate from the visual
            order, is helpful. Used carefully the order property can allow for
            some useful common patterns to be easily implemented.
          </div>
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              messageend = el;
            }}
          ></div>
        </div>
        <div className="dashboard_sendmsg">
          <input className="dashboard_txtbox" type="text" placeholder="Aa" />
          <div className="dashboard_send_icon">
            <i className="fas fa-paper-plane"></i>
          </div>
        </div>
      </div>
      <Modal isOpen={addModal} className="dashboard_modal">
        <div className="dashboard_addmodal">
          <div className="dashboard_addmodaltop">
            <span>Search</span>
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
              placeholder="Search"
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
                      ADD
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={requestsModal} className="dashboard_modal">
        <div className="dashboard_addmodal">
          <div className="dashboard_addmodaltop">
            <span>Requests</span>
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
                  <div className="dashboardaddmodalperson">
                    <span>Person name</span> <button>Accept</button>
                    <button>Decline</button>
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
            <span>Blocked List</span>
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
              <div className="dashboardaddmodalperson">
                <span>Person name</span> <button>Unblock</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
