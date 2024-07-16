import React, { useState, useEffect } from "react";
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
  DesktopOutlined,
  IdcardOutlined,
  RightCircleTwoTone,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Menu, Modal, Form, Tabs, Select, Card } from "antd";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

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

const TeacherDasboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFQA, setShowFQA] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loggedInStudent, setLoggedInStudent] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get("http://localhost:9999/courses");
      setCourses(res.data);
    };

    const fetchTeachers = async () => {
      const res = await axios.get("http://localhost:9999/teachers");
      setTeachers(res.data);
    };

    const fetchStudents = async () => {
      const res = await axios.get("http://localhost:9999/students");
      setStudents(res.data);

      if (user && user.id) {
        console.log("User ID:", user.id);
        const loggedInStudentData = res.data.find(
          (student) => student.userId === user.id
        );
        console.log("Logged in student data:", loggedInStudentData); 
        setLoggedInStudent(loggedInStudentData);
      }
    };

    fetchCourses();
    fetchTeachers();
    fetchStudents();
  }, [user]);

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((teacher) => teacher.teacherId === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === "2") {
      setShowInfo(true);
    } else if (e.key === "1") {
      navigate("/management")
    } else if (e.key === "8") {
      handleLogout();
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

  const handleCloseUpdate = () => {
    setShowUpdate(false);
  };

  const TabPane = Tabs.TabPane;

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  function callback(key) {
    console.log(key);
  }

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <div style={{ display: "flex" }}>
            <div style={{ width: 256 }}>
            <img
                  src="images/FPT_Education_logo.svg.png"
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

            <Modal
              visible={showInfo}
              width={800}
              title="Student Information"
              onCancel={() => setShowInfo(false)}
              footer={[
                <Button key="cancel" onClick={() => setShowInfo(false)}>
                  Close
                </Button>,
              ]}
            >
              {loggedInStudent ? (
                <div>
                  <p>
                    <strong>Name:</strong> {loggedInStudent.name}
                  </p>
                  <p>
                    <strong>Class:</strong> {loggedInStudent.class}
                  </p>
                  <p>
                    <strong>Campus:</strong> {loggedInStudent.campus}
                  </p>
                  <p>
                    <strong>Course:</strong> {loggedInStudent.course}
                  </p>
                </div>
              ) : (
                <p>No student information found.</p>
              )}
            </Modal>
          </div>
        </Col>

        <Col md={9}>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="COURSE" key="1">
              <Row>
                <h4>Semester</h4>
                <Select
                  defaultValue="Trial"
                  style={{
                    width: 155,
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Trial",
                      label: "Trial",
                    },
                    {
                      value: "SUMMER2024",
                      label: "SUMMER2024",
                    },
                    {
                      value: "SPRING2024",
                      label: "SPRING2024",
                    },
                    {
                      value: "FAL2023",
                      label: "FAL2023",
                    },
                  ]}
                />
              </Row>
              <Row>
                <a href="#" onClick={setShowUpdate}>
                  Recently Updated (Để xem chi tiết về các thay đổi cập nhật gần
                  đây, vui lòng nhấp vào đây)
                </a>
                <Modal
                  visible={showUpdate}
                  title="Recent Updated"
                  onCancel={handleCloseContact}
                  footer={[
                    <Button key="cancel" onClick={handleCloseUpdate}>
                      Close
                    </Button>,
                    <Button
                      key="save"
                      type="primary"
                      onClick={handleCloseUpdate}
                    >
                      Save
                    </Button>,
                  ]}
                >
                  <p>Nothing</p>
                </Modal>
              </Row>

              <br/>
              <br/>
              <Row>
                <h2>Welcome teacher to FPT EduNext!</h2>
              </Row>
              <br/>
              <br/>
              <Row>
                {courses.map((course) => (
                  <Col sm={12} md={6} lg={4} key={course.cid}>
                    <Card
                      title={course.name}
                      bordered={false}
                      style={{ marginBottom: 16 }}
                    >
                      <p>
                        <DesktopOutlined /> Class: {course.class}
                      </p>
                      <p>
                        <IdcardOutlined /> Teacher:{" "}
                        {getTeacherName(course.teacher)}
                      </p>
                      <p>
                        <TeamOutlined /> Number of Students:{" "}
                        {course.numberStudent}
                      </p>
                      <Button type="link">
                        <Link to={`/courses/${course.id}`}>
                          Go to Course <RightCircleTwoTone />
                        </Link>
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>
            <TabPane tab="PROJECT" key="2">
              <Row>
                <h4>Semester</h4>
                <Select
                  defaultValue="Trial"
                  style={{
                    width: 155,
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Trial",
                      label: "Trial",
                    },
                    {
                      value: "SUMMER2024",
                      label: "SUMMER2024",
                    },
                    {
                      value: "SPRING2024",
                      label: "SPRING2024",
                    },
                    {
                      value: "FAL2023",
                      label: "FAL2023",
                    },
                  ]}
                />
              </Row>
              <Row className="text-center">
                <img
                  src="/images/box-no-data.png"
                  alt="box-no-data"
                  style={{ width: "20%", marginLeft: "39%" }}
                ></img>
                <div>
                  <h3
                    className="fs-18 accent-color mg-b-10"
                    style={{ color: "#0078d4" }}
                  >
                    No data available.
                  </h3>
                  <h4 className="mg-0 fs-12 mt-2">
                    Please contact your school administration for more
                    information.
                  </h4>
                </div>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDasboard;
