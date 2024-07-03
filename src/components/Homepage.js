import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
export default function Homepage() {
  return (
    <div>
      <Container>
        <Row className="text-center">
            <Col>
                <h1>Social Constructive Learning</h1>
                <h4>Construct knowledge and personalize the learning way to empower learners' full potential.</h4>
                <Link to= "/login">
                <Button variant="primary" >
                  Join now</Button>
                </Link>
                
            </Col>
            <Row>
                <img alt="" src="/images/home-page.png" style={{marginLeft:"40%", width: "24%", marginTop: "30px"}}></img>
            </Row>
        </Row>
      </Container>
    </div>
  );
}
