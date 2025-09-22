# Document Management System (DMS)

A modern, full-featured Document Management System built with Next.js 15, designed to efficiently organize, store, and retrieve documents with advanced search capabilities and user management.

## 🚀 Features

### Core Functionality
- **Secure Authentication**: OTP-based login system via mobile number
- **Document Upload**: Upload documents with comprehensive metadata
- **Advanced Search**: Multi-criteria document search with filters
- **User Management**: Create and manage system users
- **Responsive Design**: Mobile-first design with modern UI

### Document Management
- **Metadata Support**: Major/Minor heads, tags, remarks, and dates
- **File Types**: Support for images and PDF documents
- **Tag System**: Dynamic tagging with auto-suggestions
- **Document Preview**: View documents directly in browser
- **Download Support**: Secure document downloads

### Search & Filtering
- **Category Filters**: Filter by major and minor categories
- **Date Range**: Search documents within specific date ranges
- **Tag-based Search**: Find documents by tags
- **Uploader Filter**: Search by document uploader
- **Pagination**: Efficient handling of large document sets

### User Experience
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Real-time Notifications**: Toast notifications for user feedback
- **Loading States**: Smooth loading indicators throughout the app
- **Form Validation**: Comprehensive client-side validation with Zod
- **Responsive Navigation**: Adaptive navigation for all screen sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Testing**: Jest with Testing Library
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**/**pnpm**/**bun** (alternative package managers)
- **Git** (for cloning the repository)

You can verify your Node.js installation by running:
```bash
node --version
npm --version
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd allsoft-assignment-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the environment template
   cp env.example .env
   # or on Windows:
   copy env.example .env
   ```

4. **Configure environment variables:**
   Open the `.env` file and update the values as needed:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://apis.allsoft.co/api
   ```
   Replace the API base URL with your actual backend API endpoint.

## 🏃‍♂️ Development

### Running the Development Server

Start the development server with hot reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running Tests

This project uses Jest for testing. Run the test suite:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

## 🏗️ Building for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running in Production Mode

After building, you can start the production server:

```bash
npm start
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── document-management/ # Document management page
│   │   └── users/               # User management page
│   ├── __tests__/               # Page-level tests
│   ├── favicon.ico              # App favicon
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Login page
├── components/                  # Reusable components
│   ├── auth/                    # Authentication components
│   │   ├── AuthGuard.tsx        # Route protection component
│   │   ├── LeftPanel.tsx        # Login page left panel
│   │   └── LoginForm.tsx        # OTP-based login form
│   ├── common/                  # Common UI components
│   │   └── navbar.tsx           # Main navigation bar
│   ├── document-management/     # Document management components
│   │   ├── search-document.tsx  # Advanced search interface
│   │   └── upload-document.tsx  # Document upload form
│   ├── ui/                      # UI library components (shadcn/ui)
│   └── users/                   # User management components
│       └── user-creation-form.tsx # User creation form
└── lib/                         # Utilities and configurations
    ├── store.ts                 # Zustand state management
    └── utils.ts                 # Utility functions
```

## 🔐 Authentication Flow

1. **Login**: Users enter their registered mobile number
2. **OTP Generation**: System sends OTP via SMS and WhatsApp
3. **OTP Verification**: Users enter the 6-digit OTP to authenticate
4. **Session Management**: JWT token stored in cookies for session persistence
5. **Route Protection**: Middleware ensures authenticated access to protected routes

## 📄 API Integration

The application integrates with a backend API for:

- **Authentication**: `/documentManagement/generateOTP` and `/documentManagement/validateOTP`
- **Document Management**: `/documentManagement/saveDocumentEntry` and `/documentManagement/searchDocumentEntry`
- **Tags**: `/documentManagement/documentTags`

## 🎨 UI Components

Built with modern design principles:

- **shadcn/ui**: High-quality, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode Ready**: Theme provider included
- **Accessibility**: WCAG compliant components

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend API | `https://apis.allsoft.co/api` | Yes |

## 🧪 Testing

The project includes comprehensive unit testing with Jest and Testing Library. The test suite covers all major components and functionality:

### Test Coverage

- **LoginForm Component**: OTP-based authentication flow, form validation, API integration
- **Navbar Component**: Navigation, user menu, notifications, responsive design
- **UploadDocument Component**: File upload, form validation, tag management, API integration
- **SearchDocument Component**: Search functionality, filtering, pagination, document actions
- **UserCreationForm Component**: User creation, form validation, password management
- **Auth Store**: State management, user data persistence
- **Page Components**: Login page rendering and basic functionality

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

### Test Configuration

- **Framework**: Jest with Next.js integration
- **Environment**: jsdom for DOM simulation
- **UI Testing**: React Testing Library
- **Mocking**: Comprehensive mocking of APIs, components, and external dependencies
- **Coverage**: V8 coverage provider

### Test Structure

Tests are organized alongside components in `__tests__` directories:
```
src/
├── app/
│   ├── __tests__/          # Page-level tests
│   └── page.test.tsx
├── components/
│   ├── auth/__tests__/     # Authentication component tests
│   ├── common/__tests__/   # Common component tests
│   ├── document-management/__tests__/ # Document management tests
│   └── users/__tests__/    # User management tests
└── lib/
    └── __tests__/          # Utility and store tests
```

## 🚀 Deployment

### Live Demo
The application is deployed and available at: [https://document-management-system-dusky.vercel.app/](https://document-management-system-dusky.vercel.app/)

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Manual Deployment

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Configure your web server to serve the `.next` directory

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Issues:**
   - Ensure the API base URL is correctly configured
   - Check that the backend API is accessible
   - Verify mobile number is registered in the system

2. **File Upload Problems:**
   - Check file size limits on the backend
   - Ensure supported file types (images, PDFs)
   - Verify network connectivity

3. **Search Not Working:**
   - Confirm user authentication token is valid
   - Check API endpoint availability
   - Verify search parameters are correctly formatted

4. **Build Failures:**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Development Tips

- Use `npm run dev` for development with hot reload
- Run `npm test` before committing changes
- Use `npm run lint` to check code quality
- Check browser console for detailed error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Check the documentation
- Create an issue in the repository
- Contact me at ✉️ rahulsahu79998@gmail.com

---

Built with ❤️ using Next.js and modern web technologies.
