import React from "react";
import { Routes, Route } from "react-router-dom";
import LogScreen from "./components/loginScreen";
import RoleSelector from "./components/roleSelectScreen";
import StudentHomeScreen from "./components/studentHomeScreen";
import EmployerHomeScreen from "./components/employerHomeScreen";
import JobSearchScreen from "./components/jobSearchScreen";
import ApplicationStatusScreen from "./components/applicationStatusScreen";
import EnrolledJobsScreen from "./components/enrolledJobsScreen";
import PostedJobsScreen from "./components/postedJobsScreen";
import ApplicationsReceivedScreen from "./components/applicationsReceivedScreen";
import ApplicantsListComponent from "./components/viewApplicants";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelector />} />
      <Route path="/login" element={<LogScreen />} />
      <Route path="/studentHome" element={<StudentHomeScreen />} />
      <Route path="/employerHome" element={<EmployerHomeScreen />} />
      <Route path="/jobsSearch" element={<JobSearchScreen />} />
      <Route path="/application-status" element={<ApplicationStatusScreen />} />
      <Route path="/enrolled-jobs" element={<EnrolledJobsScreen />} />
      <Route path="/posted-jobs" element={<PostedJobsScreen />} />
      <Route path="/applicants/:jobId" element={<ApplicantsListComponent />} />
      <Route
        path="/applications-received"
        element={<ApplicationsReceivedScreen />}
      />
    </Routes>
  );
}

export default AppRoutes;
