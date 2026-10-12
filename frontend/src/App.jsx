import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ExploreSkills from "./pages/ExploreSkills";
import SkillDetails from "./pages/SkillDetails";
import MentorProfile from "./pages/MentorProfile";
import MyBookings from "./pages/MyBookings";
import SessionPage from "./pages/SessionPage";
import MentorDashboard from "./pages/MentorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/explore-skills"
          element={<ExploreSkills />}
        />

        <Route
          path="/skill/:slug"
          element={<SkillDetails />}
        />

        <Route
          path="/mentor/:mentorSlug"
          element={<MentorProfile />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        <Route
          path="/session"
          element={<SessionPage />}
        />

        {/* Mentor Dashboard */}
        <Route
          path="/mentor"
          element={<MentorDashboard />}
        />

        {/* Keep the existing route working too */}
        <Route
          path="/mentor-dashboard"
          element={<MentorDashboard />}
        />
        <Route
  path="/student-dashboard"
  element={<StudentDashboard />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;