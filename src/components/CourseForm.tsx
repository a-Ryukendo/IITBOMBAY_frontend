import React, { useState, useEffect } from 'react';
import { Course, CreateCourseRequest } from '../types/Course';
import { courseApi } from '../services/api';
import './CourseForm.css';

interface CourseFormProps {
  onSubmit: (course: CreateCourseRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateCourseRequest>({
    courseCode: '',
    courseName: '',
    department: '',
    instructor: '',
    credits: 0,
    semester: 1,
    description: '',
    maxStudents: undefined,
    courseType: 'CORE',
    prerequisiteIds: [],
  });

  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAvailableCourses();
  }, []);

  const loadAvailableCourses = async () => {
    try {
      const courses = await courseApi.getAllCourses();
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor is required';
    }
    if (!formData.credits || formData.credits <= 0) {
      newErrors.credits = 'Credits must be greater than 0';
    }
    if (!formData.semester || formData.semester < 1) {
      newErrors.semester = 'Semester is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'maxStudents' || name === 'semester' ? (value ? parseInt(value) : undefined) : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrerequisiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      prerequisiteIds: selectedOptions,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="course-form-container">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="courseCode">Course Code *</label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleInputChange}
              className={errors.courseCode ? 'error' : ''}
              placeholder="e.g., CS101"
            />
            {errors.courseCode && <span className="error-message">{errors.courseCode}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="courseName">Course Name *</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              className={errors.courseName ? 'error' : ''}
              placeholder="e.g., Introduction to Computer Science"
            />
            {errors.courseName && <span className="error-message">{errors.courseName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className={errors.department ? 'error' : ''}
              placeholder="e.g., Computer Science"
            />
            {errors.department && <span className="error-message">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="instructor">Instructor *</label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              className={errors.instructor ? 'error' : ''}
              placeholder="e.g., Dr. John Doe"
            />
            {errors.instructor && <span className="error-message">{errors.instructor}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="credits">Credits *</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits || ''}
              onChange={handleInputChange}
              className={errors.credits ? 'error' : ''}
              min="1"
              max="10"
            />
            {errors.credits && <span className="error-message">{errors.credits}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="semester">Semester *</label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className={errors.semester ? 'error' : ''}
            >
              <option value={0}>Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{`Semester ${num}`}</option>
              ))}
            </select>
            {errors.semester && <span className="error-message">{errors.semester}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="courseType">Course Type</label>
            <select
              id="courseType"
              name="courseType"
              value={formData.courseType}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
              <option value="Lab">Lab</option>
              <option value="Project">Project</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maxStudents">Max Students</label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              value={formData.maxStudents || ''}
              onChange={handleInputChange}
              min="1"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Course description..."
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="prerequisites">Prerequisites</label>
          <select
            id="prerequisites"
            name="prerequisites"
            multiple
            value={formData.prerequisiteIds?.map(id => id.toString()) || []}
            onChange={handlePrerequisiteChange}
            size={5}
          >
            {availableCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
          <small>Hold Ctrl (or Cmd on Mac) to select multiple courses</small>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm; 
