export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  instructor: string;
  credits: number;
  semester: number;
  description?: string;
  maxStudents?: number;
  enrolledStudents: number;
  prerequisites: Course[];
  courseType?: string;
}

export interface CourseDelivery {
  id: number;
  year: number;
  semester: number;
  course: Course;
}

export interface CreateCourseRequest {
  courseCode: string;
  courseName: string;
  department: string;
  instructor: string;
  credits: number;
  semester: number;
  description?: string;
  maxStudents?: number;
  courseType?: string;
  prerequisiteIds?: number[];
}

export interface CreateInstanceRequest {
  year: number;
  semester: number;
  course: { id: number };
} 