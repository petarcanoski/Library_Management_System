# Zosh Library - Library Management System

A modern, full-featured library management system built with React, Redux Toolkit, and Tailwind CSS. This application provides a comprehensive solution for managing library operations including book cataloging, member subscriptions, book loans, and payment processing.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-cyan)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.9.0-purple)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.4-blue)

## Features

### Landing Page
- **Modern Design**: Clean, minimal, and elegant light theme
- **Responsive**: Mobile-first design that works on all devices
- **Animated**: Smooth CSS animations and scroll-triggered effects
- **SEO Friendly**: Semantic HTML and accessibility features

### Core Functionality
- **Book Management**: Browse, search, and reserve books
- **User Authentication**: Secure JWT-based authentication
- **Subscription Plans**: Multiple membership tiers
- **Payment Integration**: Secure payment processing with Razorpay/Stripe
- **Book Loans**: Track borrowed books and due dates
- **Genre Classification**: Organized book categorization

## Tech Stack

### Frontend
- **React 19.1.1**: Latest React with modern hooks
- **Vite 7.1.7**: Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.14**: Utility-first CSS framework
- **Redux Toolkit 2.9.0**: State management
- **React Router DOM 7.9.4**: Client-side routing
- **Material-UI Icons 7.3.4**: Comprehensive icon library
- **Axios 1.12.2**: HTTP client

### Development
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Project Structure

```
library-managment-frontend/
├── src/
│   ├── components/
│   │   └── landing/           # Landing page components
│   │       ├── Navbar.jsx     # Navigation with mobile menu
│   │       ├── Hero.jsx       # Hero section with CTAs
│   │       ├── Features.jsx   # Feature showcase
│   │       ├── Stats.jsx      # Animated statistics
│   │       ├── Testimonials.jsx # User testimonials
│   │       └── Footer.jsx     # Comprehensive footer
│   ├── pages/
│   │   └── LandingPage.jsx    # Landing page container
│   ├── store/
│   │   └── features/          # Redux slices and thunks
│   │       ├── auth/
│   │       ├── books/
│   │       ├── bookLoans/
│   │       ├── genres/
│   │       ├── payments/
│   │       └── subscriptions/
│   ├── utils/
│   │   ├── api.js             # Centralized axios instance
│   │   └── getHeaders.js      # JWT header utility
│   ├── App.jsx                # Main app with routing
│   ├── App.css                # Custom animations
│   └── main.jsx               # Entry point
├── public/                    # Static assets
├── docs/                      # Documentation
│   ├── QUICK_START.md
│   ├── LANDING_PAGE_SETUP.md
│   └── ARCHITECTURE.md
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd library-managment-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## API Configuration

The application uses a centralized API configuration located in `src/utils/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### Authentication

JWT tokens are automatically included in requests using the `getHeaders()` utility:

```javascript
import { getHeaders } from '../utils/getHeaders';

// In thunk functions
const response = await api.get('/api/books', {
  headers: getHeaders(),
});
```

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **auth**: User authentication and profile
- **books**: Book catalog and search
- **bookLoans**: Loan tracking and management
- **genres**: Book categorization
- **payments**: Payment processing
- **subscriptions**: Membership management

## Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with a custom configuration:

- **Colors**: Indigo and purple gradient theme
- **Responsive**: Mobile-first breakpoints
- **Custom utilities**: Extended with custom animations

### Custom Animations

CSS keyframe animations are defined in `App.css`:

- `fadeIn`: Smooth fade-in effect
- `fadeInUp`: Fade-in with upward motion
- `fadeInScale`: Fade-in with scaling effect
- `blob`: Animated blob shapes

Usage example:
```jsx
<div className="animate-fade-in-up animation-delay-200">
  Content
</div>
```

## Components

### Landing Page Components

#### Navbar
- Fixed position with backdrop blur
- Mobile-responsive hamburger menu
- Smooth scroll navigation
- Brand logo and CTA buttons

#### Hero
- Animated background with blob shapes
- Gradient text effects
- Call-to-action buttons
- Trust indicators

#### Features
- 6 feature cards with hover effects
- Material-UI icons
- Gradient hover states

#### Stats
- Animated counters using Intersection Observer
- 4 key metrics
- Real-time counting animation

#### Testimonials
- User reviews with 5-star ratings
- Quote styling with MUI icons
- CTA section for membership

#### Footer
- Multi-column link layout
- Contact information
- Social media links
- Newsletter signup

## Backend Integration

The frontend connects to a Spring Boot backend running on `http://localhost:5000` with the following endpoints:

- `/api/auth/*`: Authentication endpoints
- `/api/books/*`: Book management
- `/api/book-loans/*`: Loan management
- `/api/genres/*`: Genre management
- `/api/payments/*`: Payment processing
- `/api/subscription-plans/*`: Subscription management

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Build**: Vite's optimized production build
- **CSS Purging**: Tailwind CSS removes unused styles

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible states
- Alt text for images

## Documentation

For more detailed information, see:

- [Quick Start Guide](docs/QUICK_START.md)
- [Landing Page Setup](docs/LANDING_PAGE_SETUP.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email contact@zoshlibrary.com or create an issue in the repository.

## Acknowledgments

- Material-UI for the comprehensive icon library
- Tailwind CSS for the utility-first CSS framework
- Redux Toolkit for simplified state management
- Vite for the blazing-fast build tool

---

Made with ❤ by Zosh Team
