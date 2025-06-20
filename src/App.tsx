import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import InstanceList from './components/InstanceList';
import InstanceForm from './components/InstanceForm';
import { CreateCourseRequest, CreateInstanceRequest } from './types/Course';
import { courseApi, courseDeliveryApi } from './services/api';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);

  const handleCreateCourse = async (courseData: CreateCourseRequest) => {
    try {
      setIsCreatingCourse(true);
      await courseApi.createCourse(courseData);
      setRefreshTrigger(prev => prev + 1);
      setIsCreatingCourse(false);
      setIsCourseModalOpen(false);
      // You could add navigation here to go back to course list
    } catch (error) {
      console.error('Error creating course:', error);
      setIsCreatingCourse(false);
      alert('Failed to create course. Please try again.');
    }
  };

  const handleCreateInstance = async (instanceData: CreateInstanceRequest) => {
    try {
      setIsCreatingInstance(true);
      await courseDeliveryApi.createInstance(instanceData);
      setRefreshTrigger(prev => prev + 1);
      setIsCreatingInstance(false);
      setIsInstanceModalOpen(false);
      // You could add navigation here to go back to instance list
    } catch (error) {
      console.error('Error creating instance:', error);
      setIsCreatingInstance(false);
      alert('Failed to create instance. Please try again.');
    }
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">IITBOMBAY Courses API</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Courses</Link>
              <Link to="/instances" className="nav-link">Instances</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div>
                <div className="page-header">
                  <h2>Course Management</h2>
                  <button 
                    className="btn-primary"
                    onClick={() => setIsCourseModalOpen(true)}
                  >
                    Create New Course
                  </button>
                </div>
                
                {isCourseModalOpen && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <CourseForm
                        onSubmit={handleCreateCourse}
                        onCancel={() => setIsCourseModalOpen(false)}
                        isLoading={isCreatingCourse}
                      />
                    </div>
                  </div>
                )}
                
                <CourseList refreshTrigger={refreshTrigger} />
              </div>
            } />
            
            <Route path="/instances" element={
              <div>
                <div className="page-header">
                  <h2>Course Instance Management</h2>
                  <button 
                    className="btn-primary"
                    onClick={() => setIsInstanceModalOpen(true)}
                  >
                    Create New Instance
                  </button>
                </div>
                
                {isInstanceModalOpen && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <InstanceForm
                        onSubmit={handleCreateInstance}
                        onCancel={() => setIsInstanceModalOpen(false)}
                        isLoading={isCreatingInstance}
                      />
                    </div>
                  </div>
                )}
                
                <InstanceList refreshTrigger={refreshTrigger} />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
