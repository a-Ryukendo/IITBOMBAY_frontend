import axios from 'axios';
import { Course, CourseDelivery, CreateCourseRequest, CreateInstanceRequest } from '../types/Course';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Course API calls
export const courseApi = {
  // Get all courses
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data as Course[];
  },

  // Get course by ID
  getCourseById: async (id: number): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data as Course;
  },

  // Create new course
  createCourse: async (courseData: CreateCourseRequest): Promise<Course> => {
    const response = await api.post('/courses', courseData);
    return response.data as Course;
  },

  // Delete course
  deleteCourse: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Search courses by name
  searchCoursesByName: async (keyword: string): Promise<Course[]> => {
    const response = await api.get(`/courses/search/name?keyword=${encodeURIComponent(keyword)}`);
    return response.data as Course[];
  },

  // Get courses by department
  getCoursesByDepartment: async (department: string): Promise<Course[]> => {
    const response = await api.get(`/courses/department/${encodeURIComponent(department)}`);
    return response.data as Course[];
  },

  // Get courses by semester
  getCoursesBySemester: async (semester: string): Promise<Course[]> => {
    const response = await api.get(`/courses/semester/${encodeURIComponent(semester)}`);
    return response.data as Course[];
  },
};

// Course Delivery API calls
export const courseDeliveryApi = {
  // Create new instance
  createInstance: async (instanceData: CreateInstanceRequest): Promise<CourseDelivery> => {
    // Ensure payload is { year, semester, course: { id } }
    const payload = {
      year: instanceData.year,
      semester: instanceData.semester,
      course: { id: instanceData.course.id },
    };
    const response = await api.post('/instances', payload);
    return response.data as CourseDelivery;
  },

  // Get instances by year and semester
  getInstancesByYearAndSemester: async (year: number, semester: number): Promise<CourseDelivery[]> => {
    const response = await api.get(`/instances/year/${year}/semester/${semester}`);
    return response.data as CourseDelivery[];
  },

  // Get specific instance
  getInstance: async (year: number, semester: number, courseId: number): Promise<CourseDelivery> => {
    const response = await api.get(`/instances/${year}/${semester}/${courseId}`);
    return response.data as CourseDelivery;
  },

  // Delete instance
  deleteInstance: async (year: number, semester: number, courseId: number): Promise<void> => {
    await api.delete(`/instances/${year}/${semester}/${courseId}`);
  },
};

export default api; 