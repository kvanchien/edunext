import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Menu, Form, Button, Modal, Breadcrumb, Tabs, List } from "antd";
import {
  FilePdfFilled,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadFilled,
  FileSearchOutlined,
  QuestionCircleFilled,
  CustomerServiceFilled,
  LogoutOutlined,
  WechatOutlined,
  CommentOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Container, Row, Col, Badge } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const items = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "Home",
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Information",
  },
  {
    key: "3",
    icon: <ReadFilled />,
    label: "Assignment",
  },
  {
    key: "4",
    icon: <FileSearchOutlined />,
    label: "Upcoming slots",
  },
  {
    key: "5",
    icon: <FilePdfFilled />,
    label: "Read user guide",
  },
  {
    key: "6",
    icon: <CustomerServiceFilled />,
    label: "Contact support",
  },
  {
    key: "7",
    icon: <QuestionCircleFilled />,
    label: "Frequently Asked Question",
  },
  {
    key: "8",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];

const QuestionDetailPage = () => {
  const { courseId, slotId, questionId } = useParams();
  const [course, setCourse] = useState(null);
  const [slot, setSlot] = useState(null);
  const [question, setQuestion] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFQA, setShowFQA] = useState(false);
  const { role, campus, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        console.log("Fetching course data for courseId:", courseId);
        const response = await fetch(
          `http://localhost:9999/courses/${courseId}`
        );
        const courseData = await response.json();
        console.log("Course data fetched:", courseData);
        setCourse(courseData);

        const selectedSlot = courseData.slots.find(
          (slot) => slot.id === parseInt(slotId)
        );
        console.log("Selected slot:", selectedSlot);
        setSlot(selectedSlot);

        if (selectedSlot) {
          const selectedQuestion = selectedSlot.question.find(
            (q) => q.id === parseInt(questionId)
          );
          console.log("Selected question:", selectedQuestion);
          setQuestion(selectedQuestion);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseData();
  }, [courseId, slotId, questionId]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === "2") {
      setShowInfo(true);
      setShowContact(false);
      setShowFQA(false);
    } else if (e.key === "1") {
      navigate("/management");
    } else if (e.key === "8") {
      handleLogout();
    } else if (e.key === "3") {
      navigate("/assignment");
    } else if (e.key === "5") {
      handleDownloadPDF();
    } else if (e.key === "6") {
      setShowContact(true);
    } else if (e.key === "7") {
      setShowFQA(true);
    } else {
      setShowInfo(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDownloadPDF = () => {
    window.open(
      "https://drive.google.com/uc?export=view&id=1Z2AL5snwR--kUPE6YFddw9pv9UxZ93K2",
      "_blank"
    );
  };

  const handleCloseContact = () => {
    setShowContact(false);
  };

  const handleCloseFQA = () => {
    setShowFQA(false);
  };

  const TabPane = Tabs.TabPane;

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  function callback(key) {
    console.log(key);
  }

  if (!course || !slot || !question) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <div style={{ display: "flex" }}>
            <div style={{ width: 256 }}>
              <img
                src="/images/FPT_Education_logo.svg.png"
                alt="logo"
                style={{
                  width: collapsed ? "80px" : "120px",
                  transition: "width 0.3s",
                }}
              />
              <br />
              <Button type="" onClick={toggleCollapsed} width={"50px"}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
              <Menu
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                onClick={handleMenuClick}
              />
            </div>
            <Modal
              visible={showContact}
              width={800}
              title="Support Contact"
              onCancel={handleCloseContact}
              footer={[
                <Button key="cancel" onClick={handleCloseContact}>
                  Close
                </Button>,
                <Button key="save" type="primary" onClick={handleCloseContact}>
                  Save
                </Button>,
              ]}
            >
              <h3 class="text-danger">
                Please refer to 'FQA' before requesting support
              </h3>
              <br />
              <h4 class="text-danger">
                Contact IT: <b>0913677744</b>. If the request is important
              </h4>
              <Form>
                <Form.Item>
                  <input
                    type="text"
                    placeholder="Title"
                    autoFocus
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item>
                  <input
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Contact info (Mobile or Email). If it's important, please call directly at +84 913677744. * *"
                  />
                </Form.Item>
                <Form.Item label="Description">
                  <textarea rows={6} style={{ width: "100%" }} />
                </Form.Item>
                <i className="fs-12">
                  (*)For word documents: Paste single page per time
                </i>
              </Form>
            </Modal>

            <Modal
              visible={showFQA}
              width={1000}
              title="FQA"
              onCancel={handleCloseFQA}
              footer={[
                <Button key="cancel" onClick={handleCloseFQA}>
                  Close
                </Button>,
                <Button key="save" type="primary" onClick={handleCloseFQA}>
                  OK
                </Button>,
              ]}
            >
              <Container>
                <Row>
                  <h5>
                    If the login displays the message "AN ERROR HAS OCCURRED,"
                    please verify the system's time settings according to
                    GMT+07:00.
                  </h5>
                </Row>
                <Row>
                  <i className="text-danger">
                    Hãy chắc chắn rằng thời gian trên đồng hồ của hệ thống
                    (LAPTOP hoặc PC) đồng nhất với thời gian hiện tại. (Hãy xem
                    đồng hồ trên điện thoại của bạn để xác nhận lại với PC hoặc
                    LAPTOP)
                  </i>

                  <ul>
                    <li>
                      Checking and change time of laptop or pc to current times
                    </li>
                    <a
                      href="https://support.microsoft.com/en-us/windows/how-to-set-your-time-and-time-zone-dfaa7122-479f-5b98-2a7b-fa0b6e01b261#:~:text=To%20set%20your%20time%20and%20time%20zone%20in%20Windows%2010,%26%20language%20%3E%20Date%20%26%20time."
                      target="_blank"
                    >
                      How to setting
                    </a>
                    <br />
                    <img src="/images/FAQ1.png" alt="FAQ1"></img>

                    <li>Setting times</li>
                    <br />
                    <img src="/images/FAQ2.png" alt="FAQ2" width={"95%"}></img>
                  </ul>
                </Row>

                <Row>
                  <h5>
                    Why students can't see the classroom on the list (If not
                    exist account)
                  </h5>
                  <ul>
                    <li>
                      Because students are added to the class late, students
                      should ask the instructor to add students to the classroom
                    </li>
                    <li>
                      The lecturer must click{" "}
                      <b className="text-danger">
                        "UPDATE STUDENT LIST, TIMETABLE"
                      </b>{" "}
                      to sync students for a classroom
                    </li>
                  </ul>
                  <img src="/images/FAQ3.png" alt="FAQ3" width={"95%"}></img>
                </Row>

                <Row>
                  <h5>Why lecturer can not change the setting of a CQ?</h5>
                  <ul>
                    <li>
                      Default "CQs" received from FAP which, lecturer cannot be
                      changed
                    </li>
                    <li>
                      The lecturer only changes the settings for "CQs" created
                      by the lecturer himself
                    </li>
                  </ul>
                  <h5>How to create group for slot?</h5>
                  <ul>
                    <li>
                      Groups created for a "CQ" in the same "Slot" will be
                      assigned to all "CQs" in the same "Slot" so lecturer only
                      need to create groups once per "Slot".
                    </li>
                    <li>
                      To create a group of a "Slot" lecturer must click on the{" "}
                      <b className="text-danger">"View detail"</b> then selected
                      "CQ" and click on the "CREATE GROUP" button.
                    </li>
                  </ul>
                  <img src="/images/FAQ4.png" alt="FAQ4" width={"100%"}></img>
                  <img src="/images/FAQ5.png" alt="FAQ5" width={"100%"}></img>
                  <img src="/images/FAQ6.png" alt="FAQ6" width={"100%"}></img>
                </Row>
              </Container>
            </Modal>
          </div>
        </Col>

        <Col md={6}>
          <div>
            <Breadcrumb
              items={[
                {
                  title: (
                    <a href="/management" style={{ color: "blue" }}>
                      Home
                    </a>
                  ),
                },
                {
                  title: (
                    <Link
                      style={{ color: "blue" }}
                      to={`/courses/${course.id}`}
                    >
                      {course.name}
                    </Link>
                  ),
                },
                {
                  title: "Slot " + slot.id,
                },
              ]}
            ></Breadcrumb>
            <br />
            <br />
            <h3>(Question) {question.context}</h3>
            <br />

            <br />

            <Card title="Content" style={{ marginBottom: 16 }}>
              <p>{question.context}</p>
            </Card>

            <div className="interaction-state mb-2 w-100-percent">
              Discussion time has been started.
              <br /> Students can comment and vote for comments during this
              time.
              <br /> Current Timezone: You are currently in <b>
                Asia/Saigon
              </b>{" "}
              time zone <b> (GMT+7)</b>
            </div>
            <br />
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="GROUP" key="1"></TabPane>

              <TabPane tab="DISCUSS" key="2"></TabPane>

              <TabPane tab="GRADE" key="3">
                <Card title="Functions" style={{ marginBottom: 16 }}>
                  <Row>
                    <Col md={8}>
                      <div className="col-8">
                        <Button style={{ backgroundColor: "greenyellow" }}>
                          Get Indiviual
                        </Button>{" "}
                        <Button type="primary">Refresh</Button>
                        <div>
                          <span>
                            Add round: Add a round designed for groups to
                            present, critique.
                          </span>
                          <br />
                          <span>
                            Get grade: Average score of the participating groups
                            in the round
                          </span>
                          <br />
                          <span>
                            Get indiviual: Average score of the participating
                            students the rounds
                          </span>
                          <br />
                          <span>
                            Timer: The set time is reached, a round will
                            automatically stop when it expires{" "}
                          </span>
                          <br />
                          <span className="text-warning">
                            Warning: The "Round" is still calculated as "active"
                            even if its status is "cancel."
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="combo-flex-center pt-3">
                        <svg
                          className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-6flbmm"
                          focusable="false"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          data-testid="AlarmOnOutlinedIcon"
                          width={"80px"}
                        >
                          <path d="M10.54 14.53 8.41 12.4l-1.06 1.06 3.18 3.18 6-6-1.06-1.06zm6.797-12.72 4.607 3.845-1.28 1.535-4.61-3.843zm-10.674 0 1.282 1.536L3.337 7.19l-1.28-1.536zM12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9m0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7" />
                        </svg>
                        <br />
                        <span>0: Unlimited</span>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              <TabPane tab="TEACHER'S MESSAGE" key="4">
                <span>
                  <WechatOutlined />
                  THERE ARE NO COMMENTS!
                </span>
              </TabPane>
            </Tabs>
          </div>
        </Col>

        <Col className="pt-4" md={2}>
          <Row>
            <h4>Group meeting</h4> <br />
            <span style={{ color: "red" }}>
              No meeting video link,
              <br /> click the below button to update
            </span>
            <br />
            <br />
            <Button type="primary" style={{ width: "100%" }}>
              UPDATE
            </Button>
          </Row>
          <br />
          <br />
          <Row>
            <h4>Individual grade</h4> <br />
            <span style={{ color: "red" }}>
              You need grade on groupmates to view your points
            </span>
            <br />
            <br />
            <Button type="primary" style={{ width: "100%" }}>
              GRADE ON GROUPMATES
            </Button>
          </Row>
          <br />
          <br />
          <Row>
            <h4>Chat summary</h4>
            <div>
              <svg
                className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1yd3jbs"
                width={"50px"}
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="SignalCellularAltIcon"
              >
                <path d="M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z" />
              </svg>{" "}
              <svg
                className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-l16pk8"
                width={"50px"}
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="BubbleChartOutlinedIcon"
              >
                <path d="M7 10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m8.01-1c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3m0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1M16.5 3C13.47 3 11 5.47 11 8.5s2.47 5.5 5.5 5.5S22 11.53 22 8.5 19.53 3 16.5 3m0 9c-1.93 0-3.5-1.57-3.5-3.5S14.57 5 16.5 5 20 6.57 20 8.5 18.43 12 16.5 12" />
              </svg>{" "}
              <svg
                className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-l16pk8"
                width={"50px"}
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="TrendingDownIcon"
              >
                <path d="m16 18 2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
              </svg>
            </div>
          </Row>
          <br />
          <br />
          <Row style={{ width: "150px" }}>
            <h4>Call video</h4>
            <br />
            <br />
            <Button type="primary" ghost>
              Join stream
            </Button>
          </Row>
          <br />
          <br />
          <Row>
            <h4>Pass criteria</h4>
            <div className="question-statistics">
              <div>View question</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>No. of comments posted</div>
                <div>1</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>No. of stars rated by others</div>
                <div>1</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>No. of votes</div>
                <div>1</div>
              </div>
            </div>
          </Row>
          <br />
          <br />

          <Row>
            <h4>Table of contents</h4>
            <br />
            <br />
            <span>Question</span>
            <br />
            <br />
            <p
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <List
                dataSource={slot.question}
                renderItem={(q) => (
                  <List.Item>
                    <Link
                      to={`/courses/${courseId}/slot/${slotId}/question/${q.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Row>
                        <Col md={9}>
                          <p style={{color:"black"}}><CommentOutlined /> {" "}{q.context}</p>
                        </Col>

                        <Col md={2}>
                          <Badge
                            style={{
                              color:
                                question.state === "Done" ? "black" : "white",
                            }}
                            className={
                              question.state === "Done"
                                ? "bg-warning"
                                : "bg-primary"
                            }
                          >
                            {question.state}
                          </Badge>
                        </Col>
                      </Row>
                    </Link>
                  </List.Item>
                )}
              />
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionDetailPage;
