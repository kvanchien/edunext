import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import {
  Button,
  Menu,
  Modal,
  Card,
  List,
  Form,
  Breadcrumb,
  Pagination,
  Collapse,
  Select,
} from "antd";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";

const { Option } = Select;

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

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const pageSize = 5;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFQA, setShowFQA] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === "2") {
      setShowInfo(true);
    } else if (e.key === "1") {
      backHome();
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

  const backHome = () => {
    navigate("/management");
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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
  }, [id]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(course.slots.length / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filterQuestions = (questions) => {
    if (filter === "All") {
      return questions;
    } else {
      return questions.filter((question) => question.state === filter);
    }
  };

  const handleQuestionClick = (slotId, questionId) => {
    navigate(`slot/${slotId}/question/${questionId}`);
  };

  if (!course) {
    return <h2>Course not found</h2>;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSlots = course.slots.slice(startIndex, endIndex);

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <div style={{ display: "flex" }}>
            <div style={{ width: 256 }}>
              <img
                src="/images/FPT_Education_logo.svg.png"
                alt="logo"
                width={"80px"}
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
                  OK
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
                title: course.name,
              },
            ]}
          ></Breadcrumb>
          <br />
          <Row>
            <h6 style={{ color: "#0078d4" }}>Filter by activities</h6>
            <Select
              defaultValue="All"
              style={{ width: 200, marginBottom: 10 }}
              onChange={(value) => setFilter(value)}
            >
              <Option value="All">All Activities</Option>
              <Option value="On going">On going</Option>
              <Option value="Done">Done</Option>
            </Select>
          </Row>

          <Card
            title={course.name}
            bordered={false}
            style={{ width: "100%", marginTop: 16 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={currentSlots}
              renderItem={(slot) => (
                <List.Item>
                  <Button type="primary">Slot {slot.id}</Button>{" "}
                  <Link
                    to={`slot/${slot.id}`}
                    style={{ marginLeft: "1100px" }}
                  >
                    <Button type="link">View slot</Button>
                  </Link>
                  <br />
                  <List.Item.Meta title={slot.title} description={slot.desc} />
                  <Collapse accordion>
                    {slot.question && slot.question.length > 0 ? (
                      filterQuestions(slot.question).map((question, index) => (
                        <Collapse.Panel header={`CQ${index + 1}`} key={index}>
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
                            {question.context}
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
                        </Collapse.Panel>
                      ))
                    ) : (
                      <p>No questions available for this slot.</p>
                    )}
                  </Collapse>
                </List.Item>
              )}
            />
          </Card>
          <div
            style={{
              position: "absolute",
              width: "100%",
              textAlign: "center",
              background: "#fff",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={course.slots.length}
              onChange={onPageChange}
              showSizeChanger={false}
              showQuickJumper={false}
              prevIcon={<Button onClick={handlePrev}>Prev</Button>}
              nextIcon={<Button onClick={handleNext}>Next</Button>}
            />{" "}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetails;
