# Cultural Inclusion Data Management Tool

## 🎯 Mission
**InclusiTrack** - A comprehensive data management and analysis tool for HEVA to support cultural inclusion initiatives and strategic decision-making.

## 📋 Problem Statement
Social-cultural vulnerability affects various groups including:
- **Poverty & Low Financial Literacy** - Barriers to economic inclusion
- **Refugees & Displaced Persons** - Limited access to resources
- **LGBTQ+ Community** - Social and economic discrimination
- **Persons with Disabilities** - Accessibility and inclusion challenges
- **Creative Artists** - High-risk perception, lack of collateral
- **Device & Internet Access Issues** - Digital divide
- **Diverse Business Models** - Non-traditional financial needs

## 🚀 Solution
Develop a data management tool that allows HEVA to:
- **Store data** from various sources and activities
- **Analyze trends** to support strategic decisions
- **Track vulnerable groups** for targeted interventions
- **Monitor fund allocation** and impact
- **Generate insights** for funding pitches and strategy meetings

## ✨ Features

### 🔐 User Management
- Role-based access control (Admin, Data Entry Officers)
- Secure authentication system
- Audit logging for data integrity

### 📝 Data Entry & Management
- **Beneficiary Registration** - Comprehensive profiles with vulnerability factors
- **Survey Data Collection** - Customizable surveys for different target groups
- **Fund Allocation Tracking** - Monitor financial inclusion initiatives
- **CSV Import/Export** - Bulk data operations

### 📊 Analytics Dashboard
- **Real-time Metrics** - Total beneficiaries, active programs, impact scores
- **Vulnerable Groups Analysis** - Distribution and success rates by group
- **Financial Inclusion Tracking** - Bank accounts, mobile money, insurance coverage
- **Device Access Monitoring** - Digital inclusion metrics
- **Priority Areas** - Intervention tracking and completion rates

### 🔍 Smart Filtering & Search
- Filter by date, region, vulnerability group, literacy level
- Advanced search capabilities
- Geographic data visualization

### 📤 Reporting System
- **Export Reports** - CSV/PDF summaries for stakeholders
- **Impact Reports** - Success metrics and outcomes
- **Funding Reports** - Allocation and utilization tracking

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Chart.js** - Data visualization
- **CSS3** - Responsive, accessible design
- **Vite** - Fast development build tool

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Flexible document database
- **Mongoose** - Object modeling
- **JWT** - Authentication
- **bcrypt** - Password security

### Development Tools
- **ESLint** - Code quality
- **Git** - Version control
- **Nodemon** - Development server

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Powerlearnproject/Cultural-Inclusion.git
cd Cultural-Inclusion
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Create .env file in backend directory
cd ../backend
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cultural-inclusion
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. **Start the application**
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend (from frontend directory, in new terminal)
cd ../frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
Cultural-Inclusion/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── beneficiaryController.js
│   │   ├── surveyController.js
│   │   └── fundController.js
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   ├── Beneficiary.js
│   │   ├── Survey.js
│   │   ├── Fund.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── beneficiaryRoutes.js
│   │   ├── surveyRoutes.js
│   │   └── fundRoutes.js
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ChartCard.jsx
│   │   ├── Pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DataEntry.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Insights.jsx
│   │   │   └── Cohorts.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Beneficiaries
- `GET /api/beneficiaries` - Get all beneficiaries (with filtering)
- `POST /api/beneficiaries` - Create new beneficiary
- `GET /api/beneficiaries/:id` - Get beneficiary by ID
- `PUT /api/beneficiaries/:id` - Update beneficiary
- `DELETE /api/beneficiaries/:id` - Delete beneficiary
- `GET /api/beneficiaries/analytics` - Get analytics data

### Surveys
- `GET /api/surveys` - Get all surveys
- `POST /api/surveys` - Create new survey
- `GET /api/surveys/:id` - Get survey by ID
- `POST /api/surveys/responses` - Submit survey response
- `GET /api/surveys/responses` - Get all responses
- `GET /api/surveys/:id/analytics` - Get survey analytics

### Funds
- `GET /api/funds` - Get all funds
- `POST /api/funds` - Create new fund allocation
- `GET /api/funds/:id` - Get fund by ID
- `PUT /api/funds/:id` - Update fund
- `DELETE /api/funds/:id` - Delete fund
- `GET /api/funds/analytics` - Get fund analytics

## 🎨 Key Features in Detail

### Data Entry Forms
- **Beneficiary Registration**: Comprehensive forms capturing vulnerability factors, literacy levels, device access, and financial inclusion metrics
- **Survey Management**: Create and manage surveys targeting specific vulnerable groups
- **Fund Tracking**: Monitor allocation, spending, and impact of financial inclusion initiatives

### Analytics Dashboard
- **Real-time Metrics**: Live updates on beneficiary counts, program status, and impact scores
- **Vulnerable Groups Analysis**: Detailed breakdown by refugee status, LGBTQ+ identity, disability, income level, and creative profession
- **Financial Inclusion Tracking**: Monitor bank account ownership, mobile money usage, insurance coverage, and savings behavior
- **Digital Inclusion**: Track device ownership and internet access patterns

### Reporting & Export
- **CSV Export**: Download beneficiary data, survey responses, and fund allocations
- **PDF Reports**: Generate professional reports for stakeholders and funders
- **Custom Filters**: Filter data by date range, geographic location, vulnerability factors, and program type

## 🔒 Security & Privacy

- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions for different user types
- **Audit Logging**: Track all data modifications for accountability
- **GDPR Compliance**: Built-in privacy controls and data export capabilities

## 🌟 Accessibility Features

- **Screen Reader Support**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Support for users with visual impairments
- **Reduced Motion**: Respects user preferences for motion sensitivity
- **Responsive Design**: Works on all device sizes

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)
```bash
cd backend
# Set environment variables
# Deploy to Railway or Render
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- HEVA Fund for the mission and vision
- Power Learn Project for the hackathon opportunity
- All contributors working towards cultural inclusion

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Hacking! 🎉**

*Empowering communities through inclusive data-driven decisions.*
