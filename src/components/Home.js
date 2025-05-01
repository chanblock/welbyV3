import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import "../styles/CardModern.css";
import "../styles/Home.css";
import "../styles/Auth.css";
import { Button, Modal} from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import {  submitHistoricalReport,  submitGetVariablesReports } from '../api/report';
import { UpdateFieldUser, getUser } from "../api/user";
import { UpdateAllChildren, getListChilds, addNewChild } from "../api/childs";
import { checkSubscription } from "../api/payment";
import { UpdateChildcareModal } from "./report/UpdateChildcareModal";
import { useReports } from "../context/ReportContext";
import DailyJournalModalForm from "./modals/DailyJournalModalForm";
import GoalModalForm from "./modals/GoalModalForm";
import ObservationsModalForm from "./modals/ObservationsModalForm";
import FollowUpModalForm from "./modals/FollowUpModalForm";
import SummativeAssessmentModalForm from './modals/SummativeAssessmentModalForm';
import DailyReflectionModalForm from './modals/DailyReflectionModalForm';
import WeeklyCriticalReflectionModalForm from './modals/WeeklyCriticalReflectionModalForm';
import WeeklyPlanningModalForm from './modals/WeeklyPlanningModalForm';
import CardModern from './CardModern';
const Home = () => {
    const { setReports } = useReports();
    const [fullAccess, setFullAccess] = useState(localStorage.getItem("fullAccess") === "true");
    const updateFullAccessStatus = async () => {
        try {
            // Reemplaza 'getUserData' con la función que obtiene la información del usuario a través de la API.
            const userData = await checkSubscription(localStorage.getItem("token"));

            if (userData.subscription_end_date !== false) {
                const today = new Date();
                const subscriptionEndDate = new Date(userData.subscription_end_date);
                const days = Math.ceil((subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
                if (days <= 0) {
                    localStorage.setItem("fullAccess", false);
                    setFullAccess(false);
                } else {
                    localStorage.setItem("fullAccess", true);
                    setFullAccess(true);
                }
            }
            // Asegúrate de actualizar el estado de fullAccess después de cambiar el valor en localStorage
        } catch (error) {
            console.error('Failed to update full access status:', error);
        }
    };

    useEffect(() => {
        // Verifica si el usuario está autenticado antes de llamar a 'updateFullAccessStatus'
        if (localStorage.getItem("token")) {
            updateFullAccessStatus();
        }
    }, []);
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'fullAccess') {
                setFullAccess(e.newValue === "true");
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Limpieza al desmontar el componente
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // const gnrl
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [date, setDate] = useState(new Date());
    const handleConfirm = (date) => {
        setDate(date);
    };

    const [childs, setChilds] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchChilds = async () => {
            const data = await getListChilds(token);
            setChilds(data.data);
        };

        fetchChilds();
    }, []);


    // const report view
    const navigate = useNavigate();
    // const spinner Previous variables 
    const [submittingPreviousVariables, setSubmittingPreviousVariables] = useState(false);

    // const daily report
    const [show, setShow] = useState(false);
    const [submitting, setSubmitting] = useState(false);
   // const [activities, setActivities] = useState("");
    //const [rangeAgeDailyReport, setRangeAgeDailyReport] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = async () => setShow(true);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const handleUpdate = async (childcareInput) => {
        // Aquí puedes llamar a la función que actualiza el campo del usuario
        const token = localStorage.getItem('token');
        try {

           const result = await UpdateFieldUser(token, 'childcareList', childcareInput);
           const updatedAllChildren = await UpdateAllChildren(token, 'childcare', childcareInput)
        
            showAlert("childcare successfully added")
        } catch (error) {
            console.error('Failed to update user field: ', error);
        }
        console.log("Updating user field...", childcareInput);
        setIsOpenModal(false);
    };
    const handleCreateClick = async () => {
        const token = localStorage.getItem('token'); // Obtener el token del local storage
        // Obtener los datos del usuario
        const userData = await getUser(token);
        // Validar si userData tiene el campo childcareList
        if (!userData.user.childcareList) {
            alert("Hi there, please update your childcare center name");
            setIsOpenModal(true);
            return;
        }

        // Si todo está bien, abre el modal
        handleShow();
    };


    // const to goal
    const [showGoal, setShowGoal] = useState(false);
    const [goals, setGoals] = useState('');
    const handleCloseGoal = () => setShowGoal(false);
    const handleShowGoal = () => setShowGoal(true);


    // const to Observations
    const [showObservations, setShowObservations] = useState(false);
    const [goalObservations, setGoalObservations] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const handleCloseObservations = () => setShowObservations(false);
    const handleShowObservations = () => setShowObservations(true);

    // const Critical Reflection
    const [showFormReflection, setShowFormReflection] = useState(false);
    const [description, setDescription] = useState('');
    const handleCloseFormReflection = () => setShowFormReflection(false);
    const handleShowFormReflection = () => setShowFormReflection(true);

    // const Weekly Reflection
    const [showFormWeeklyReflection, setShowFormWeeklyReflection] = useState(false);
    const [description_reflection, setDescriptionReflection] = useState('');
    const handleCloseFormWeeklyReflection = () => setShowFormWeeklyReflection(false);
    const handleShowFormWeeklyReflection = () => setShowFormWeeklyReflection(true);

    // const Weekly Planning
    const [showFormWeeklyPlanning, setShowFormWeeklyPlanning] = useState(false);
    const [descriptionPlanning, setDescriptionPlanning] = useState('');
    const [rangeAge, setRangeAgePlanning] = useState('');
    const handleCloseFormWeeklyPlanning = () => setShowFormWeeklyPlanning(false);
    const handleShowFormWeeklyPlanning = () => setShowFormWeeklyPlanning(true);

    // const to follow up
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [goalFollowUp, setGoalFollowUp] = useState('');
    const [descriptionsFollowUp, setDescriptionsFollowUp] = useState('');
    const handleCloseFollowUp = () => setShowFollowUp(false);
    const handleShowFollowUp = () => setShowFollowUp(true);

    // const summative assessment
    const [showSummativeAssessment, setShowSummativeAssessment] = useState(false);
    const [outCome1, setOutCome1] = useState('');
    const [outCome2, setOutCome2] = useState('');
    const [outCome3, setOutCome3] = useState('');
    const [outCome4, setOutCome4] = useState('');
    const [outCome5, setOutCome5] = useState('');
    const handleCloseSummativeAssessment = () => setShowSummativeAssessment(false);
    const handleShowSummativeAssessment = () => setShowSummativeAssessment(true);


    // add child
    const [isOpen, setIsOpen] = useState(false);
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');
    const [childCare, setChildCare] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [isSubmittingChild, setIsSubmittingChild] = useState(false);

    //  const to alert
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");

    const showAlert = (message, type = "info") => {
        setAlertMessage(message);
        setAlertType(type); // Set the alert type
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, 5000);
    };

    const [showTutorial, setShowTutorial] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");

    const handleShowTutorial = (videoUrl) => {
        setCurrentVideoUrl(videoUrl);
        setShowTutorial(true);
    };

    const handleCloseTutorial = () => {
        setShowTutorial(false);
    };

   
    const handleRedirect = (reportData) => {
        navigate('/report', { state: { reportData } });
    };


    const handleSubmitChild = async (e) => {
        e.preventDefault();
        setIsSubmittingChild(true);
        const token = localStorage.getItem('token');

        const response = await addNewChild(token, childName, childAge, childCare, birthDate);
        if (response.error) {
            setIsSubmittingChild(false);
            showAlert("Error adding child.", "danger");
        } else {
            setIsSubmittingChild(false);
            showAlert("Child added successfully, you can select the child.", "success");
            const data = await getListChilds(token);
            setChilds(data.data);
        }

        setIsSubmittingChild(false);
    }


    const handleHistoricalReportSubmission = async (typeReport) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            // Guardar el tipo de reporte en el localStorage
            localStorage.setItem("typeReport", typeReport);
            const data = await submitHistoricalReport(token, typeReport);
            // Filtrar los reportes con el mismo 'typeReport'
            const filteredReports = data.list_report.filter(report => report.type_report === typeReport);
            // Establecer los reportes en el contexto
            setReports(filteredReports);
            // Redirigir a la vista de reportes y pasar la data como estado de ubicación      
            navigate('/reports-list');


        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }
    };

    const handleSelectReportReflectionSubmission = async (typeReport) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const data = await submitGetVariablesReports(token, typeReport);

            // Filtrar los reportes con el mismo 'typeReport'
            const filteredReports = data.get_report.filter(report => report.type_report === typeReport);

            // Redirigir a la vista de reportes y pasar la data como estado de ubicación
            navigate('/select_report_reflection', { state: { reports: filteredReports } });
        } catch (error) {
            console.error(error);
            showAlert("Failed to send report. Please try again later.", "danger");
            setSubmitting(false);
        }
    };
  
 

    return (
        <div className="home-container">
            {showTutorial &&
                <Modal show={showTutorial} onHide={handleCloseTutorial} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Tutorial Video</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <iframe width="100%" height="315" src="https://www.youtube.com/embed/MrTz5xjmso4?si=hg-roG7Md9N8CnW9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
                        <iframe
                            width="100%"
                            height="315"
                            src={currentVideoUrl}
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen>
                        </iframe>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseTutorial}>Close</Button>
                    </Modal.Footer>
                </Modal>

            }
            <UpdateChildcareModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} handleUpdate={handleUpdate} />
            
            <DailyJournalModalForm
                show={show}
                handleClose={handleClose}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                handleRedirect={handleRedirect}
                showAlert={showAlert}
            />
            <GoalModalForm
                show={showGoal}
                handleClose={handleCloseGoal}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
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
                childs={childs}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
                name={name}
                setName={setName}
                age={age}
                setAge={setAge}
                goals={goals}
                setGoals={setGoals}
                handleRedirect={handleRedirect}
            />
            <ObservationsModalForm
                show={showObservations}
                handleClose={handleCloseObservations}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
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
                childs={childs}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
                name={name}
                setName={setName}
                age={age}
                setAge={setAge}
                goalObservations={goalObservations}
                setGoalObservations={setGoalObservations}
                descriptions={descriptions}
                setDescriptions={setDescriptions}
                handleRedirect={handleRedirect}
            />
            <FollowUpModalForm
                show={showFollowUp}
                handleClose={handleCloseFollowUp}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
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
                childs={childs}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
                name={name}
                setName={setName}
                age={age}
                setAge={setAge}
                goalFollowUp={goalFollowUp}
                setGoalFollowUp={setGoalFollowUp}
                descriptionsFollowUp={descriptionsFollowUp}
                setDescriptionsFollowUp={setDescriptionsFollowUp}
                handleRedirect={handleRedirect}
            />
            <DailyReflectionModalForm
                show={showFormReflection}
                handleClose={handleCloseFormReflection}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
                date={date}
                handleConfirm={handleConfirm}
                description={description}
                setDescription={setDescription}
                handleRedirect={handleRedirect}
            />
            <WeeklyCriticalReflectionModalForm
                show={showFormWeeklyReflection}
                handleClose={handleCloseFormWeeklyReflection}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
                date={date}
                handleConfirm={handleConfirm}
                description_reflection={description_reflection}
                setDescriptionReflection={setDescriptionReflection}
                handleRedirect={handleRedirect}
            />
            <WeeklyPlanningModalForm
                show={showFormWeeklyPlanning}
                handleClose={handleCloseFormWeeklyPlanning}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
                date={date}
                handleConfirm={handleConfirm}
                rangeAge={rangeAge}
                setRangeAgePlanning={setRangeAgePlanning}
                descriptionPlanning={descriptionPlanning}
                setDescriptionPlanning={setDescriptionPlanning}
                handleRedirect={handleRedirect}
            />
            <SummativeAssessmentModalForm
                show={showSummativeAssessment}
                handleClose={handleCloseSummativeAssessment}
                submitting={submitting}
                setSubmitting={setSubmitting}
                submittingPreviousVariables={submittingPreviousVariables}
                setSubmittingPreviousVariables={setSubmittingPreviousVariables}
                alertVisible={alertVisible}
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertVisible={setAlertVisible}
                setAlertMessage={setAlertMessage}
                setAlertType={setAlertType}
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
                childs={childs}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
                name={name}
                setName={setName}
                age={age}
                setAge={setAge}
                outCome1={outCome1}
                setOutCome1={setOutCome1}
                outCome2={outCome2}
                setOutCome2={setOutCome2}
                outCome3={outCome3}
                setOutCome3={setOutCome3}
                outCome4={outCome4}
                setOutCome4={setOutCome4}
                outCome5={outCome5}
                setOutCome5={setOutCome5}
                handleRedirect={handleRedirect}
            />

            <br></br>
            <br></br>
            <CardModern
                fullAccess={fullAccess}
                handleCreateClick={handleCreateClick}
                handleHistoricalReportSubmission={handleHistoricalReportSubmission}
                handleShowTutorial={handleShowTutorial}
                handleShowGoal={handleShowGoal}
                handleShowObservations={handleShowObservations}
                handleShowFollowUp={handleShowFollowUp}
                handleShowSummativeAssessment={handleShowSummativeAssessment}
                handleShowFormReflection={handleShowFormReflection}
                handleShowFormWeeklyReflection={handleShowFormWeeklyReflection}
                handleShowFormWeeklyPlanning={handleShowFormWeeklyPlanning}
                handleSelectReportReflectionSubmission={handleSelectReportReflectionSubmission}
            />





        </div>

    );

};

export default Home;