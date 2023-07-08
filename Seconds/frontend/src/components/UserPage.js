import { Container,Tab,Col,Row,Button,Table} from "react-bootstrap"
import { useSelector,useDispatch } from "react-redux"
import { useEffect,useState } from "react"
import axios from 'axios';
export default function UserPage()
{

    const dispatch=useDispatch();
    const user=useSelector(state=>state.user);
    const [reservations,setReservations]=useState([]);
    const getReservations=()=>{
    }

    useEffect(()=>{
        getReservations();
    },[])
    return <Container>
        <Button style={{position:'absolute',top:10,right:10}} onClick={()=>{
            dispatch({type:'LOGOUT',data:null});
        }}>Logout</Button>
        <Row>
        <h2>Your reservation</h2>
        
        </Row>
        <Row>
        <Table striped bordered hover>
        <thead>
        <tr>
            <th>#</th>
            <th>Location</th>
            <th>From</th>
            <th>To</th>
            <th>Price</th>
            <th>Delete</th>
        </tr>
        </thead>
        <tbody>
       
        </tbody>
        </Table>
        </Row>
    </Container>
}