import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminQuestions from './pages/admin/Questions';
import QuestionForm from './pages/admin/QuestionForm';
import LandingPage from './pages/client/Landing';
import HomePage from './pages/client/Home';
import QuizSession from './pages/client/Quiz';
import QuizResult from './pages/client/Result';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
        {/* Client Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizSession />} />
        <Route path="/result" element={<QuizResult />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="questions/new" element={<QuestionForm />} />
            <Route path="questions/:id" element={<QuestionForm />} />
          </Route>
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
