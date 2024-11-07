import React, { useState, useEffect } from "react";
import {
  Button, Menu, Modal, Form, Input, Card, Tabs, Select
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined ,
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
  HomeOutlined,} from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

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


const TeacherDashboard = () => {
  const { role, logout, userId  } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFQA, setShowFQA] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [form] = Form.useForm();
  const [teacherId, setTeacherId] = useState(null);
  

  useEffect(() => {
    // Fetch the teacher ID associated with the logged-in user
    const fetchTeacherId = async () => {
      try {
        const response = await axios.get("http://localhost:9999/teachers");
        const teacher = response.data.find(teacher => teacher.userId === userId);
        if (teacher) {
          setTeacherId(teacher.teacherId); // Set the correct teacherId
        }
      } catch (error) {
        console.error("Error fetching teacher ID:", error);
      }
    };

    if (userId && role === 'teacher') {
      fetchTeacherId();
    }
  }, [userId, role]);

  useEffect(() => {
    // Fetch courses only when the teacherId is available
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:9999/courses");
        const teacherCourses = response.data.filter(course => course.teacher === teacherId);
        setCourses(teacherCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (teacherId) {
      fetchCourses();
    }
  }, [teacherId]);


  // Add new course
  const addCourse = async (values) => {
    const courseData = { ...values, teacher: teacherId, slots: [] }; // Include teacher ID
    try {
      const response = await axios.post("http://localhost:9999/courses", courseData);
      setCourses([...courses, response.data]);
      setShowCourseModal(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };
  

  // Update existing course
  const updateCourse = async (values) => {
    const res = await axios.put(`http://localhost:9999/courses/${currentCourse.id}`, values);
    setCourses(courses.map((course) => course.id === currentCourse.id ? res.data : course));
    setShowEditCourseModal(false);
    setCurrentCourse(null);
    form.resetFields();
  };

  // Delete course
  const deleteCourse = async (courseId) => {
    await axios.delete(`http://localhost:9999/courses/${courseId}`);
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  // Show edit course modal and set current course
  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setShowEditCourseModal(true);
    form.setFieldsValue(course);
  };



  // Logout
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === "2") {
      setShowInfo(true);
      setShowContact(false);
      setShowFQA(false);
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

  const handleCloseUpdate = () => {
    setShowUpdate(false);
  };


  return (
    <Container fluid>
    <div style={{ padding: "20px" }}>
      {role !== 'teacher' ? (
        <p>Unauthorized Access</p>
      ) : (
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


          </div>
        </Col>

        <Col md={9}>
        
          <h2>Teacher Dashboard</h2>
        
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowCourseModal(true)}
                style={{ marginBottom: "16px" }}
              >
                Add New Course
              </Button>

              {courses.map((course) => (
                <Card
                  key={course.id}
                  title={course.name}
                  extra={
                    <div>
                      <Button icon={<EditOutlined />} onClick={() => handleEditCourse(course)}>Edit</Button>
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => deleteCourse(course.id)}
                        danger
                        style={{ marginLeft: "8px" }}
                      >
                        Delete
                      </Button>
                    </div>
                  }
                >
                  <p>Class: {course.class}</p>
                  <p>Number of Students: {course.numberStudent}</p>
                  <Button type="link">
                        <Link to={`/manage-detail/courses/${course.id}`}>
                          Go to detail <RightCircleTwoTone />
                        </Link>
                      </Button>
                </Card>
              ))}

              {/* Add Course Modal */}
              <Modal
                title="Add New Course"
                visible={showCourseModal}
                onCancel={() => setShowCourseModal(false)}
                footer={null}
              >
                <Form form={form} onFinish={addCourse} layout="vertical">
                  <Form.Item name="name" label="Course Name" rules={[{ required: true, message: 'Please enter the course name!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="class" label="Class" rules={[{ required: true, message: 'Please enter the class!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="numberStudent" label="Number of Students" rules={[{ required: true, message: 'Please enter the number of students!' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">Add Course</Button>
                </Form>
              </Modal>

              {/* Edit Course Modal */}
              <Modal
                title="Edit Course"
                visible={showEditCourseModal}
                onCancel={() => setShowEditCourseModal(false)}
                footer={null}
              >
                <Form form={form} onFinish={updateCourse} layout="vertical">
                  <Form.Item name="name" label="Course Name" rules={[{ required: true, message: 'Please enter the course name!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="class" label="Class" rules={[{ required: true, message: 'Please enter the class!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="numberStudent" label="Number of Students" rules={[{ required: true, message: 'Please enter the number of students!' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">Update Course</Button>
                </Form>
              </Modal>
          
          </Col>
        </Row>
      )}
    </div>
    </Container>
  );
};

export default TeacherDashboard;
