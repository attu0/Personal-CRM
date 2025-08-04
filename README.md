# Personal CRM - Contact & Event Management System

A full-stack web application for managing personal contacts, events, and reminders with automated notifications and contact collection features.

## 🌟 Features

### Core Features
- **User Authentication**: 
  - Email/password registration and login
  - Google OAuth integration
  - JWT-based authentication
  - Session management

- **Personal Dashboard**: 
  - Comprehensive reminder management
  - Event tracking (birthdays, anniversaries, follow-ups, etc.)
  - Contact information management
  - Today's events overview

- **Contact Management**:
  - Store phone numbers, emails, WhatsApp contacts
  - International phone number support with country codes
  - Contact validation and formatting

- **Event Types Supported**:
  - Birthdays
  - Anniversaries
  - Follow-ups
  - Custom events

### Advanced Features
- **Contact Collection System**:
  - Generate shareable links for collecting contact information
  - Temporary share tokens for specific events
  - Permanent personal contact collection links
  - Automated contact form with validation

- **Communication Integration**:
  - Direct calling via phone links
  - WhatsApp messaging integration
  - Email composition with pre-filled templates
  - Smart contact detection and formatting

- **User Profile Management**:
  - Personal information (birthday, anniversary, spouse details)
  - Company information (name, incorporation date, office address)
  - Social media links (LinkedIn, Twitter, Instagram)
  - Permissions management

- **Modern UI/UX**:
  - Dark/light theme toggle
  - Responsive design with Bootstrap 5
  - Glass morphism design elements
  - Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **React Router DOM 7.7.1** - Client-side routing
- **Axios 1.11.0** - HTTP client for API requests
- **Bootstrap 5.3.7** - CSS framework for responsive design
- **Vite 7.0.4** - Fast build tool and development server
- **Bootstrap Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.19.2** - Web application framework
- **MongoDB** with **Mongoose 8.4.1** - Database and ODM
- **Passport.js** - Authentication middleware
  - Google OAuth 2.0 strategy
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcryptjs 3.0.2** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Session 1.18.2** - Session management
- **Node-cron 4.2.1** - Task scheduling (prepared for notifications)
- **Nodemailer 7.0.5** - Email service integration (prepared)

### Development Tools
- **Nodemon 3.1.2** - Development server auto-reload
- **ESLint** - Code linting
- **dotenv 16.4.5** - Environment variable management

## 📁 Project Structure

```
Personal-CRM/
│
├── backend/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── passport.js        # Passport configuration
│   ├── controllers/
│   │   ├── reminderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/
│   │   ├── reminderModel.js   # Reminder/Event data model
│   │   └── userModel.js       # User data model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── reminderRoutes.js  # CRUD operations for reminders
│   │   ├── shareRoutes.js     # Contact sharing functionality
│   │   └── userRoutes.js      # User management routes
│   ├── utils/
│   │   ├── emailService.js    # Email utilities (prepared)
│   │   ├── generateToken.js   # JWT token generation
│   │   └── notificationScheduler.js # Notification scheduling (prepared)
│   ├── package.json
│   └── server.js              # Application entry point
│
├── frontend/
│   ├── src/
│   │   ├── AuthPage/
│   │   │   ├── AuthPage.jsx           # Login/Register page
│   │   │   └── GoogleAuthCallback.jsx # Google OAuth callback
│   │   ├── ContactCollection/
│   │   │   ├── ContactCollectionPage.jsx  # Event-specific contact collection
│   │   │   └── PersonalContactPage.jsx    # Personal contact collection
│   │   ├── Hero/
│   │   │   └── Hero.jsx               # Landing page hero section
│   │   ├── MainPage/
│   │   │   ├── InfoCard.jsx           # Dashboard info cards
│   │   │   └── MainPage.jsx           # Main dashboard
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx             # Navigation component
│   │   ├── Notifications/
│   │   │   ├── NotificationDashboard.jsx
│   │   │   ├── NotificationSettings.jsx
│   │   │   └── NotificationStyles.css
│   │   ├── Permissions/
│   │   │   └── PermissionsPage.jsx    # User permissions management
│   │   ├── ProfilePage/
│   │   │   └── ProfilePage.jsx        # User profile management
│   │   ├── TodaysEvents/
│   │   │   └── TodaysEvents.jsx       # Today's events overview
│   │   ├── App.jsx                    # Main application component
│   │   ├── App.css                    # Application styles
│   │   └── main.jsx                   # Application entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── react-pwa-app/             # Additional React PWA setup
├── sample-data.js             # Sample data for testing
├── start.bat                  # Windows batch file to start both servers
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/attu0/Personal-CRM.git
   cd Personal-CRM
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Application**
   
   **Option 1: Using the batch file (Windows)**
   ```bash
   # From the root directory
   start.bat
   ```
   
   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

## 📱 Usage

### Basic Workflow

1. **Registration/Login**
   - Sign up with email/password or Google OAuth
   - Complete profile setup

2. **Dashboard Management**
   - Add reminders for important events
   - Include contact information (phone, email, WhatsApp)
   - Set event types and dates

3. **Contact Collection**
   - Generate shareable links for collecting contact information
   - Share event-specific or personal contact collection links
   - Automatic contact information storage

4. **Communication**
   - Use "Today's Events" to see current reminders
   - Direct call, WhatsApp, or email contacts
   - Pre-filled message templates

### Key Features Usage

- **Theme Toggle**: Use the theme button in the navbar to switch between light and dark modes
- **Contact Actions**: Click call, WhatsApp, or email buttons on event cards for direct communication
- **Share Links**: Generate and share contact collection links from the dashboard
- **Profile Management**: Update personal and company information in the profile section

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Reminders
- `GET /api/reminders` - Get all user reminders
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

### Contact Sharing
- `POST /api/share/generate-link/:reminderId` - Generate event-specific share link
- `POST /api/share/generate-personal-link` - Generate personal contact link
- `POST /api/share/submit-contact/:token` - Submit contact information
- `GET /api/share/personal-details/:token` - Get user details for contact page

## 🎨 Design Features

- **Glass Morphism**: Modern translucent design elements
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark/Light Themes**: User-selectable theme preferences
- **Bootstrap Icons**: Consistent iconography throughout the application
- **Smooth Animations**: CSS transitions and hover effects
- **Professional Typography**: Clean, readable font choices

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Client and server-side validation
- **Secure Sessions**: Express session management

## 🚧 Future Enhancements

- **Email Notifications**: Automated reminder emails
- **SMS Integration**: Text message notifications
- **Calendar Sync**: Google Calendar integration
- **Contact Import**: Bulk contact import from various sources
- **Advanced Analytics**: Contact interaction analytics
- **Mobile App**: React Native mobile application
- **Push Notifications**: Browser push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Attu0** - [GitHub](https://github.com/attu0)

## 🙏 Acknowledgments

- React and Node.js communities for excellent documentation
- Bootstrap team for the responsive framework
- Google for OAuth integration capabilities
- MongoDB for flexible data storage solutions

---

**Live URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

For any questions or support, please open an issue on the GitHub repository.
