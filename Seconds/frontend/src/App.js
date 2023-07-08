import { Button, Container,Row,Col } from 'react-bootstrap';
import './App.css';
import background1 from './assets/background1.png';
import background2 from './assets/background2.png';
import {FloatingNavbar} from "./components/FloatingNavbar";
function App() {
  const containerCenter = (leftOrRight)=>
  {
    if (leftOrRight === "left") 
    return {
      position: "absolute",
      left: "0",
      top: "0",
      width: "50%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
    }
    else if (leftOrRight === "right")
    return {
      position: "absolute",
      right: "0",
      top: "0",
      width: "50%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
    }
  }

  return (
    <div id="start-screen">
      <FloatingNavbar/>
      <div class="demo image above">
          <div id="user-screen" class="left">
          <img id="image_home"  src={background1}></img>
          <Container style={containerCenter("left")}>
            <Col style={{marginLeft:'5vh'}}>
              <Row>
                  <h1>Generate a new </h1>
              </Row>
              <Row>
                  <h1>Website</h1>
              </Row>
              <Row>
                  <h1>For your product!</h1>
              </Row>
              <Row>
              <Button variant="primary" size="lg" style={{maxWidth:'30vh'}}>Get Started</Button>
              </Row>
            </Col>
          </Container>
          </div>
          <div id="api" class="right">
          <img id="image_api" src={background2}></img>
          <Container style={containerCenter("right")}>
              <h1>Seconds</h1>
          </Container>
          </div>
      </div>
    </div>
  );
}

export default App;
