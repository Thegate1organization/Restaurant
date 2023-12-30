import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReactCardDesgin from './ReactCardDesgin.js';
import { Container, Button, Modal, Form} from 'react-bootstrap';

const ReactCardDate = () => { 

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm ,setShowForm] = useState( false );
  const [formData, setFormData] =useState({
    title:"",
    item:null,
    price:"",
    place:"",
  });

 //get 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://restaurant-project-drab.vercel.app/PopularItems/getallPopularItems');
        setApiData(response.data.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures the effect runs once when the component mounts
  //delete
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`https://restaurant-project-drab.vercel.app/popularItems/deletedPopularItems/${itemId}`);
     //delete from memory***********************************************************
     //setApiData(apiData.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  //POST
  const handelPostData =async ()=>{
    setShowForm(true);
  };
  const handleCloseForm =()=>{
    setShowForm(false);
  };
  const handleInputChange =(e)=>{
   const {name ,value}=e.target;
   setFormData({
    ...formData,
    [name]: value,
   });
  };
  const handleFileChange=(e)=>{
    const file=e.target.files[0];
    setFormData({
      ...formData,
      item:file,
    });
  };
  const handleSubmitForm=async(e)=>{
    e.preventDefault();
    try{
      const formDataUpload= new FormData();
      formDataUpload.append('title',formData.title);
      formDataUpload.append('item',formData.item);
      formDataUpload.append('price',formData.price);
      formDataUpload.append('place',formData.place);
      const response= await axios.post("https://restaurant-project-drab.vercel.app/popularItems/createPopularItems",
      formDataUpload)
      setApiData([...apiData,response.data.result]);
      setShowForm(false);
    }catch(error){
      console.error('Error posting data:', error);
    }
  };
  //loading for response
  if (loading){
    return(<h2>loading.........</h2>)
  }
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items:5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
 /*const data=[
    {image :require('../images/Frame40.png'),
     title:`Cheese Burger`,
     location:`Burger Arena`,
     price:`$3.88`,
    },
    {
     image:require(`../images/Frame401.png`),
     title:`Toffe’s Cake`,
     location:`Top Sticks`,
     price:`$4.00`,
    },
    {image:require(`../images/Rectangle.png`),
    title:`Dancake`,
    location:`Cake World`,
    price:`$1.99`,
    },
    {image:require(`../images/Frame402.png`),
    title:`Crispy Sandwitch`,
    location:`Fastfood Dine`,
    price:`$3.00`,
    },
    {image:require(`../images/Frame403.png`),
    title:`Thai  Soup`,
    location:`Foody man`,
    price:`$2.79`,
    },
  ]*/
 
  const card= apiData.map((item)=>(
  <ReactCardDesgin
  key={item._id}
  image={item.image.url}
  title={item.title}
  location={item.place}
  price={`$${item.price.toFixed(2)}`} 
  // is used to format the price value as a string with two decimal places and prepended with a dollar sign ('$').
  onDelete={() => handleDelete(item._id)} // Pass the item ID to the delete function
  /> )
  )
  return (
    <Container> 
      <Carousel responsive={responsive}> 
        {card}
         {/* Form Modal */}
         <Modal show={showForm} onHide={handleCloseForm}>
          <Modal.Header closeButton>
          <Modal.Title>Add New Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form onSubmit={handleSubmitForm}>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="item" accept="image/*" onChange={handleFileChange} required />
            </Form.Group>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>location</Form.Label>
              <Form.Control type="text" name="place" value={formData.place} onChange={handleInputChange} required />
            </Form.Group>
            <Button type="submit">
              Submit
            </Button>
          </Form>
          </Modal.Body>
         </Modal>
      </Carousel>
         <Button variant="success" onClick={handelPostData}> Add card</Button> 
   </Container>    
     
  )
}


export default ReactCardDate;