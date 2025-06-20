import React, { useState, useEffect } from 'react';
import { CourseDelivery } from '../types/Course';
import { courseDeliveryApi } from '../services/api';
import './InstanceList.css';

interface InstanceListProps {
  onViewInstance?: (instance: CourseDelivery) => void;
  refreshTrigger?: number;
}

const InstanceList: React.FC<InstanceListProps> = ({ onViewInstance, refreshTrigger }) => {
  const [instances, setInstances] = useState<CourseDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [deletingInstanceId, setDeletingInstanceId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    loadInstances();
  }, [selectedYear, selectedSemester, refreshTrigger]);

  const loadInstances = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseDeliveryApi.getInstancesByYearAndSemester(selectedYear, selectedSemester);
      setInstances(data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setInstances([]);
        setError(null); // No error, just no data
      } else {
        setError('Failed to load instances');
        console.error('Error loading instances:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstance = async (instance: CourseDelivery) => {
    if (!window.confirm(`Are you sure you want to delete this instance of ${instance.course.courseCode}?`)) {
      return;
    }

    setDeletingInstanceId(instance.id);
    setDeleteError(null);

    try {
      await courseDeliveryApi.deleteInstance(instance.year, instance.semester, instance.course.id);
      setInstances(prev => prev.filter(inst => inst.id !== instance.id));
    } catch (err: any) {
      console.error('Error deleting instance:', err);
      setDeleteError('Failed to delete instance. Please try again.');
    } finally {
      setDeletingInstanceId(null);
    }
  };

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  if (loading) {
    return <div className="loading">Loading instances...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="instance-list-container">
      <div className="instance-list-header">
        <h2>Course Instances</h2>
        <div className="filters">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="filter-select"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
            className="filter-select"
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{`Semester ${num}`}</option>
            ))}
          </select>
        </div>
      </div>

      {deleteError && (
        <div className="delete-error">
          {deleteError}
          <button onClick={() => setDeleteError(null)} className="close-error">×</button>
        </div>
      )}

      {instances.length === 0 ? (
        <div className="no-instances">
          No course instances found for {selectedYear} Semester {selectedSemester}.
        </div>
      ) : (
        <div className="instances-grid">
          {instances.map(instance => (
            <div key={instance.id} className="instance-card">
              <div className="instance-header">
                <h3 className="instance-course-code">{instance.course.courseCode}</h3>
                <div className="instance-actions">
                  {onViewInstance && (
                    <button
                      onClick={() => onViewInstance(instance)}
                      className="btn-view"
                      title="View Details"
                    >
                      👁️
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteInstance(instance)}
                    className="btn-delete"
                    title="Delete Instance"
                    disabled={deletingInstanceId === instance.id}
                  >
                    {deletingInstanceId === instance.id ? '🗑️...' : '🗑️'}
                  </button>
                </div>
              </div>
              
              <h4 className="instance-course-name">{instance.course.courseName}</h4>
              
              <div className="instance-details">
                <div className="detail-item">
                  <span className="label">Year:</span>
                  <span className="value">{instance.year}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Semester:</span>
                  <span className="value">{instance.semester}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Department:</span>
                  <span className="value">{instance.course.department}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Instructor:</span>
                  <span className="value">{instance.course.instructor}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Credits:</span>
                  <span className="value">{instance.course.credits}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <span className="value">{instance.course.courseType || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Enrolled:</span>
                  <span className="value">
                    {instance.course.enrolledStudents}
                    {instance.course.maxStudents && ` / ${instance.course.maxStudents}`}
                  </span>
                </div>
                {instance.course.prerequisites && instance.course.prerequisites.length > 0 && (
                  <div className="detail-item full-width">
                    <span className="label">Prerequisites:</span>
                    <span className="value prerequisites">
                      {instance.course.prerequisites.map(prereq => prereq.courseCode).join(', ')}
                    </span>
                  </div>
                )}
                {instance.course.description && (
                  <div className="detail-item full-width">
                    <span className="label">Description:</span>
                    <span className="value description">{instance.course.description}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstanceList; 