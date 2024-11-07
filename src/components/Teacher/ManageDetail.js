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
  Input,
  notification 
} from "antd";
import useAuth from "../../hooks/useAuth";
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
    label: "Frequently Asked Questions",
  },
  {
    key: "8",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];

const ManageDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({ slots: [], name: '', }); // Initialize with an empty slots array
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [slots, setSlots] = useState(course.slots);
  const [collapsed, setCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFQA, setShowFQA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotTitle, setNewSlotTitle] = useState("");
 
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
        setSlots(res.data.slots);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCourse();
  }, [id]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const addSlot = async () => {
    try {
      // Create new slot object
      const newSlot = { 
        id: course.slots.length > 0 ? Math.max(...course.slots.map(s => s.id)) + 1 : 1,
        title: newSlotTitle, 
        desc: "", 
        question: [] 
      };
  
      // Create updated course object with new slot
      const updatedCourse = {
        ...course,
        slots: [...course.slots, newSlot]
      };
  
      // Update the entire course
      const res = await axios.put(`http://localhost:9999/courses/${id}`, updatedCourse);
      setCourse(res.data);
      setIsAddingSlot(false);
      setNewSlotTitle("");

      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Slot added successfully!',
        placement: 'topRight', 
      });
    } catch (error) {
      console.error("Error adding slot:", error);
    }
  };

  const removeSlot = async (slotId) => {
    try {
      // Create updated course object without the slot to be deleted
      const updatedCourse = {
        ...course,
        slots: course.slots.filter(slot => slot.id !== slotId)
      };
  
      // Update the entire course
      const res = await axios.put(`http://localhost:9999/courses/${id}`, updatedCourse);
      setCourse(res.data);
  
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Slot deleted successfully!',
        placement: 'topRight', // You can change the position
      });
    } catch (error) {
      console.error("Error removing slot:", error);
      // Optionally show an error notification
      notification.error({
        message: 'Error',
        description: 'Failed to delete the slot.',
        placement: 'topRight',
      });
    }
  }

  const addQuestion = async (slotId) => {
    try {
      const newQuestion = { 
        id: Math.max(...course.slots.flatMap(slot => slot.question.map(q => q.id)), 0) + 1,
        context: "New Question", 
        state: "Pending",
        comments: [] // Initialize comments if needed
      };
  
      // Update the course object with the new question
      const updatedCourse = {
        ...course,
        slots: course.slots.map(slot => {
          if (slot.id === slotId) {
            return {
              ...slot,
              question: [...(slot.question || []), newQuestion] // Add the new question to the slot's questions
            };
          }
          return slot;
        })
      };
  
      // Update the entire course
      const res = await axios.put(`http://localhost:9999/courses/${course.id}`, updatedCourse);
      setCourse(res.data);
  
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Question added successfully!',
        placement: 'topRight',
      });
    } catch (error) {
      console.error("Error adding question:", error);
      notification.error({
        message: 'Error',
        description: 'Failed to add question.',
        placement: 'topRight',
      });
    }
  };

  const editQuestion = async (slotId, questionId, updatedContent) => {
    try {
      const updatedCourse = {
        ...course,
        slots: course.slots.map(slot => {
          if (slot.id === slotId) {
            return {
              ...slot,
              question: slot.question.map(q => 
                q.id === questionId ? { ...q, ...updatedContent } : q
              )
            };
          }
          return slot;
        })
      };
  
      const res = await axios.put(`http://localhost:9999/courses/${id}`, updatedCourse);
      setCourse(res.data);
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  const removeQuestion = async (slotId, questionId) => {
    try {
      const updatedCourse = {
        ...course,
        slots: course.slots.map(slot => {
          if (slot.id === slotId) {
            return {
              ...slot,
              question: slot.question.filter(q => q.id !== questionId)
            };
          }
          return slot;
        })
      };
  
      const res = await axios.put(`http://localhost:9999/courses/${id}`, updatedCourse);
      setCourse(res.data);
    } catch (error) {
      console.error("Error removing question:", error);
    }
  };
  const startEditingTitle = (slot) => {
    setEditingSlotId(slot.id);
    setEditedTitle(slot.title);
  };

  const saveTitle = async (slotId) => {
    try {
      // Create updated course object with the edited slot title
      const updatedCourse = {
        ...course,
        slots: course.slots.map(slot =>
          slot.id === slotId ? { ...slot, title: editedTitle } : slot
        )
      };
  
      // Update the entire course
      const res = await axios.put(`http://localhost:9999/courses/${id}`, updatedCourse);
      setCourse(res.data);
      setEditingSlotId(null);
      setEditedTitle("");
  
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Slot title updated successfully!',
        placement: 'topRight',
      });
    } catch (error) {
      console.error("Error saving slot title:", error);
      notification.error({
        message: 'Error',
        description: 'Failed to update slot title.',
        placement: 'topRight',
      });
    }
  };

  const cancelEditing = () => {
    setEditingSlotId(null);
    setEditedTitle("");
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

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSlots = course.slots.slice(startIndex, endIndex);

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
        <div style={{ display: "flex" }}>
            <div style={{ width: 256 }}>
            
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
              width={600}
              onCancel={() => setShowInfo(false)}
              footer={[
                <Button key="close" onClick={() => setShowInfo(false)}>
                  Close
                </Button>,
              ]}
            >
            </Modal>
            
            
          </div>
        </Col>
        <Col md={9}>
        <Card title={course.name} bordered={false}>
            <Button type="primary" onClick={addSlot} style={{ marginBottom: "16px" }}>Add Slot</Button>
            <List
              itemLayout="horizontal"
              dataSource={currentSlots}
              renderItem={(slot) => (
                <List.Item>
                  <div style={{ width: "100%" }}>
                    <Button type="primary" onClick={() => addQuestion(slot.id)}>Add Question to Slot {slot.id}</Button>
                    <Button type="primary" danger onClick={() => removeSlot(slot.id)} style={{ marginLeft: 8 }}>Remove Slot</Button>
                    <List.Item.Meta title={slot.title} description={slot.desc} />
                    <div style={{ marginBottom: '16px' }}>
                      {editingSlotId === slot.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            style={{ width: '200px' }}
                          />
                          <Button 
                            type="primary" 
                            onClick={() => saveTitle(slot.id)}
                            size="small"
                          >
                            Save
                          </Button>
                          <Button 
                            onClick={cancelEditing}
                            size="small"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div >
                          <Button 
                            type="link" 
                            onClick={() => startEditingTitle(slot)}
                            size="small"
                          >
                            Edit Title
                          </Button>
                        </div>
                      )}
                    </div>

                    <Collapse accordion>
                      {slot.question && slot.question.length > 0 ? (
                        slot.question.map((question, index) => (
                          <Collapse.Panel header={`CQ${index + 1}`} key={question.id}>
                            <Form layout="inline">
                              <Form.Item>
                                <Input
                                  value={question.context}
                                  onChange={(e) => editQuestion(slot.id, question.id, { context: e.target.value })}
                                  placeholder="Edit question"
                                />
                              </Form.Item>
                              <Form.Item>
                                <Select
                                  value={question.state}
                                  onChange={(value) => editQuestion(slot.id, question.id, { state: value })}
                                >
                                  <Option value="NotStart">NotStart</Option>
                                  <Option value="Ongoing">Ongoing</Option>
                                  <Option value="Done">Done</Option>
                                </Select>
                              </Form.Item>
                              <Form.Item>
                                <Button
                                  type="danger"
                                  onClick={() => removeQuestion(slot.id, question.id)}
                                >
                                  Remove
                                </Button>
                              </Form.Item>
                            </Form>
                          </Collapse.Panel>
                        ))
                      ) : (
                        <p>No questions available for this slot.</p>
                      )}
                    </Collapse>
                  </div>
                </List.Item>
              )}
            />
          </Card>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={course.slots.length}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ManageDetail;