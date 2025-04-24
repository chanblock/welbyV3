import React, { useEffect, useState } from 'react';
import { Collapse, Form, FormGroup, FormControl, Button, Spinner, Row, Col } from 'react-bootstrap';
// import { getUser } from '../../api';
import {getUser} from '../../api/user';

import Select from 'react-select';


function ChildForm({ isOpen, setIsOpen, isSubmittingChild, handleSubmitChild, childName, setChildName, childAge, setChildAge, childCare, setChildCare, setBirthDate }) {
    const [childcareList, setChildcareList] = useState([]);
    const [useBirthDate, setUseBirthDate] = useState(false);

    useEffect(() => {
        const fetchChildCare = async () => {
            const token = localStorage.getItem('token');
            const data = await getUser(token);
            const list = data.user.childcareList;
            setChildcareList(list);
            if (list.length > 0) {
                setChildCare(list[0]);
            }
        }
        fetchChildCare();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar que solo uno de los campos esté lleno
        if (useBirthDate && childAge) {
            alert("Por favor, ingrese solo la fecha de nacimiento o la edad, no ambos.");
            return;
        }

        if (!useBirthDate && !childAge) {
            alert("Por favor, ingrese la edad o la fecha de nacimiento.");
            return;
        }

        // Asegurar que solo se envíe uno de los dos campos
        if (useBirthDate) {
            setChildAge(''); // Limpiar edad si se usa fecha de nacimiento
        } else {
            setBirthDate(null); // Limpiar fecha de nacimiento si se usa edad
        }

        handleSubmitChild(e);
    };

    return (
        <Collapse in={isOpen}>
            <Form onSubmit={handleSubmit} className="form-child">
                <p className="form-notice">
                    <strong><em>Children names are encrypted to keep secure their identity.</em></strong>
                </p>
                <FormGroup controlId="childName" className="form-group-custom">
                    <FormControl 
                        value={childName} 
                        onChange={(e) => setChildName(e.target.value)} 
                        placeholder="Child name" 
                        required 
                    />
                </FormGroup>

                <FormGroup>
                    <Form.Label>Age</Form.Label>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            label="Enter Age Directly"
                            name="ageMethod"
                            id="ageDirect"
                            checked={!useBirthDate}
                            onChange={() => {
                                setUseBirthDate(false);
                                setBirthDate(null);
                            }}
                        />
                        <Form.Check
                            type="radio"
                            label="Use Birth Date"
                            name="ageMethod"
                            id="ageBirthDate"
                            checked={useBirthDate}
                            onChange={() => {
                                setUseBirthDate(true);
                                setChildAge('');
                            }}
                        />
                    </div>
                </FormGroup>

                {!useBirthDate ? (
                    <FormGroup controlId="childAge" className="form-group-custom">
                        <FormControl 
                            type="number" 
                            value={childAge} 
                            onChange={(e) => setChildAge(e.target.value)} 
                            placeholder="Age" 
                            required={!useBirthDate}
                            disabled={useBirthDate}
                        />
                    </FormGroup>
                ) : (
                    <FormGroup>
                        <Form.Label>Date of Birth</Form.Label>
                        <FormControl 
                            type="date" 
                            onChange={(e) => setBirthDate(e.target.value)}
                            required={useBirthDate}
                            disabled={!useBirthDate}
                        />
                    </FormGroup>
                )}

                <Button variant="link" type="submit" disabled={isSubmittingChild}>
                    {isSubmittingChild ? <Spinner animation="border" size="sm" /> : <strong>Add Child</strong>}
                </Button>
                <Button variant="link" onClick={() => setIsOpen(!isOpen)}>Close</Button>
            </Form>
        </Collapse>
    );
}

export default ChildForm;
