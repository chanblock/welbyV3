import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChildForm from '../childcomponents/ChildForm';
import { submitGoal, fetchLastDocumentData } from '../../api/report';

const GoalModalForm = ({ 
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
    goals,
    setGoals,
    handleRedirect
}) => {
    const [date, setDate] = useState(new Date());

    const handleConfirm = (date) => {
        setDate(date);
    };

    const handlePreviousGoal = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "goal_report");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setGoals(lastVariable.get_variables.variables.goals);
        } else {
            setSubmittingPreviousVariables(false);
            setAlertMessage("not variables found.");
            setAlertType("warning");
            setAlertVisible(true);
        }
    };

    const handleSubmitGoal = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const data = await submitGoal(token, date,name, age,  goals);
            if (data.error) {
                setAlertMessage(data.error);
                setAlertType("danger");
                setAlertVisible(true);
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Goal Report',
                    content: data['response']['message'],
                    report_id: data['response']['report_id'],
                    goals,
                    name,
                    age,
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
        setGoals('');
        setSelectedChild('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Report Goal</Modal.Title>
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
                <Form onSubmit={handleSubmitGoal}>
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

                    <Form.Group controlId="goals">
                        <Form.Label>Goals</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-long"
                            placeholder="Example: Improve verbal communication using her words to express feelings and her needs"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            required
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
                        onClick={handlePreviousGoal} 
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

export default GoalModalForm; 