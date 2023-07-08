import {Modal,Button,Form,} from 'react-bootstrap';
import {useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import LoginPage from './LoginPage';
import UserPage from './UserPage';
export function  ModalUser({show,setShow})
{
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const user=useSelector(state=>state.user);
    const dispatch=useDispatch();

    return <Modal show={show} onHide={handleClose}>
        <Modal.Body>
            {!user?<LoginPage setShow={setShow}></LoginPage>:<UserPage></UserPage>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>
}