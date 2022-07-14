import React, { useEffect, useState, useRef } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import http from './http';

function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

const UploadFile = () => {
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        if (isLoading) {
            simulateNetworkRequest().then(() => {
            setLoading(false);
            });
        }
    }, [isLoading]);

    const handleClick = () => setLoading(true);

    const initialValues = {device_model:'',firmware_version:'',firmware_file:''}
    const[inputs,setInputs] = useState(initialValues);
    const[formErrors,setFormErrors] = useState({});
    const[isSubmit,setIsSubmit] = useState(false);
    const[alert,setAlert] = useState({});
    const[data,setData]=useState([]);

    const ref = useRef();

    const reset = () => {
        ref.current.value = "";
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }

    const handleFileChange = (event) => {
        const value = event.target.files[0];
        setInputs(values => ({...values,['firmware_file']:value}))
    }

    const submitForm = ()=>{
        setFormErrors(validate(inputs));
        setIsSubmit(true);
        if(formErrors !== ''){
            http.post('/upload_file', inputs).then((res)=>{
                if(res.data.status == 1){
                    fetchAllData();
                    setInputs(initialValues);
                    reset();
                }
                setAlert({'status':res.data.status, 'message':res.data.message});
            }).catch((e)=>{
                console.log(e);
            })
        }
    }

    useEffect(()=>{
        if(Object.keys(formErrors).length === 0 && isSubmit){
            console.log(inputs);
        }
    },[formErrors])

    const validate = (values) => {
        const errors = {}
        if(!values.device_model){
            errors.device_model = "Device Model is Required!";
        }
        if(!values.firmware_version){
            errors.firmware_version = "Firmware Version is Required!";
        }
        if(!values.firmware_file){
            errors.firmware_file = "Firmware File is Required!";
        }
        return errors;
    }

	useEffect(()=>{
		fetchAllData();
	},[]);

	const fetchAllData = ()=>{
		http.get('/list_files').then(res=>{
			setData(res.data);
		})
	}

    return (
        <div className="container">
            <div className="my-3 mx-5">
                <Alert key='danger' show={(alert.status == 1 || alert.status == 2) ? true:false} variant={(alert.status == 1) ? 'success':'danger'}>
                    {alert.message}
                </Alert>
                <Card >
                    <Card.Header as="h5">GWX Firmware Upload</Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Device Model</Form.Label>
                            <Form.Select name="device_model" value={inputs.device_model} onChange={handleChange} required>
                                <option>--Select Device--</option>
                                <option>gwx100</option>
                                <option>gwx200</option>
                            </Form.Select>
                            <div className="text-danger">{formErrors.device_model}</div>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Firmware Version</Form.Label>
                                    <Form.Control name="firmware_version" placeholder="Firmware Version" value={inputs.firmware_version} onChange={handleChange} required/>
                                    <div className="text-danger">{formErrors.firmware_version}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Select Firmware</Form.Label>
                                    <Form.Control name="firmware_file" type="file" ref={ref} onChange={handleFileChange} className="firmwarefile" required/>
                                    <div className="text-danger">{formErrors.firmware_file}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button 
                            type="submit" 
                            variant="primary"
                            disabled={isLoading}
                            onClick={function(event){ 
                                submitForm(); 
                                return !isLoading ? handleClick() : null;
                            }}
                        >
                            {isLoading ? 'Uploading…' : 'Upload Data'}
                        </Button>
                    </Card.Body>
                </Card>
            </div>
            <Table>
				<thead>
					<tr>
						<th>#</th>
						<th>Device Model</th>
						<th>Firmware Version</th>
						<th>File Path</th>
						<th>Created At</th>
					</tr>
				</thead>
				<tbody>
					{data.map((data,index)=>(
					<tr key={data.id}>
						<td>{++index}</td>
						<td>{data.device_model}</td>
						<td>{data.firmware_version}</td>
						<td>{data.firmware_file}</td>
						<td>{new Date(data.created_at).toDateString()}</td>
					</tr> 
					))}
				</tbody>
			</Table>
        </div>
    )
}

export default UploadFile;