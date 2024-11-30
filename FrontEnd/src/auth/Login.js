import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';


const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tukeLogin, setTukeLogin] = useState(false);

  const handleLoginClick = async () => {
    setTukeLogin(false);
    setIsLoading(true); 
    await onLogin(tukeLogin); 
    setIsLoading(false); 
  };

  const handleLoginClickTUKE = async () => {
    setTukeLogin(true);
    setIsLoading(true); 
    await onLogin(tukeLogin); 
    setIsLoading(false); 
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="d-flex justify-content-center align-items-center">
      <Container fluid className="d-flex justify-content-center align-items-center h-100" style={{ backgroundColor: '#f8f9fa' }}>
        <Row className="w-100 d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="bg-white my-5 mx-auto" style={{ borderRadius: '1rem' }}>
              <Card.Body className="p-5 w-100 d-flex flex-column text-center">
                <h2 className="fw-bold mb-3">Welcome to ProjView</h2>
                <p className="text-muted mb-2">Please log in to access the projects</p>
                
                <hr className="my-4" />

                <Button
                  variant="primary rounded-pill"
                  size="md"
                  className="mt-3 mb-3 d-flex align-items-center justify-content-center mx-auto"
                  onClick={handleLoginClick}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  {isLoading ? "Signing In..." : "Sign In with Microsoft with NXT"}
                </Button>

                <Button
                  variant="primary rounded-pill"
                  size="md"
                  className="mt-3 mb-3 d-flex align-items-center justify-content-center mx-auto"
                  onClick={handleLoginClickTUKE}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  {isLoading ? "Signing In..." : "Sign In with Microsoft with TUKE"}
                </Button>

                {isLoading && (
                  <Spinner
                    animation="border"
                    role="status"
                    variant="primary"
                    className="mt-3 mx-auto"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;