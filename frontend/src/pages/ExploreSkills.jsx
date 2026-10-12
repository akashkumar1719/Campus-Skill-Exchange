import { useState } from "react";
import "../App.css";
import "./ExploreSkills.css";

const skills = [
  {
  slug: "web-development",
  icon: "💻",
  title: "Web Development",
  category: "Programming",
  mentor: "12 mentors",
  rating: "4.9",
  level: "Beginner → Advanced",
},
{
  slug: "ui-ux-design",
  icon: "🎨",
  title: "UI/UX Design",
  category: "Design",
  mentor: "8 mentors",
  rating: "4.8",
  level: "Beginner → Intermediate",
},
{
  slug: "data-science",
  icon: "📊",
  title: "Data Science",
  category: "Technology",
  mentor: "15 mentors",
  rating: "4.9",
  level: "Intermediate → Advanced",
},
{
  slug: "python-programming",
  icon: "🐍",
  title: "Python Programming",
  category: "Programming",
  mentor: "18 mentors",
  rating: "4.9",
  level: "Beginner → Advanced",
},
{
  slug: "cloud-computing",
  icon: "☁️",
  title: "Cloud Computing",
  category: "Technology",
  mentor: "7 mentors",
  rating: "4.7",
  level: "Intermediate",
},
{
  slug: "mobile-development",
  icon: "📱",
  title: "Mobile Development",
  category: "Programming",
  mentor: "10 mentors",
  rating: "4.8",
  level: "Intermediate → Advanced",
},
];

const categories = [
  "All Skills",
  "Programming",
  "Design",
  "Technology",
  "Business",
  "Communication",
];

function ExploreSkills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Skills");

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.level.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Skills" ||
      skill.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Skills");
  };

  return (
    <div className="explore-page">
      <nav className="explore-navbar">
        <a href="/" className="explore-logo">
          <span>✦</span> Campus<span>Skill</span>
        </a>

        <div className="explore-nav-links">
          <a href="/">Home</a>
          <a href="/explore-skills" className="active">
            Explore Skills
          </a>
          <a href="/#mentors">Mentors</a>
          <a href="/#about">About</a>
        </div>

        <div className="explore-nav-actions">
          <button className="explore-login">Login</button>
          <button className="explore-signup">Get Started</button>
        </div>
      </nav>

      <section className="explore-header">
        <div className="explore-badge">
          ✨ CAMPUS SKILL MARKETPLACE
        </div>

        <h1>
          Discover your next
          <span> skill.</span>
        </h1>

        <p>
          Learn from talented students across your campus,
          book sessions, and turn knowledge into experience.
        </p>

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search for a skill, technology, or topic..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="button">
            Search
          </button>
        </div>
      </section>

      <section className="category-section">
        <div className="category-title">
          <div>
            <h2>Explore Skills</h2>
            <span>
              {filteredSkills.length}{" "}
              {filteredSkills.length === 1 ? "skill" : "skills"} found
            </span>
          </div>

          {(searchTerm !== "" ||
            selectedCategory !== "All Skills") && (
            <button
              className="reset-filter-btn"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category active-category"
                  : "category"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {filteredSkills.length > 0 ? (
        <section className="skills-grid">
          {filteredSkills.map((skill) => (
            <div
              className="skill-market-card"
              key={skill.title}
            >
              <div className="skill-card-top">
                <div className="skill-icon">
                  {skill.icon}
                </div>

                <span className="rating">
                  ★ {skill.rating}
                </span>
              </div>

              <div className="skill-category">
                {skill.category}
              </div>

              <h3>{skill.title}</h3>

              <p className="skill-level">
                {skill.level}
              </p>

              <div className="skill-card-bottom">
  <span>
    👥 {skill.mentor}
  </span>

  <a
    href={`/skill/${skill.slug}`}
    className="explore-skill-link"
  >
    Explore →
  </a>
</div>
            </div>
          ))}
        </section>
      ) : (
        <section className="no-results">
          <div className="no-results-icon">⌕</div>

          <h2>No skills found</h2>

          <p>
            We couldn't find a skill matching your current
            search or category.
          </p>

          <button onClick={resetFilters}>
            Clear Filters
          </button>
        </section>
      )}
    </div>
  );
}

export default ExploreSkills;