//component that is a modal that shows the location on a map and has a button to book the location and info about location, name, description, price, ratings, reservations
import { useEffect, useState } from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Row, Col, Table, Modal,Carousel } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { useContext } from "react";

import axios from 'axios';
export function ModalLocation({ location, setShow, show ,setUser}) {
    const { currentAccount, connectWallet, handleChange, sendTransaction, formData,isLoading } = useContext(TransactionContext);
    const [guestNumber, setGuestNumber] = useState('');
    const [startDate, setStartDate] = useState('');
    const user=useSelector(state=>state.user);
    const [endDate, setEndDate] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [index, setIndex] = useState(0);
    const [error, setError] = useState('');
    const [price,setPrice]=useState(location.price);

    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };

    const handleBook = async () => {
        setError('');
        if( !guestNumber || !startDate || !endDate)
        {
            setIndex(2);
            setError('Please fill all the fields');
            return;
        }
        // calculate price
        let price1=price;
        let start=new Date(startDate);
        let end=new Date(endDate);
        let days=(end-start)/(1000*60*60*24);
        price1=price*days;
        console.log(price);
        let formData={
            amount:price1.toString(),
            addressTo:shopAddress,
            keyword:'book',
            message:'book '+location.name+' from '+startDate+' to '+endDate+' for '+guestNumber+' guests',
        }
        try{
        await sendTransaction(formData);
        setShow(false);
        }catch(err)
        {
            makeReservation();
            setError('Transaction failed');
        }

    }
    const makeReservation = () => {
    
        let locationName=location.location;
        let place=location.name;
        let from=startDate;
        let to=endDate;
        let numberOfGuests=guestNumber;
        let price=location.price;
        let start=new Date(startDate);
        let end=new Date(endDate);
        let days=(end-start)/(1000*60*60*24);
        price=price*days;

        let email=user.data.email;

        axios.post(backendUrl+'/locations/addReservation',
        {locationName,place,from,to,numberOfGuests,price,email}).then(res=>{
            handleClose();
        }   
        ).catch(err=>{
            setError('Error making reservation');
        })
    }
  
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header style={{ padding: 0,height:"15rem",width:"100%",flexWrap:'wrap',overflow:'hidden'}}>
            <Carousel variant="dark" style={{width:'100%'}}>
                {location.images.map((image,index)=>{
                    return <Carousel.Item key={index}> 
                    <img
                    className="d-block w-100"
                    src={image}
                    alt="First slide"
                    style={{height:'15rem',width:'100%',objectFit:'cover'}}
                    />
                    </Carousel.Item>
                })
                }
                <Carousel.Item key={index}> 
                    <img
                    className="d-block w-100"
                    src={location.locationImage}
                    alt="First slide"
                    style={{height:'15rem',width:'100%',objectFit:'cover'}}
                    />
                    </Carousel.Item>
            </Carousel>
        </Modal.Header>
        <Modal.Title style={{ textAlign: "center", fontWeight: "bolder" ,display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
            <Row style={{ fontSize: 30 }}>
                {location.name}
            </Row>
            <Row style={{ fontSize: 20 }}>
                {location.location}
            </Row>
            <Row style={{ fontSize: 20 }}>
                {price} tokens/night
            </Row>
            <Row style={{ fontSize: 20,color:'red' }}>
                {error? <>Error: {error}</>:<></>}
            </Row>
        </Modal.Title>
        <hr></hr>
        <Modal.Body style={{ textAlign: "center", width: "100%", fontSize:15 }}>
        <Carousel slide={false} activeIndex={index} onSelect={handleSelect} style={{height:300,paddingLeft:55,paddingRight:55}} variant="dark" >
            <Carousel.Item style={{marginTop:70}} interval={100000}> 
                <p 
                    style={{maxHeight:150,overflow:'auto'}}
                >{location.description}</p>
            </Carousel.Item>
            <Carousel.Item interval={100000}>
            <Table striped bordered hover variant="dark" style={{marginTop:70}}>
                <thead>
                    <tr>
                    {location.benefits.map((benefit,index)=>{
                        return <th key={index}>{benefit}</th>
                    })
                    }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    {
                        location.benefits.map((benefit,index)=>{
                            return <td key={index}>Yes</td>
                        })
                    }
                    </tr>
                </tbody>
                </Table>
            </Carousel.Item>
            <Carousel.Item interval={100000}>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Check-in</Form.Label>
                        <Form.Control type="date" placeholder="Check-in"  value={startDate}
                        onChange={(e)=>{ 
                            setError('');
                            // start date must be after today
                            if(new Date(e.target.value)<new Date())
                            {
                                setError('Start date must be after today');
                                return;
                            }
                            setStartDate(e.target.value);
                        }}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Check-out</Form.Label>
                        <Form.Control type="date" placeholder="Check-out" value={endDate}
                        onChange={(e)=>{
                            setError('');   
                            // end date must be after start date
                            if(new Date(e.target.value)<new Date(startDate))
                            {
                                setError('End date must be after start date');
                                return;
                            }
                            setEndDate(e.target.value);
                        }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        {/* Dropdown with rooms that are available */}
                        <Form.Label>Select a room</Form.Label>
                        <Form.Control as="select"
                        onChange={(e)=>{
                            setError('');
                            setGuestNumber(e.target.value)
                            if(e.target.value==='Select a room')
                            {
                                setPrice(location.price);
                                return;
                            }
                            setPrice((oldPrice)=>{
                                return location.price+location.rooms[e.target.value].price;
                            });
                        }}>
                            <option>Select a room</option>
                            {
                                location.rooms.map((room,index)=>{
                                    if(room.available)
                                    return <option key={index} value={index}>Room with {room.numberOfBeds} beds and price {room.price}</option>
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Carousel.Item>
        </Carousel>

        </Modal.Body>
        <Modal.Footer>

            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            { !currentAccount? <Button style={{margin:10}} onClick={()=>{
                connectWallet();
            }}>
                Connect your wallet first
            </Button>
            : user.data ? 
            <Button variant="primary" onClick={() => {
                handleBook();
            }}>
                Book
            </Button>: <Button style={{margin:10}} onClick={()=>{
                setUser(true);
            }   }>
                Login first
            </Button>   
            }
        </Modal.Footer>
    </Modal>
}