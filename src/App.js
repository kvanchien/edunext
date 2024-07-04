import Homepage from './components/Homepage';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider'; 
import Login from './components/Login';
import Management from './components/Management';
import CourseDetails from "./components/CourseDetails";
import SlotsDetail from './components/SlotsDetail';
import QuestionDetailPage from './components/QuestionDetailPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/management" element={<Management />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/course/:courseId/slot/:slotId" component={SlotsDetail} />
          <Route path="/courses/:courseId/slots/:slotId" component={QuestionDetailPage} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

