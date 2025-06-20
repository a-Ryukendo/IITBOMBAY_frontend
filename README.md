# IITBOMBAY Courses API - Frontend

A modern React TypeScript frontend for managing IITBOMBAY courses and course delivery instances. This application provides a comprehensive user interface for creating, viewing, and managing courses with prerequisite relationships and course delivery scheduling.

## 🚀 Features

### Course Management
- **Create Courses**: Add new courses with comprehensive details including prerequisites
- **List Courses**: View all courses in a responsive grid layout with search and filtering
- **Delete Courses**: Remove courses with dependency validation (prevents deletion if course is a prerequisite for others)
- **Prerequisites Management**: Multi-select dropdown for choosing prerequisite courses
- **Search & Filter**: Search by course name, code, or instructor; filter by department and semester
- **Dependency Warnings**: Clear warnings when courses cannot be deleted due to dependencies

### Course Delivery Instances
- **Create Instances**: Schedule course deliveries for specific years and semesters
- **List Instances**: View course instances filtered by year and semester
- **Delete Instances**: Remove course delivery instances with confirmation
- **Instance Details**: View detailed information about each course instance including prerequisites

### User Interface
- **Modern Design**: Clean, responsive interface with modern UI components
- **Error Handling**: Comprehensive error messages and validation feedback
- **Loading States**: Visual feedback during API operations
- **Mobile Responsive**: Optimized for desktop and mobile devices
- **Modal Forms**: Clean modal interface for creating courses and instances

## 🛠️ Technology Stack

- **React 19.1.0**: Modern React with hooks and functional components
- **TypeScript 4.9.5**: Type-safe development
- **Axios 1.10.0**: HTTP client for API communication
- **React Router DOM 7.6.2**: Client-side routing
- **CSS3**: Custom styling with responsive design

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:8080` (see backend README)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd IITBOMBAY-Courses-API/frontend
npm install
```

### 2. Start the Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CourseForm.tsx   # Course creation form with prerequisites
│   ├── CourseForm.css   # Course form styles
│   ├── CourseList.tsx   # Course listing with search/filter
│   ├── CourseList.css   # Course list styles
│   ├── InstanceForm.tsx # Course instance creation form
│   ├── InstanceForm.css # Instance form styles
│   ├── InstanceList.tsx # Course instance listing
│   └── InstanceList.css # Instance list styles
├── services/            # API services
│   └── api.ts          # HTTP client and API calls
├── types/              # TypeScript type definitions
│   └── Course.ts       # Course and instance interfaces
├── App.tsx             # Main application component with routing
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### API Configuration

The frontend is configured to connect to the backend API at `http://localhost:8080`. To change this:

1. Open `src/services/api.ts`
2. Update the `API_BASE_URL` constant:

```typescript
const API_BASE_URL = 'http://your-backend-url:port/api';
```

### Environment Variables

Create a `.env` file in the frontend root directory for environment-specific configuration:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

## 📱 Usage Guide

### Creating a Course

1. Navigate to the **Courses** page
2. Click **"Create New Course"** button
3. Fill in all required fields:
   - **Course Code** (e.g., CS101)
   - **Course Name** (e.g., Introduction to Computer Science)
   - **Department** (e.g., Computer Science)
   - **Instructor** (e.g., Dr. John Doe)
   - **Credits** (1-10)
   - **Semester** (Fall, Spring, Summer, Winter)
4. Optionally add:
   - **Course Type** (Core, Elective, Lab, Project, Seminar)
   - **Maximum Students**
   - **Description**
   - **Prerequisites** (select from existing courses using Ctrl/Cmd + click)
5. Click **"Create Course"**

### Managing Course Instances

1. Navigate to the **Instances** page
2. Select **Year** and **Semester** to view existing instances
3. To create a new instance:
   - Click **"Create New Instance"**
   - Select the course from the dropdown
   - Choose year and semester
   - Click **"Create Instance"**

### Deleting Courses/Instances

