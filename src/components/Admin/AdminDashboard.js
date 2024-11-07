import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Menu,
  notification,
} from "antd";
import useAuth from "../../hooks/useAuth";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const items = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "Home",
  },
  {
    key: "2",
    icon: <LogoutOutlined />,
    label: "Log out",
  },
];

const { Option } = Select;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const { role, campus, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch users.",
      });
    }
  };

  const showModal = (user) => {
    setCurrentUser(user);
    setIsEdit(!!user);
    setIsModalVisible(true);
    form.setFieldsValue(
      user ? { ...user, role: user.role } : { role: "student" }
    );
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (isEdit) {
            await axios.put(
              `http://localhost:9999/users/${currentUser.id}`,
              values
            );
            notification.success({
              message: "Success",
              description: "User edited successfully.",
            });
          } else {
            await axios.post("http://localhost:9999/users", values);
            notification.success({
              message: "Success",
              description: "User added successfully.",
            });
          }
          fetchUsers();
          setIsModalVisible(false);
          form.resetFields();
        } catch (error) {
          console.error("Failed to save user:", error);
          notification.error({
            message: "Error",
            description: "Failed to save user.",
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9999/users/${id}`);
      fetchUsers();
      notification.success({
        message: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete user.",
      });
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === "2") {
      handleLogout();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Campus",
      dataIndex: "campus",
      key: "campus",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Container fluid>
        <Row>
          <Col md={2}>
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
            </div>
          </Col>

          <Col md={10}>
            <Button
              type="primary"
              onClick={() => showModal(null)}
              style={{ marginBottom: "20px", backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Add User
            </Button>

            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
            />

            <Modal
              title={isEdit ? "Edit User" : "Add User"}
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              okButtonProps={{ style: { backgroundColor: "#1890ff", borderColor: "#1890ff" } }}
              cancelButtonProps={{ style: { backgroundColor: "#f0f2f5", color: "#000" } }}
            >
              <Form form={form} layout="vertical" name="userForm">
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: "Please input the username!" }]}
                >
                  <Input style={{ borderRadius: "4px" }} />
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: "Please input the name!" }]}
                >
                  <Input style={{ borderRadius: "4px" }} />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please input the password!" }]}
                >
                  <Input.Password style={{ borderRadius: "4px" }} />
                </Form.Item>
                <Form.Item
                  name="campus"
                  label="Campus"
                  rules={[{ required: true, message: "Please input the campus!" }]}
                >
                  <Select style={{ borderRadius: "4px" }}>
                    <Option value="DN">Đà Nẵng</Option>
                    <Option value="CT">Cần Thơ</Option>
                    <Option value="QN">Quy Nhơn</Option>
                    <Option value="HCM">Hồ Chí Minh</Option>
                    <Option value="HOLA">Hà Nội - Hòa Lạc</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: "Please select the role!" }]}
                >
                  <Select style={{ borderRadius: "4px" }}>
                    <Option value="admin">Admin</Option>
                    <Option value="teacher">Teacher</Option>
                    <Option value="student">Student</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
