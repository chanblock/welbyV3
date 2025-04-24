import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { submitWeeklyReflection, fetchLastDocumentData } from '../../api/report';

const WeeklyCriticalReflectionModalForm = ({
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
    date,
    handleConfirm,
    description_reflection,
    setDescriptionReflection,
    handleRedirect
}) => {
    const handlePreviousWeeklyReflection = async () => {
        setSubmittingPreviousVariables(true);

        const token = localStorage.getItem('token');
        const lastVariable = await fetchLastDocumentData(token, "weekly_reflection");
        const variables = lastVariable?.get_variables?.variables;
        if (variables) {
            setSubmittingPreviousVariables(false);
            if (lastVariable.get_variables.variables.descriptions) {
                setDescriptionReflection(lastVariable.get_variables.variables.descriptions);
            }
        } else {
            setSubmittingPreviousVariables(false);
            setAlertMessage("not variables found.");
            setAlertType("warning");
            setAlertVisible(true);
        }
    };

    const handleSubmitWeeklyReflection = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const data = await submitWeeklyReflection(token, date, description_reflection);
            
            if (data.error) {
                setAlertMessage(data.error);
                setAlertType("danger");
                setAlertVisible(true);
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Weekly Critical Reflection Report',
                    content: data['response']['message'],
                    report_id: data['response']['report_id'],
                    description_reflection
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
        handleConfirm(new Date());
        setDescriptionReflection('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Weekly Critical Reflection</Modal.Title>
            </Modal.Header>
            {alertVisible && (
                <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            <Modal.Body>
                <Form onSubmit={handleSubmitWeeklyReflection}>
                    <Form.Group controlId="date">
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            className="form-control"
                            selected={date}
                            onChange={handleConfirm}
                        />
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="description">
                        <Form.Label>Describe weekly reflection</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="custom-textarea-long"
                            value={description_reflection}
                            placeholder="Example: Children were engaged during the group time by choosing the letter they wanted to learn during the week. Children enjoyed singing five little monkeys swinging on the tree. Children enjoyed developing arts and crafts about letters and they remember easily what word start whit the letter, in this case P for piggy. Some parents are worried about their child emotional manage because they mention they do not know how to manage it, because the children do not have self-regulation. Many children need to improve their help-self skills"
                            onChange={(e) => setDescriptionReflection(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <br></br>
                    <br />
                    <Button className="button-space" variant="primary" type="submit" disabled={submitting} size="sm" >
                        {submitting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                    <Button className="button-space" variant="secondary" onClick={handlePreviousWeeklyReflection} disabled={submittingPreviousVariables} size="sm" >
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

export default WeeklyCriticalReflectionModalForm; 