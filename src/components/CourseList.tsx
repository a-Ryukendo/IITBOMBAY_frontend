import React, { useState, useEffect } from 'react';
import { Course } from '../types/Course';
import { courseApi } from '../services/api';
import './CourseList.css';

interface CourseListProps {
  onEditCourse?: (course: Course) => void;
  onViewCourse?: (course: Course) => void;
  refreshTrigger?: number;
}

const CourseList: React.FC<CourseListProps> = ({ onEditCourse, onViewCourse, refreshTrigger }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [refreshTrigger]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseApi.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    setDeletingCourseId(courseId);
    setDeleteError(null);

    try {
      await courseApi.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (err: any) {
      console.error('Error deleting course:', err);
      if (err.response?.status === 409) {
        setDeleteError('Cannot delete course. It is a prerequisite for other courses.');
      } else {
        setDeleteError('Failed to delete course. Please try again.');
      }
    } finally {
      setDeletingCourseId(null);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || course.department === filterDepartment;
    const semesterFilterNumber = filterSemester ? Number(filterSemester) : null;
    const matchesSemester = semesterFilterNumber === null || course.semester === semesterFilterNumber;
    return matchesSearch && matchesDepartment && matchesSemester;
  });

  const departments = [...new Set(courses.map(course => course.department))];
  const semesters = [...new Set(courses.map(course => course.semester))];

  const formatPrerequisites = (prerequisites?: Course[]) => {
    if (!prerequisites || prerequisites.length === 0) return 'None';
    return prerequisites.map(prereq => prereq.courseCode).join(', ');
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h2>Course Catalog</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="filter-select"
          >
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(sem => (
              <option key={sem} value={sem}>{`Semester ${sem}`}</option>
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

      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          {courses.length === 0 ? 'No courses available.' : 'No courses match your filters.'}
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3 className="course-code">{course.courseCode}</h3>
                <div className="course-actions">
                  {onViewCourse && (
                    <button
                      onClick={() => onViewCourse(course)}
                      className="btn-view"
                      title="View Details"
                    >
                      👁️
                    </button>
                  )}
                  {onEditCourse && (
                    <button
                      onClick={() => onEditCourse(course)}
                      className="btn-edit"
                      title="Edit Course"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="btn-delete"
                    title="Delete Course"
                    disabled={deletingCourseId === course.id}
                  >
                    {deletingCourseId === course.id ? '🗑️...' : '🗑️'}
                  </button>
                </div>
              </div>
              
              <h4 className="course-name">{course.courseName}</h4>
              
              <div className="course-details">
                <div className="detail-item">
                  <span className="label">Department:</span>
                  <span className="value">{course.department}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Instructor:</span>
                  <span className="value">{course.instructor}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Credits:</span>
                  <span className="value">{course.credits}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Semester:</span>
                  <span className="value">{course.semester}</span>
                </div>
                {course.courseType && (
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">{course.courseType}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Enrolled:</span>
                  <span className="value">
                    {course.enrolledStudents}
                    {course.maxStudents && ` / ${course.maxStudents}`}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="label">Prerequisites:</span>
                  <span className="value prerequisites">
                    {formatPrerequisites(course.prerequisites)}
                  </span>
                </div>
                {course.description && (
                  <div className="detail-item full-width">
                    <span className="label">Description:</span>
                    <span className="value description">{course.description}</span>
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

export default CourseList; 