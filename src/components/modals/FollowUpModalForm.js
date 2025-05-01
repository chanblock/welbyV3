import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChildForm from '../childcomponents/ChildForm';
import { submitFollowUp, fetchLastDocumentData } from '../../api/report';

const FollowUpModalForm = ({ 
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
    goalFollowUp,
    setGoalFollowUp,
    descriptionsFollowUp,
    setDescriptionsFollowUp,
    handleRedirect
}) => {
    const [date, setDate] = useState(new Date());

    const handleConfirm = (date) => {
        setDate(date);
    };

    const handlePreviousFollowUp = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "follow_up");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            setGoalFollowUp(lastVariable.get_variables.variables.goals);
            setDescriptionsFollowUp(lastVariable.get_variables.variables.descriptions);
        } else {
            setSubmittingPreviousVariables(false);
            setAlertMessage("not variables found.");
            setAlertType("warning");
            setAlertVisible(true);
        }
    };

    const handleSubmitFollowUp = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const data = await submitFollowUp(token, date, name, age, goalFollowUp, descriptionsFollowUp);
            
            if (data.error) {
                setAlertMessage(data.error);
                setAlertType("danger");
                setAlertVisible(true);
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Follow Up Report',
                    content: data['response']['message'],
                    report_id: data['response']['report_id'],
                    name,
                    age,
                    goalFollowUp,
                    descriptionsFollowUp
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
        setGoalFollowUp('');
        setDescriptionsFollowUp('');
        setSelectedChild(null);
    };

    const calculateAge = (birthDate) => {
        try {
            if (!birthDate) return null;
            
            const today = new Date();
            const birth = new Date(birthDate);
            
            if (isNaN(birth.getTime())) return null;
            
            let age = today.getFullYear() - birth.getFullYear();
            const monthDifference = today.getMonth() - birth.getMonth();
            
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            
            return age;
        } catch (error) {
            console.error('Error calculating age:', error);
            return null;
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Follow up</Modal.Title>
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
                <Form onSubmit={handleSubmitFollowUp}>
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
                                console.log('Niño seleccionado:', selected);
                                if (selected) {
                                    setSelectedChild(selected);
                                    setName(selected.child_name);
                                    
                                    // Determinar qué valor de edad usar
                                    if (selected.birth_date) {
                                        const calculatedAge = calculateAge(selected.birth_date);
                                        setAge(calculatedAge !== null ? calculatedAge.toString() : '');
                                    } else {
                                        setAge(selected.age || '');
                                    }
                                } else {
                                    console.log("No child found with id: ", e.target.value);
                                }
                            }}
                            required
                        >
                            <option value="" disabled={selectedChild !== ""}>Select child</option>
                            {childs.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.child_name} - {child.birth_date ? calculateAge(child.birth_date) : child.age} años
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

                    <Form.Group controlId="goalFollowUp">
                        <Form.Label>Goals</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Example: To assist Jasper in developing his fine motor skills"
                            value={goalFollowUp}
                            onChange={(e) => setGoalFollowUp(e.target.value)}
                            required
                            rows={4}
                            style={{ minHeight: '100px', resize: 'vertical' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="descriptionsFollowUp">
                        <Form.Label>Descriptions</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Example: Jasper was drawn to the paper-cutting-with-scissors activity. He sat in the chair and very attentively waited for the teacher's instructions to start developing the activity. Jasper enjoyed cutting the paper into small pieces. Jasper successfully completed the activity showing that his fine motor skills have greatly improved."
                            value={descriptionsFollowUp}
                            onChange={(e) => setDescriptionsFollowUp(e.target.value)}
                            required
                            rows={4}
                            style={{ minHeight: '180px', resize: 'vertical' }}
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
                        onClick={handlePreviousFollowUp} 
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

FollowUpModalForm.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    submittingPreviousVariables: PropTypes.bool.isRequired,
    setSubmittingPreviousVariables: PropTypes.func.isRequired,
    alertVisible: PropTypes.bool.isRequired,
    alertMessage: PropTypes.string,
    alertType: PropTypes.string,
    setAlertVisible: PropTypes.func.isRequired,
    setAlertMessage: PropTypes.func.isRequired,
    setAlertType: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    isSubmittingChild: PropTypes.bool.isRequired,
    handleSubmitChild: PropTypes.func.isRequired,
    childName: PropTypes.string.isRequired,
    setChildName: PropTypes.func.isRequired,
    childAge: PropTypes.string.isRequired,
    setChildAge: PropTypes.func.isRequired,
    setBirthDate: PropTypes.func.isRequired,
    childCare: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    setChildCare: PropTypes.func.isRequired,
    childs: PropTypes.array.isRequired,
    selectedChild: PropTypes.object,
    setSelectedChild: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
    age: PropTypes.string.isRequired,
    setAge: PropTypes.func.isRequired,
    goalFollowUp: PropTypes.string.isRequired,
    setGoalFollowUp: PropTypes.func.isRequired,
    descriptionsFollowUp: PropTypes.string.isRequired,
    setDescriptionsFollowUp: PropTypes.func.isRequired,
    handleRedirect: PropTypes.func.isRequired
};

export default FollowUpModalForm; 