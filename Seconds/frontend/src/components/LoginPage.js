import { Container,Tab,Col,Row,Form,Nav,Button} from "react-bootstrap"
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import {login,register} from '../serverConnection.js';
export default function LoginPage({setShow})
{
    const [error,setError]=useState('');

    const dispacth=useDispatch();
    const user=useSelector(state=>state.user);
    let loginUser=async (email,password)=>{
        const response=await login(email,password);
        if(response.status===200)
        {
            dispacth({type:'login',payload:response.data});
            setShow(false);
        }
        else
        {
            setError(response.data);
        }
    }
    let registerUser=(email,password)=>{

    }
    return <Container style={{fontSize:'3vh'}}>
        <h3>Hello</h3>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row className="justify-content-center">
                <Row style={{margin:20}}>
                    <Nav variant="pills" className="flex-row">
                        <Col>
                            <Nav.Item>
                                <Nav.Link eventKey="first">Login</Nav.Link>
                            </Nav.Item>
                        </Col>
                        <Col>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Register</Nav.Link>
                            </Nav.Item>
                        </Col>
                    </Nav>
                </Row>
                <Row className="justify-content-center">
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <Form  onSubmit={(e)=>{
                                e.preventDefault();
                                let email=e.target[0].value;
                                let password=e.target[1].value;
                                login(email,password);
                            }}>
                                <Row>
                                    <h3 
                                        style={{color:'red'}}
                                    >{error}</h3>
                                </Row>
                                <Row>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>
                                </Row>
                                <br></br>
                                <Row>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                </Row>
                                <br></br>
                                <Button variant="primary" type="submit">
                                    Login
                                </Button>
                            </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <Form onSubmit={(e)=>{
                                e.preventDefault();
                                let email=e.target[0].value;
                                let password=e.target[1].value;
                                register(email,password);
                            }}>
                                <Row>
                                    <h3 
                                        style={{color:'red'}}
                                    >{error}</h3>
                                </Row>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>
                                <br></br>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                    <br></br>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label> Repeat Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                </Form.Group>
                                <br></br>
                                <Button variant="primary" type="submit">
                                    Register
                                </Button>
                            </Form>
                        </Tab.Pane>
                    </Tab.Content>
                </Row>
            </Row>
        </Tab.Container>
    </Container>
}