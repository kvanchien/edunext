import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import AdminDashboard from './Admin/AdminDashboard';
import StudentDashboard from './Student/StudentDashboard';
import TeacherDashboard from './Teacher/TeacherDashboard';

const Management = () => {
    const { role } = useAuth();
    
    const renderContent = () => {
      switch(role) {
        case 'admin':
          return <AdminDashboard />;
        case 'teacher':
          return <TeacherDashboard/>;
        case 'student':
          return <StudentDashboard />;
        default:
          return <p>Vui lòng chọn quyền</p>;
      }
    };
  
    return (
      <Container fluid>
        <Row>
          <Col>
            {renderContent()}
          </Col>
        </Row>
      </Container>
    );
  };

  export default Management;