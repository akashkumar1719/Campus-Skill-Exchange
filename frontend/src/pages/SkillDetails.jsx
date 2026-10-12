import { useParams } from "react-router-dom";
import "../App.css";
import "./SkillDetails.css";

const skillData = {
  "web-development": {
    icon: "💻",
    title: "Web Development",
    category: "Programming",
    rating: "4.9",
    students: "120+ students",
    mentors: "12 mentors",
    description:
      "Learn how to build modern websites and full-stack web applications using industry-relevant technologies.",
    skills: [
      "HTML & CSS",
      "JavaScript",
      "React",
      "REST APIs",
      "Git & GitHub",
      "Full Stack Development",
    ],
  },

  "ui-ux-design": {
    icon: "🎨",
    title: "UI/UX Design",
    category: "Design",
    rating: "4.8",
    students: "90+ students",
    mentors: "8 mentors",
    description:
      "Learn how to design intuitive, attractive, and user-friendly digital experiences.",
    skills: [
      "User Research",
      "Wireframing",
      "Figma",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
    ],
  },

  "data-science": {
    icon: "📊",
    title: "Data Science",
    category: "Technology",
    rating: "4.9",
    students: "150+ students",
    mentors: "15 mentors",
    description:
      "Explore data analysis, visualization, machine learning, and practical data science workflows.",
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "Data Visualization",
      "Machine Learning",
      "Data Analysis",
    ],
  },

  "python-programming": {
    icon: "🐍",
    title: "Python Programming",
    category: "Programming",
    rating: "4.9",
    students: "180+ students",
    mentors: "18 mentors",
    description:
      "Build a strong Python foundation and progress from programming basics to real-world applications.",
    skills: [
      "Python Basics",
      "Object-Oriented Programming",
      "File Handling",
      "APIs",
      "Automation",
      "Python Projects",
    ],
  },

  "cloud-computing": {
    icon: "☁️",
    title: "Cloud Computing",
    category: "Technology",
    rating: "4.7",
    students: "70+ students",
    mentors: "7 mentors",
    description:
      "Understand cloud concepts, services, deployment, storage, networking, and modern cloud architecture.",
    skills: [
      "Cloud Fundamentals",
      "Virtual Machines",
      "Cloud Storage",
      "Networking",
      "Deployment",
      "Cloud Security",
    ],
  },

  "mobile-development": {
    icon: "📱",
    title: "Mobile Development",
    category: "Programming",
    rating: "4.8",
    students: "100+ students",
    mentors: "10 mentors",
    description:
      "Learn how to design and develop modern mobile applications.",
    skills: [
      "Mobile UI",
      "React Native",
      "Navigation",
      "APIs",
      "State Management",
      "Mobile Deployment",
    ],
  },
};

const mentors = [
  {
    avatar: "AK",
    name: "Arun Kumar",
    role: "Computer Science Student",
    rating: "4.9",
    sessions: "42 sessions",
    skills: "React • JavaScript • Node.js",
  },
  {
    avatar: "PS",
    name: "Priya Sharma",
    role: "Final Year Student",
    rating: "4.8",
    sessions: "31 sessions",
    skills: "Python • Data Science • ML",
  },
  {
    avatar: "RV",
    name: "Rahul Verma",
    role: "Software Engineering Student",
    rating: "4.9",
    sessions: "56 sessions",
    skills: "Java • Spring Boot • APIs",
  },
];

function SkillDetails() {
  const { slug } = useParams();

  const skill = skillData[slug];

  if (!skill) {
    return (
      <div className="skill-not-found">
        <h1>Skill not found</h1>
        <p>
          The skill you're looking for doesn't exist.
        </p>

        <a href="/explore-skills">
          ← Back to Explore Skills
        </a>
      </div>
    );
  }

  return (
    <div className="skill-details-page">

      {/* NAVBAR */}

      <nav className="skill-details-navbar">
        <a href="/" className="details-logo">
          <span>✦</span> Campus<span>Skill</span>
        </a>

        <div className="details-nav-links">
          <a href="/">Home</a>
          <a href="/explore-skills">Explore Skills</a>
          <a href="/#mentors">Mentors</a>
          <a href="/#about">About</a>
        </div>

        <button className="details-login">
          Login
        </button>
      </nav>

      {/* BREADCRUMB */}

      <div className="details-container">
        <a
          href="/explore-skills"
          className="breadcrumb"
        >
          ← Explore Skills
        </a>

        {/* HERO */}

        <section className="skill-detail-hero">

          <div className="skill-detail-icon">
            {skill.icon}
          </div>

          <div className="skill-detail-content">

            <div className="detail-category">
              {skill.category}
            </div>

            <h1>{skill.title}</h1>

            <p>{skill.description}</p>

            <div className="detail-stats">
              <span>★ {skill.rating} rating</span>
              <span>👥 {skill.students}</span>
              <span>🎓 {skill.mentors}</span>
            </div>

          </div>

          <div className="booking-card">

            <div className="booking-price">
              <span>Campus Learning</span>
              <strong>Free</strong>
            </div>

            <p>
              Learn directly from students
              who already know this skill.
            </p>

            <button className="book-session-btn">
              Find a Mentor →
            </button>

          </div>

        </section>

        {/* WHAT YOU WILL LEARN */}

        <section className="learning-section">

          <div className="section-heading">
            <span>YOUR LEARNING PATH</span>
            <h2>What you'll learn</h2>
          </div>

          <div className="learning-grid">

            {skill.skills.map((item, index) => (
              <div
                className="learning-item"
                key={item}
              >
                <div className="learning-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <h3>{item}</h3>
                  <p>
                    Learn through peer-to-peer
                    guidance and practical sessions.
                  </p>
                </div>
              </div>
            ))}

          </div>

        </section>

        {/* MENTORS */}

        <section className="mentors-section">

          <div className="section-heading">
            <span>PEER MENTORS</span>
            <h2>Learn from students like you</h2>
          </div>

          <div className="mentor-grid">

            {mentors.map((mentor) => (
              <div
                className="mentor-card"
                key={mentor.name}
              >

                <div className="mentor-avatar">
                  {mentor.avatar}
                </div>

                <h3>{mentor.name}</h3>

                <p className="mentor-role">
                  {mentor.role}
                </p>

                <div className="mentor-rating">
                  ★ {mentor.rating}
                  <span>
                    • {mentor.sessions}
                  </span>
                </div>

                <div className="mentor-skills">
                  {mentor.skills}
                </div>

                <a
  href={`/mentor/${
    mentor.name
      .toLowerCase()
      .replace(/\s+/g, "-")
  }`}
  className="mentor-button"
>
  View Profile →
</a>

              </div>
            ))}

          </div>

        </section>

      </div>
    </div>
  );
}

export default SkillDetails;