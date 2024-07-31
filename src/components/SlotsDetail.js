import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Menu,
  Button,
  Modal,
  Breadcrumb,
  Tabs,
  Form,
  List,
} from "antd";
import {
  FilePdfFilled,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadFilled,
  FileSearchOutlined,
  QuestionCircleFilled,
  CustomerServiceFilled,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Container, Row, Col, Badge } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const items = [
  { key: "1", icon: <HomeOutlined />, label: "Home" },
  { key: "2", icon: <UserOutlined />, label: "Information" },
  { key: "3", icon: <ReadFilled />, label: "Assignment" },
  { key: "4", icon: <FileSearchOutlined />, label: "Upcoming slots" },
  { key: "5", icon: <FilePdfFilled />, label: "Read user guide" },
  { key: "6", icon: <CustomerServiceFilled />, label: "Contact support" },
  { key: "7", icon: <QuestionCircleFilled />, label: "Frequently Asked Question" },
  { key: "8", icon: <LogoutOutlined />, label: "Logout" },
];

const SlotsDetail = () => {
  const { courseId, slotId } = useParams();
  const [course, setCourse] = useState(null);
  const [slot, setSlot] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFQA, setShowFQA] = useState(false);
  const { role, campus, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:9999/courses/${courseId}`);
        const courseData = await response.json();
        setCourse(courseData);

        const selectedSlot = courseData.slots.find(slot => slot.id === parseInt(slotId));
        setSlot(selectedSlot);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:9999/students");
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };

    fetchCourseData();
    fetchStudents();
  }, [courseId, slotId]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleQuestionClick = (slotId, questionId) => {
    navigate(`/courses/${courseId}/slot/${slotId}/question/${questionId}`);
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        navigate("/management");
        break;
      case "2":
        setShowInfo(true);
        setShowContact(false);
        setShowFQA(false);
        break;
      case "3":
        navigate("/assignment");
        break;
      case "5":
        handleDownloadPDF();
        break;
      case "6":
        setShowContact(true);
        break;
      case "7":
        setShowFQA(true);
        break;
      case "8":
        handleLogout();
        break;
      default:
        setShowInfo(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDownloadPDF = () => {
    window.open("https://drive.google.com/uc?export=view&id=1Z2AL5snwR--kUPE6YFddw9pv9UxZ93K2", "_blank");
  };

  const handleCloseContact = () => {
    setShowContact(false);
  };

  const handleCloseFQA = () => {
    setShowFQA(false);
  };

  if (!course || !slot) {
    return <div>Loading...</div>;
  }

  const studentsInCourse = students.filter(student => student.courses.includes(parseInt(courseId)));

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
              <h3 className="text-danger">
                Please refer to 'FQA' before requesting support
              </h3>
              <br />
              <h4 className="text-danger">
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
                    Why students can not find a classroom -{" "}
                    <span className="text-danger">(Not exist account)</span>
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

        <Col md={9}>
          <div>
            <Breadcrumb
              items={[
                { title: <a href="/management" style={{ color: "blue" }}>Home</a> },
                { title: <Link style={{ color: "blue" }} to={`/courses/${course.id}`}>{course.name}</Link> },
                { title: "Slot " + slot.id },
              ]}
            />
            <br />

            <h4>SHOW INFO SESSIONS</h4>
            <br />
            <Card>
              <Tabs defaultActiveKey="1">
                              <Tabs.TabPane tab="CONTENT" key="1">
                  <List
                    itemLayout="horizontal"
                    dataSource={slot.question}
                    renderItem={question => (
                      <List.Item>
                        <List.Item.Meta
                          title={`${question.context}`}
                        />
                           <p
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleQuestionClick(slot.id, question.id)
                            }
                          >
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
                          </p>
                      </List.Item>
                    )}
                  />
                </Tabs.TabPane>

                <Tabs.TabPane tab="STUDENT" key="2">
                  <List
                    itemLayout="horizontal"
                    dataSource={studentsInCourse}
                    renderItem={student => (
                      <List.Item>
                        <List.Item.Meta
                          title={`${student.name}`}
                        />
                      </List.Item>
                    )}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SlotsDetail;