- **Courses**: Click the delete button (🗑️) on any course card
- **Instances**: Click the delete button on any instance card
- **Dependency Warnings**: If a course cannot be deleted due to being a prerequisite, a warning will be displayed

### Searching and Filtering

- **Search**: Use the search box to find courses by name, code, or instructor
- **Department Filter**: Filter courses by department
- **Semester Filter**: Filter courses by semester
- **Year/Semester Filter**: For instances, filter by academic year and semester

## 🔍 API Endpoints Used

The frontend consumes the following backend endpoints:

### Courses
- `GET /api/courses` - Get all courses with prerequisites
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/courses` - Create new course with prerequisite validation
- `DELETE /api/courses/{id}` - Delete course (returns 409 if dependencies exist)
- `GET /api/courses/search/name?keyword={keyword}` - Search courses by name
- `GET /api/courses/department/{department}` - Get courses by department
- `GET /api/courses/semester/{semester}` - Get courses by semester

### Course Delivery Instances
- `POST /api/instances` - Create new instance
- `GET /api/instances/{year}/{semester}` - Get instances by year/semester
- `GET /api/instances/{year}/{semester}/{courseId}` - Get specific instance
- `DELETE /api/instances/{year}/{semester}/{courseId}` - Delete instance

## 🎨 UI Components

### CourseForm Component
- Multi-select dropdown for prerequisites
- Form validation with error messages
- Responsive design with grid layout
- Loading states during submission

### CourseList Component
- Card-based layout for courses
- Search and filter functionality
- Delete confirmation with dependency warnings
- Prerequisites display

### InstanceForm Component
- Year and semester selection
- Course dropdown populated from API
- Validation for all fields
- Clean modal interface

### InstanceList Component
- Year/semester filtering
- Instance details with course information
- Delete functionality
- Prerequisites display for each instance

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the backend server is running on `http://localhost:8080`
   - Check if the backend API is accessible
   - Verify CORS configuration in backend

2. **CORS Issues**
   - The backend should have CORS configured to allow requests from `http://localhost:3000`
   - Check browser console for CORS errors

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript compilation: `npm run build`
   - Verify Node.js version compatibility

4. **Prerequisites Not Loading**
   - Check if courses exist in the backend
   - Verify API endpoint is working
   - Check browser network tab for API errors

### Development Tips

- Use browser developer tools to inspect network requests
- Check the browser console for JavaScript errors
- Verify API responses in the Network tab
- Use React Developer Tools for component debugging

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🔧 Development

### Adding New Features

1. **New Components**: Create in `src/components/` directory
2. **API Integration**: Add methods to `src/services/api.ts`
3. **Types**: Update `src/types/Course.ts` for new interfaces
4. **Styling**: Create corresponding CSS files

### Code Style

- Use TypeScript for type safety
- Follow React functional component patterns
- Use hooks for state management
- Implement proper error handling
- Add loading states for better UX

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Serve Production Build

```bash
npx serve -s build
```

### Environment Configuration

For production deployment:

1. Update API base URL in `src/services/api.ts`
2. Set environment variables
3. Configure CORS in backend for production domain
4. Build and deploy to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure code follows project style
6. Submit a pull request

## 📄 License

This project is part of the IITBOMBAY Courses API system.

## 🔗 Related

- [Backend Documentation](../backend/README.md)
- [API Documentation](../backend/README.md#api-endpoints)
- [Project Overview](../README.md)

## 🔄 Version Control & .gitignore

- **Do NOT commit `node_modules/`, `build/`, or `.env` files** to GitHub.
- Use a `.gitignore` file to exclude:
  - `node_modules/`
  - `build/`
  - `.env`
  - IDE/system files (e.g., `.idea/`, `.vscode/`, `.DS_Store`)

Example `.gitignore`:
```
node_modules/
build/
.env
.idea/
.vscode/
.DS_Store
```

## 🔄 API Payload Note

When creating a course instance, the payload sent to the backend should be:
```json
{
  "year": 2024,
  "semester": 1,
  "course": { "id": 1 }
}
```
