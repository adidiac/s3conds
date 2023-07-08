import {Button, Navbar} from "react-bootstrap";
import logo from "../assets/logo.png";
import { ModalUser } from "./ModalUser";
import { useState } from "react";
export function FloatingNavbar()
{
    const [show, setShow] = useState(false);

    return (
        <>
        <Navbar bg="dark" variant="dark" fixed="top">
            <Navbar.Brand>
                <img
                    alt=""
                    src={logo}
                    width="200"
                    height="70"
                    className="d-inline-block align-top"
                    style={{marginLeft: "100"}}
                />
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Button variant="outline-info"
                        onClick={() => setShow(true)}
                        style={{marginRight: "20px",fontSize: "20px"}}
                >Login</Button>
            </Navbar.Collapse>
        </Navbar>
        <ModalUser show={show} setShow={setShow}/>
        </>
    );
}