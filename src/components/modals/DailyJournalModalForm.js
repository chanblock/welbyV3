import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { submitDailyReport } from '../../api/report';

const DailyJournalModal = ({ 
    show, 
    handleClose, 
    submitting, 
    setSubmitting,
    submittingPreviousVariables,
    handlePreviousVariablesDailyReport,
    alertVisible,
    alertMessage,
    alertType,
    setAlertVisible,
    handleRedirect,
    showAlert
}) => {
    const [date, setDate] = useState(new Date());
    const [rangeAgeDailyReport, setRangeAgeDailyReport] = useState('');
    const [activities, setActivities] = useState('');

    const handleConfirm = (date) => {
        setDate(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const data = await submitDailyReport(token, rangeAgeDailyReport, date, activities);
            if (data.error) {
                showAlert(data.error, "danger");
            } else {
                setSubmitting(false);
                handleClose();
                const reportData = {
                    title: 'Daily Report',
                    content: data['response']['message'],
                    report_id: data['response']['report_id'],
                    activities,
                    rangeAgeDailyReport,
                };
                handleRedirect(reportData);
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e);
    };

    const handleClean = () => {
        setDate(new Date());
        setRangeAgeDailyReport('');
        setActivities('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Daily Journal</Modal.Title>
            </Modal.Header>
            {alertVisible && (
                <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="date">
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            className="form-control"
                            selected={date}
                            onChange={handleConfirm}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="rangeAgeDailyReport">
                        <Form.Label>Range age</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Example: 1-2"
                            value={rangeAgeDailyReport}
                            onChange={(e) => setRangeAgeDailyReport(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="activities">
                        <Form.Label>Activities</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Example: Morning activity: playing in the outdoor area..."
                            value={activities}
                            onChange={(e) => setActivities(e.target.value)}
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
                        onClick={handlePreviousVariablesDailyReport} 
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

export default DailyJournalModal; 