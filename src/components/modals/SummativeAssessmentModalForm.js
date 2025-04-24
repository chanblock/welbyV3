import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChildForm from '../childcomponents/ChildForm';
import { submitSummativeAssessment, fetchLastDocumentData } from '../../api/report';

const SummativeAssessmentModalForm = ({ 
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
    outCome1,
    setOutCome1,
    outCome2,
    setOutCome2,
    outCome3,
    setOutCome3,
    outCome4,
    setOutCome4,
    outCome5,
    setOutCome5,
    handleRedirect
}) => {
    const [date, setDate] = useState(new Date());

    const handleConfirm = (date) => {
        setDate(date);
    };

    const handlePreviousSummativeAssessment = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "summative_assessment");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setOutCome1(lastVariable.get_variables.variables.outCome1);
            setOutCome2(lastVariable.get_variables.variables.outCome2);
            setOutCome3(lastVariable.get_variables.variables.outCome3);
            setOutCome4(lastVariable.get_variables.variables.outCome4);
            setOutCome5(lastVariable.get_variables.variables.outCome5);
        } else {
            setSubmittingPreviousVariables(false);
            setAlertMessage("not variables found.");
            setAlertType("warning");
            setAlertVisible(true);
        }
    };

    const handleSubmitSummativeAssessment = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const outComes = {
                'outCome1': outCome1,
                'outCome2': outCome2,
                'outCome3': outCome3,
                'outCome4': outCome4,
                'outCome5': outCome5
            };
            
            const data = await submitSummativeAssessment(token, date, name, age, outComes);
            
            if (data.error) {
                setAlertMessage(data.error);
                setAlertType("danger");
                setAlertVisible(true);
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Summative Assessment Report',
                    content: data['response']['message'],
                    report_id: data['response']['report_id'],
                    name,
                    age,
                    outCome1,
                    outCome2,
                    outCome3,
                    outCome4,
                    outCome5
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
        setOutCome1('');
        setOutCome2('');
        setOutCome3('');
        setOutCome4('');
        setOutCome5('');
        setSelectedChild('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Summative Assessment</Modal.Title>
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
                <Form onSubmit={handleSubmitSummativeAssessment}>
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
                            placeholder="Example: 1,7"
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="outCome1">
                        <Form.Label>Outcome1 Children have a strong sense of identity:</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-size"
                            placeholder="Example: Children have a strong sense of identity: they prefer to play and be alone, they look for their teachers when they are afraid, they participate in reading groups, they know what they want, they are whimsical"
                            value={outCome1}
                            onChange={(e) => setOutCome1(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="outCome2">
                        <Form.Label>Outcome2 Children are connected with and contribute to their world:</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-size"
                            placeholder="Example: Children are connected with and contribute to their world: he is kind, he is not aggressive, he respects others"
                            value={outCome2}
                            onChange={(e) => setOutCome2(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="outCome3">
                        <Form.Label>Outcome3 Children have a strong sense of wellbeing:</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-size"
                            placeholder="Example: Children have a strong sense of wellbeing: they do not like to wear the hat or the suncream when they go out, it is difficult to start the toilet training process because they refuse to sit down despite the fact that the educators create different strategies"
                            value={outCome3}
                            onChange={(e) => setOutCome3(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="outCome4">
                        <Form.Label>Outcome4 Children are confident and involved learners:</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-size"
                            placeholder="Example: Children are confident and involved learners: chooses what they want to learn, answers correctly when they feel confident, during art and craft activities is drawn to activities where markers are used, likes reading sections and looks for books to look at"
                            value={outCome4}
                            onChange={(e) => setOutCome4(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="outCome5">
                        <Form.Label>Outcome5 Children are effective communicators:</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-size"
                            placeholder="Example: Children are effective communicators: he is shy when talking to other friends or teachers despite having good verbal skills, he prefers non-verbal communication"
                            value={outCome5}
                            onChange={(e) => setOutCome5(e.target.value)}
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
                        onClick={handlePreviousSummativeAssessment} 
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

export default SummativeAssessmentModalForm; 