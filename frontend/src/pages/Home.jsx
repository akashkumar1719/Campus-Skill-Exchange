import "../App.css";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          Campus<span>Skill</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="/explore-skills">Explore Skills</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="#mentors">Mentors</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Get Started</button>
        </div>
      </nav>

      <main id="home" className="hero">
        <div className="hero-content">
          <div className="badge">
            ✨ Learn. Teach. Connect. Grow.
          </div>

          <h1>
            Your Campus.
            <br />
            <span>Your Skills.</span>
            <br />
            Your Community.
          </h1>

          <p>
            A student-powered skill exchange platform where you can
            learn from your peers, teach what you know, and grow
            together.
          </p>

          <div className="hero-buttons">
           <a href="/explore-skills" className="primary-btn">
  Explore Skills →
</a>

            <button className="secondary-btn">
              Become a Mentor
            </button>
          </div>

          <div className="stats">
            <div>
              <strong>100+</strong>
              <span>Skills</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Students</span>
            </div>

            <div>
              <strong>50+</strong>
              <span>Mentors</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="skill-card card-one">
            <span>💻</span>
            <div>
              <strong>Web Development</strong>
              <small>12 mentors</small>
            </div>
          </div>

          <div className="skill-card card-two">
            <span>🎨</span>
            <div>
              <strong>UI/UX Design</strong>
              <small>8 mentors</small>
            </div>
          </div>

          <div className="skill-card card-three">
            <span>📊</span>
            <div>
              <strong>Data Science</strong>
              <small>15 mentors</small>
            </div>
          </div>

          <div className="center-logo">
            <span>✦</span>
          </div>
        </div>
      </main>

      <section id="skills" className="preview-section">
        <p>THE FUTURE OF CAMPUS LEARNING</p>
        <h2>
          Learn skills from people
          <br />
          <span>who understand your journey.</span>
        </h2>
      </section>
    </div>
  );
}

export default App;