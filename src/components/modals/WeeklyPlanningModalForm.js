import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { submitWeeklyPlanning, fetchLastDocumentData } from '../../api/report';

const WeeklyPlanningModalForm = ({
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
    rangeAge,
    setRangeAgePlanning,
    descriptionPlanning,
    setDescriptionPlanning,
    handleRedirect
}) => {
    const [date, setDate] = useState(new Date());

    const handleConfirm = (date) => {
        setDate(date);
    };

    const handlePreviousWeeklyPlanning = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "weeklyn_planning");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            if (lastVariable.get_variables.variables.range_age) {
                setRangeAgePlanning(lastVariable.get_variables.variables.range_age);
            }
            setDescriptionPlanning(lastVariable.get_variables.variables.goals);
        } else {
            setSubmittingPreviousVariables(false);
            setAlertMessage("not variables found.");
            setAlertType("warning");
            setAlertVisible(true);
        }
    };

    const handleSubmitWeeklyPlanning = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const data = await submitWeeklyPlanning(token, date, rangeAge, descriptionPlanning);
            
            if (data.error) {
                setAlertMessage(data.error);
                setAlertType("danger");
                setAlertVisible(true);
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Weekly Planning Report',
                    content: data['response']['message'],
                    report_id: data['response']['report_id'],
                    rangeAge,
                    descriptionPlanning
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
        setRangeAgePlanning('');
        setDescriptionPlanning('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Weekly Planning</Modal.Title>
            </Modal.Header>
            {alertVisible && (
                <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            <Modal.Body>
                <Form onSubmit={handleSubmitWeeklyPlanning}>
                    <Form.Group controlId="date">
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            className="form-control"
                            selected={date}
                            onChange={handleConfirm}
                        />
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="age">
                        <Form.Label>Range Age</Form.Label>
                        <Form.Control
                            type="textarea"
                            value={rangeAge}
                            placeholder="Example: 1-2"
                            onChange={(e) => setRangeAgePlanning(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Goals</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-long"
                            value={descriptionPlanning}
                            placeholder="Example: Carry out activities in the outdoor area that allow children to enjoy Easter time"
                            onChange={(e) => setDescriptionPlanning(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <br></br>
                    <br />
                    <Button className="button-space" variant="primary" type="submit" disabled={submitting} size="sm">
                        {submitting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                    <Button className="button-space" variant="secondary" onClick={handlePreviousWeeklyPlanning} disabled={submittingPreviousVariables} size="sm">
                        {submittingPreviousVariables ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Previous Variables"
                        )}
                    </Button>
                    <Button variant="light" onClick={handleClean} size="sm" >
                        Clean
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default WeeklyPlanningModalForm; 