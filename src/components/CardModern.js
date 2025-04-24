import React from 'react';
import { Link } from 'react-router-dom';

const CardModern = ({
    fullAccess,
    handleCreateClick,
    handleHistoricalReportSubmission,
    handleShowTutorial,
    handleShowGoal,
    handleShowObservations,
    handleShowFollowUp,
    handleShowSummativeAssessment,
    handleShowFormReflection,
    handleShowFormWeeklyReflection,
    handleShowFormWeeklyPlanning,
    handleSelectReportReflectionSubmission
}) => {
    return (
        <div className="cardModern">
            <div className="item item--3">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--3">Daily Journal</span>
                <div className="body-card">
                    <span className="text text--1">Description of the activities carried out during the day.</span>
                    <br></br>
                </div>
                <div className="footer-card">
                    <button className="buttonCard3" onClick={handleCreateClick}><span>Create </span></button>
                    <button className="buttonCard3" onClick={() => handleHistoricalReportSubmission('daily_report')}><span>Historical</span></button>
                    <button className="buttonCard3" onClick={() => handleShowTutorial("https://www.youtube.com/embed/7NAye9JbfJE?si=bPi-l7aYMjrf0uSN")} variant="info"><span>Tutorial </span></button>
                </div>
            </div>

            <div className="item item--3">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--3">Goal</span>
                <div className="body-card">
                    <span className="text text--1">Identifying the areas of development that need focus and setting precise goals.</span>
                    <br></br>
                </div>
                <div className="footer-card">
                    <button className={`buttonCard3`} onClick={handleShowGoal}><span>Create </span></button>
                    <button className={`buttonCard3 `} onClick={() => handleHistoricalReportSubmission('goal_report')}><span>Historical</span></button>
                    <button className={`buttonCard3 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/vBXdNYX_mJ8?si=n_qAFdWSryGlJyB4")} variant="info"><span>Tutorial </span></button>
                </div>
            </div>

            <div className="item item--3">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--3">Ask me anything (Chat)</span>
                <div className="body-card">
                    <span className="text text--1">Have a concern? Get the information you require by starting a discussion.</span>
                    <br></br>
                </div>
                <div className="footer-card">
                    <Link to="/chat">
                        <button className={`buttonCard3 ${!fullAccess ? "link-disabled" : ""}`} ><span>Ask me anything (Chat)</span></button>
                    </Link>
                </div>
            </div>

            <div className="item item--1">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--1">Observations</span>
                <div className="body-card">
                    <span className="text text--1">Analysis of skills based on activity descriptions.</span>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
                <div className="footer-card">
                    <button className={`buttonCard2 `} onClick={handleShowObservations} ><span>Create </span></button>
                    <button className={`buttonCard2 `} onClick={() => handleHistoricalReportSubmission('descriptions_report')}><span>Historical</span></button>
                    <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/Ws2e4MohNzE?si=rfaMffp628OLDuv1")} variant="info"><span>Tutorial </span></button>
                </div>
            </div>

            <div className="item item--1">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--1">Follow up</span>
                <div className="body-card">
                    <span className="text text--1">Analysis of skills based on activity descriptions.</span>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
                <div className="footer-card">
                    <button className={`buttonCard2 `} onClick={handleShowFollowUp}><span>Create </span></button>
                    <button className={`buttonCard2`} onClick={() => handleHistoricalReportSubmission('follow_up')}><span>Historical</span></button>
                    <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/o_0ADz4yP28?si=y6IYQRhxs8-kKsv6")} variant="info"><span>Tutorial </span></button>
                </div>
            </div>

            <div className="item item--1">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--1">Summative Assessment</span>
                <div className="body-card">
                    <span className="text text--1">A measurement of a child's development and achievement in reference to predetermined learning standards.</span>
                </div>
                <div className="footer-card">
                    <button className={`buttonCard2 `} onClick={handleShowSummativeAssessment}><span>Create </span></button>
                    <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleHistoricalReportSubmission('summative_assessment')}><span>Historical</span></button>
                    <button className={`buttonCard2 ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/FofvjvST65I?si=Y89Oz6CFQuXX3Wy7")}><span>Tutorial </span></button>
                </div>
            </div>

            <div className="item item--2">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--2">Daily reflection</span>
                <div className="body-card">
                    <span className="text text--1">Assessing how well the kids are learning and identifying what needs extra support.</span>
                    <br></br>
                </div>
                <div className="footer-card">
                    <button className={`buttonCard `} onClick={handleShowFormReflection}><span>Create </span></button>
                    <button className={`buttonCard`} onClick={() => handleHistoricalReportSubmission('critical_reflection')}><span>Historical</span></button>
                    <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/zad3bDnjsII?si=xz8vXrZzwduvxFlR")} variant="info"><span>Tutorial </span></button>
                </div>
            </div>

            <div className="item item--2">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--2">Weekly critical reflection</span>
                <div className="body-card">
                    <span className="text text--1">Planning age-appropriate activities that assist children's development requires structure and consistency.</span>
                </div>
                <div className="footer-card">
                    <button className={`buttonCard `} onClick={handleShowFormWeeklyReflection}><span>Create </span></button>
                    <button className={`buttonCard `} onClick={() => handleSelectReportReflectionSubmission('critical_reflection')}><span>By days</span></button>
                    <button className={`buttonCard`} onClick={() => handleHistoricalReportSubmission('weekly_reflection')}><span>Historical</span></button>
                    <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/zad3bDnjsII?si=xz8vXrZzwduvxFlR")} variant="info"><span>Tutorial </span></button>
                </div>
            </div>

            <div className="item item--2">
                <svg> {/* Tu SVG aquí */} </svg>
                <span className="text title--2">Weekly Planning</span>
                <div className="body-card">
                    <span className="text text--1">Activities for weekly planning are created by aim.</span>
                    <br></br>
                </div>
                <div className="footer-card">
                    <button className={`buttonCard `} onClick={handleShowFormWeeklyPlanning}><span>Create </span></button>
                    <button className={`buttonCard`} onClick={() => handleHistoricalReportSubmission('weeklyn_planning')}><span>Historical</span></button>
                    <button className={`buttonCard ${!fullAccess ? "link-disabled" : ""}`} onClick={() => handleShowTutorial("https://www.youtube.com/embed/-dkItdfDZho?si=ji4wWK_wdGzMmCK5")} variant="info"><span>Tutorial </span></button>
                </div>
            </div>
        </div>
    );
};

export default CardModern; 