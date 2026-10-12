    
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/study-materials/mentor/arun-kumar"
        );

        if (!response.ok) {
          throw new Error("Unable to load study materials.");
        }

        const data = await response.json();
        setStudyMaterials(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load study materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudyMaterials();
  }, []);

  return (
    <div className="student-dashboard">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            Campus<span>Skill</span>
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/explore-skills">Explore Skills</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </div>
        </div>
      </nav>

      <main className="student-dashboard-container">
        <header className="student-dashboard-header">
          <p className="dashboard-eyebrow">STUDENT DASHBOARD</p>
          <h1>My Learning Resources 📚</h1>
          <p>
            Access study materials shared by your mentors.
          </p>
          <Link to="/my-bookings">View My Bookings →</Link>
        </header>

        <section className="student-materials-section">
          <div className="student-materials-heading">
            <h2>Study Materials</h2>
            <span>{studyMaterials.length} resources</span>
          </div>

          {loading ? (
            <p>Loading study materials...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : studyMaterials.length === 0 ? (
            <div className="student-materials-empty">
              <h3>No study materials yet</h3>
              <p>
                Your mentor's learning resources will appear here
                when they are available.
              </p>
            </div>
          ) : (
            <div className="student-materials-list">
              {studyMaterials.map((material) => (
                <article
                  className="student-material-card"
                  key={material.id}
                >
                  <div className="student-material-icon">
                    {material.materialType === "PDF"
                      ? "📄"
                      : material.materialType === "PPT"
                      ? "📊"
                      : material.materialType === "ASSIGNMENT"
                      ? "📝"
                      : material.materialType === "LINK"
                      ? "🔗"
                      : "📚"}
                  </div>

                  <div className="student-material-info">
                    <span>{material.materialType}</span>
                    <h3>{material.title}</h3>
                    <p>
                      {material.description ||
                        "No description provided."}
                    </p>
                    <small>Mentor: Arun Kumar</small>
                  </div>

                  {material.resourceUrl && (
                    <a
                      className="student-material-open-button"
                      href={material.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Resource ↗
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;