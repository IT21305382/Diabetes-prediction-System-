import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios'

function Input() {
  const [minerals, setMinerals] = useState(Array(20).fill(''));
  const [inputTimeout, setInputTimeout] = useState(null);
  const [predictions, setPredictions]=useState(null)

  const mineralField={0:"gender", 1:"age", 2:"hypertension", 3:"heart_disease", 4:"smoking_history", 5:"bmi", 6:"HbA1c_level", 7:"blood_glucose_level"}

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a JSON object with the key 'input_data' and the array of minerals as its value
    const requestData = { input_data: minerals };

    axios({method:'POST',
      url:'http://127.0.0.1:5000/predict',
      data:requestData,
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }).then((response)=>{
      console.log(response.status);
      console.log(response.data);
      setPredictions(response.data.predictions)
    }).catch((error)=>{
      console.error({'error':error});
    })
  };

  const handleInput = (e, index) => {
    e.preventDefault();
    const newMin = e.target.value;

    // Clear any previous timeouts
    clearTimeout(inputTimeout);

    // Set a new timeout to update the minerals state after a delay (adjust as needed)
    const newInputTimeout = setTimeout(() => {
      setMinerals((prevMinerals) => {
        const updatedMinerals = [...prevMinerals];
        updatedMinerals[index] = newMin;
        return updatedMinerals;
      });
    }, 50);

    setInputTimeout(newInputTimeout);
  };

  const showPred=()=>{
      if (predictions) {
        return (
          <div className='predictions'>
            <p style={lableStyle}>Predictions: {predictions}</p>
          </div>
        );
      }
      return null;
    };
  
    const lableStyle = { 
        color:"#5543ca", 
        fontSize:"25px",       
      };
  
  const inputStyle = {
    display: "block",
      width:"100%",
      height:"36px",
      borderWidth: "0 0 2px 0",
      borderColor: "#5543ca",
      fontSize: "18px",
      fontWeight: "400",
      LineHeight: '26px',
  };

  const buttonStyle = {
    display: "inline-block",
    backgroundImage: "linear-gradient(125deg,#a72879,#064497)",
    color:"#fff",
    textTransform:"uppercase",
    letterSpacing:"2px",
    fontSize: "16px",
      width:"300px",
      height:"50px",
      border:"none",
      cursor: "pointer",
  };

  const lableStyle1 = {
    color: "#5543ca",
    marginLeft: '650px',
    fontSize: '46px',
    fontWeight: 'bold',
};

const cardstyle = {
    overflow: "hidden",
    boxShadow: "0 2px 20px ",
    borderRadius: "$radius",
    transition: "transform 200ms ease-in",
    padding: "20px",
    backdropFilter: "blur(20px)",
    background: "linear-gradient(rgba(255, 255, 255, 0.7),rgba(255, 255, 255, 0.3))",

}
  return (
     <div>
     <div className="d-flex flex-direction-column justify-content-between m-2">
          <label for="topic" style={lableStyle1}>Diabetes Prediction System</label>
     </div>
      <Form onSubmit={handleSubmit}>
      <div style={cardstyle}>
        <Row>
          {Object.keys(mineralField).map((index) => (
            <Col key={index} xs={12} md={6} lg={4}>
              <Form.Group className="mb-3" controlId={index}>
                <Form.Label style={lableStyle}>{mineralField[index]}</Form.Label>
                <Form.Control
                  type="number"
                  style={inputStyle}
                  placeholder={`Enter ${mineralField[index]}`}
                  value={minerals[index] !== null ? minerals[index] : ''}
                  onChange={(e) => handleInput(e, index)}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>
        <Button variant="primary" type="submit" style={buttonStyle}>
          Submit
        </Button>
      </div>
      </Form>
      {showPred()}
      </div>
  );
}

export { Input };