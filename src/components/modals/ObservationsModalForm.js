import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChildForm from '../childcomponents/ChildForm';
import { submitObservations, fetchLastDocumentData } from '../../api/report';

const ObservationsModalForm = ({ 
    show, 
    handleClose, 
    submitting, 
    setSubmitting,
    submittingPreviousVariables,
    setSubmittingPreviousVariables,
    alertVisible,
    alertMessage,
    alertType,
    setAlertVisible,
    setAlertMessage,
    setAlertType,
    isOpen,
    setIsOpen,
    isSubmittingChild,
    handleSubmitChild,
    childName,
    setChildName,
    childAge,
    setChildAge,
    setBirthDate,
    childCare,
    setChildCare,
    childs,
    selectedChild,
    setSelectedChild,
    name,
    setName,
    age,
    setAge,
    goalObservations,
    setGoalObservations,
    descriptions,
    setDescriptions,
    handleRedirect
}) => {
    const [date, setDate] = useState(new Date());

    const handleConfirm = (date) => {
        setDate(date);
    };

    const handlePreviousObservations = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "descriptions_report");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setDescriptions(lastVariable.get_variables.variables.descriptions);
            setGoalObservations(lastVariable.get_variables.variables.goal_observations);
        } else {
            setSubmittingPreviousVariables(false);
            setAlertMessage("not variables found.");
            setAlertType("warning");
            setAlertVisible(true);
        }
    };

    const handleSubmitObservations = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const data = await submitObservations(token, date, name, age, goalObservations, descriptions);
            
            if (data.error) {
                setAlertMessage(data.error);
                setAlertType("danger");
                setAlertVisible(true);
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Observations Report',
                    content: data['response']['message'],
                    report_id: data['response']['report_id'],
                    name,
                    age,
                    goalObservations,
                    descriptions
                };
                handleRedirect(reportData);
            }
        } catch (error) {
            console.error(error);
            setAlertMessage("Failed to send report. Please try again later.");
            setAlertType("danger");
            setAlertVisible(true);
            setSubmitting(false);
        }
    };

    const handleClean = () => {
        setDate(new Date());
        setName('');
        setAge('');
        setGoalObservations('');
        setDescriptions('');
        setSelectedChild('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Report Observations</Modal.Title>
            </Modal.Header>
            {alertVisible && (
                <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            <Modal.Body>
                <ChildForm
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isSubmittingChild={isSubmittingChild}
                    handleSubmitChild={handleSubmitChild}
                    childName={childName}
                    setChildName={setChildName}
                    childAge={childAge}
                    setChildAge={setChildAge}
                    setBirthDate={setBirthDate}
                    childCare={childCare}
                    setChildCare={setChildCare}
                />
                <Form onSubmit={handleSubmitObservations}>
                    <Form.Group controlId="date">
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            className="form-control"
                            selected={date}
                            onChange={handleConfirm}
                        />
                    </Form.Group>

                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedChild ? selectedChild._id : ""}
                            onChange={(e) => {
                                const selected = childs.find(child => child._id === e.target.value);
                                if (selected) {
                                    setSelectedChild(selected);
                                    setName(selected.child_name);
                                    setAge(selected.age);
                                } else {
                                    console.log("No child found with id: ", e.target.value);
                                }
                            }}
                            required
                        >
                            <option value="" disabled={selectedChild !== ""}>Select child</option>
                            {childs.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.child_name}
                                </option>
                            ))}
                        </Form.Control>
                        <Button variant="link" onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Add Child'}</Button>
                    </Form.Group>

                    <Form.Group controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="goalObservations">
                        <Form.Label>Goal Observations</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Example: Improve verbal communication using her words to express feelings and her needs"
                            value={goalObservations}
                            onChange={(e) => setGoalObservations(e.target.value)}
                            required
                            rows={4}
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="descriptions">
                        <Form.Label>Descriptions</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Example: During group time, she was able to express her feelings when another child took her toy..."
                            value={descriptions}
                            onChange={(e) => setDescriptions(e.target.value)}
                            required
                            rows={4}
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </Form.Group>
                    <br />
                    <Button className="button-space" variant="primary" type="submit" disabled={submitting} size="sm">
                        {submitting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                    <Button 
                        className="button-space" 
                        variant="secondary" 
                        onClick={handlePreviousObservations} 
                        disabled={submittingPreviousVariables} 
                        size="sm"
                    >
                        {submittingPreviousVariables ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Previous Variables"
                        )}
                    </Button>
                    <Button 
                        variant="light" 
                        onClick={handleClean} 
                        size="sm"
                    >
                        Clean
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ObservationsModalForm; 