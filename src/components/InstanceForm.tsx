import React, { useState, useEffect } from 'react';
import { Course, CreateInstanceRequest } from '../types/Course';
import { courseApi } from '../services/api';
import './InstanceForm.css';

interface InstanceFormProps {
  onSubmit: (instance: CreateInstanceRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const InstanceForm: React.FC<InstanceFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateInstanceRequest>({
    year: new Date().getFullYear(),
    semester: 1,
    course: { id: 0 },
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

    if (!formData.year || formData.year < 2020 || formData.year > 2030) {
      newErrors.year = 'Year must be between 2020 and 2030';
    }
    if (!formData.semester || formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = 'Semester must be between 1 and 8';
    }
    if (!formData.course || !formData.course.id) {
      newErrors.course = 'Please select a course';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'course') {
      setFormData(prev => ({
        ...prev,
        course: { id: parseInt(value) },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' || name === 'semester' ? parseInt(value) : value,
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="instance-form-container">
      <h2>Create Course Instance</h2>
      <form onSubmit={handleSubmit} className="instance-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={errors.year ? 'error' : ''}
              min="2020"
              max="2030"
            />
            {errors.year && <span className="error-message">{errors.year}</span>}
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
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{`Semester ${num}`}</option>
              ))}
            </select>
            {errors.semester && <span className="error-message">{errors.semester}</span>}
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="course">Course *</label>
          <select
            id="course"
            name="course"
            value={formData.course?.id || ''}
            onChange={handleInputChange}
            className={errors.course ? 'error' : ''}
          >
            <option value="">Select a Course</option>
            {availableCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.courseName} ({course.department})
              </option>
            ))}
          </select>
          {errors.course && <span className="error-message">{errors.course}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Instance'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstanceForm; 