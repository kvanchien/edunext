import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { CiLock, CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState("DN");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:9999/users?username=${username}&password=${password}`
      );
      const user = response.data[0];
      if (user) {
        if (user.campus === campus) {
          login(user.role, campus);
          navigate("/management");
        } else {
          alert("Wrong campus! Please select the correct campus.");
        }
      } else {
        alert("Wrong username or password! Check again!");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const [showFAQ, setShowFAQ] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <Container className="text-center">
      <Row className="wrap-form">
        <Row className="img">
          <a title="EduNext" href="/">
            <img
              alt="logo-fpt"
              src="/images/FPT_Education_logo.svg.png"
              style={{ width: "15%" }}
            />
          </a>
          <h6 className="mb-2">The social constructive learning tool</h6>
        </Row>

        <Row className="d-flex justify-content-center mt-3">
          <Button
            variant="outline-light"
            className="mr-2"
            style={{ color: "black", width: "250px" }}
          >
            <img
              alt="logo-google"
              src="/images/logo-google.png"
              style={{ width: "20px", marginRight: "5px" }}
            />
            Đăng nhập bằng Google
          </Button>
          <Button
            variant="outline-light"
            style={{ color: "black", width: "250px" }}
          >
            Sign in FEID
            <img
              alt="logo-fpt"
              src="/images/FPT_Education_logo.svg.png"
              style={{ width: "100px", marginLeft: "5px" }}
            />
          </Button>
        </Row>

        <div className="note" style={{ textAlign: "left" }}>
          <i style={{ fontSize: 10, marginLeft: "400px" }}>
            Check if the current device has <b style={{ color: "red" }}>VPN</b> enabled. Please turn it off.
          </i>
          <div className="col-12" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i style={{ fontSize: 10 }}>
              If a notification appears <b style={{ color: "red" }}>"AN ERROR HAS OCCURRED"</b> when login:
              <br />
              <b style={{ color: "red" }}>
                1: Refer to the instructions in Frequently Asked Question.
              </b>
              <br />
              <b style={{ color: "red" }}>
                2: Check your mobile phone if you can access the system? If unsuccessful, bring your device to the IT room
              </b>
            </i>
          </div>
        </div>

        <Row style={{ boxShadow: "rgb(229, 229, 229) 0px 0px 5px", padding: 15, marginTop: 5, border: "1px solid rgb(229, 229, 229)", width: "520px", marginLeft: "400px" }}>
          <span className="d-flex text-center justify-content-center mt-3 mb-3" style={{ fontWeight: "bold" }}>
            Select a campus before signing in to the system with username and password
          </span>

          <Form className="identity-form" onSubmit={handleSubmit}>
            <Row className="align-items-center">
              <Col xs={2} className="text-end">
                <span>Campus:</span>
              </Col>
              <Col xs={10}>
                <Form.Select aria-label="Campus" value={campus} onChange={(e) => setCampus(e.target.value)}>
                  <option value="DN">Đà Nẵng </option>
                  <option value="CT">Cần Thơ </option>
                  <option value="QN">Quy Nhơn </option>
                  <option value="HCM">Hồ Chí Minh </option>
                  <option value="HOLA">Hà Nội - Hòa Lạc </option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={1} className="text-end">
                <CiUser style={{ fontSize: "1.2em", color: "#6c757d" }} />
              </Col>
              <Col xs={11}>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={1} className="text-end">
                <CiLock style={{ fontSize: "1.2em", color: "#6c757d" }} />
              </Col>
              <Col xs={11}>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12} className="text-center">
                <Button variant="primary" type="submit" style={{ width: "200px" }}>
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>

        <Row className="d-flex mt-5">
          <ul className="contact-menu">
            <li style={{ listStyle: "none" }}>
              <div className="row">
                <div className="col-12" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i style={{ fontSize: 10 }}>
                    Khi hệ thống quá tải và quay hãy f5 và đăng nhập lại
                  </i>
                </div>
                <div className="col-12" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Button variant="" onClick={() => setShowFAQ(true)}>
                    <span style={{ color: "#1976D2" }}>Frequently Asked Question</span>
                  </Button>
                  <Modal show={showFAQ} onHide={() => setShowFAQ(false)} size="lg">
                    <Modal.Header closeButton>
                      <Modal.Title>FAQ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Container>
                        <Row>
                          <h5>If the login displays the message "AN ERROR HAS OCCURRED," please verify the system's time settings according to GMT+07:00.</h5>
                          <i className="text-danger">
                            Hãy chắc chắn rằng thời gian trên đồng hồ của hệ thống (LAPTOP hoặc PC) đồng nhất với thời gian hiện tại. (Hãy xem đồng hồ trên điện thoại của bạn để xác nhận lại với PC hoặc LAPTOP)
                          </i>
                          <ul>
                            <li>Checking and change time of laptop or pc to current times</li>
                            <a href="https://support.microsoft.com/en-us/windows/how-to-set-your-time-and-time-zone-dfaa7122-479f-5b98-2a7b-fa0b6e01b261#:~:text=To%20set%20your%20time%20and%20time%20zone%20in%20Windows%2010,%26%20language%20%3E%20Date%20%26%20time." target="_blank" rel="noopener noreferrer">
                              How to setting
                            </a>
                            <br />
                            <img src="/images/FAQ1.png" alt="FAQ1" />
                            <li>Setting times</li>
                            <br />
                            <img src="/images/FAQ2.png" alt="FAQ2" width="95%" />
                          </ul>
                        </Row>
                        <Row>
                          <h5>Why students can not find a classroom - <b className="text-danger">CQ</b></h5>
                          <ul>
                            <li>Default "CQs" received from FAP which, lecturer cannot be changed</li>
                            <li>The lecturer only changes the settings for "CQs" created by the lecturer himself</li>
                          </ul>
                          <h5>How to create group for slot?</h5>
                          <ul>
                            <li>Groups created for a "CQ" in the same "Slot" will be assigned to all "CQs" in the same "Slot" so lecturer only need to create groups once per "Slot".</li>
                            <li>To create a group of a "Slot" lecturer must click on the <b className="text-danger">"View detail"</b> then selected "CQ" and click on the "CREATE GROUP" button.</li>
                          </ul>
                          <img src="/images/FAQ4.png" alt="FAQ4" width="100%" />
                          <img src="/images/FAQ5.png" alt="FAQ5" width="100%" />
                          <img src="/images/FAQ6.png" alt="FAQ6" width="100%" />
                        </Row>
                      </Container>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="outline-primary" onClick={() => setShowFAQ(false)}>CLOSE</Button>
                      <Button variant="primary" onClick={() => setShowFAQ(false)}>OK</Button>
                    </Modal.Footer>
                  </Modal>
                </div>

                <div className="col-12" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Button variant="" onClick={() => setShowContact(true)}>
                    <span style={{ color: "#1976D2" }}>IT HELP DESK - PHONE: +84 913677744</span>
                  </Button>
                  <Modal show={showContact} onHide={() => setShowContact(false)} size="lg">
                    <Modal.Header closeButton>
                      <Modal.Title>Contact Support</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Control type="text" placeholder="Title *" autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control type="text" placeholder="Contact info (Mobile or Email). If it's important, please call directly at +84 913677744. * *" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <i className="fs-12">(*) For word documents: Paste single page per time</i>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="outline-primary" onClick={() => setShowContact(false)}>Close</Button>
                      <Button variant="primary" onClick={() => setShowContact(false)}>Save</Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </li>
          </ul>
          <p>Copyright © by FPT Education</p>
        </Row>
      </Row>
    </Container>
  );
}
