import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./MentorDashboard.css";

function MentorDashboard() {
  const AVAILABILITY_STORAGE_KEY =
    "mentor_availability_arun_kumar";

  const SESSION_STARTED_STORAGE_KEY =
    "campus_skill_exchange_started_sessions";

  const navigate = useNavigate();

  // =========================================
  // BOOKINGS
  // =========================================

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("ALL");

  // =========================================
  // MENTOR REVIEWS
  // =========================================

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // =========================================
  // SESSION START STATE
  // =========================================

  const [startedSessions, setStartedSessions] = useState(() => {
    try {
      const savedSessions = localStorage.getItem(
        SESSION_STARTED_STORAGE_KEY
      );

      return savedSessions
        ? JSON.parse(savedSessions)
        : {};
    } catch (error) {
      console.error(
        "Error loading started sessions:",
        error
      );

      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      SESSION_STARTED_STORAGE_KEY,
      JSON.stringify(startedSessions)
    );
  }, [startedSessions]);

  // =========================================
  // MENTOR AVAILABILITY
  // =========================================

  const defaultAvailability = [
    {
      id: 1,
      day: "Monday",
      startTime: "09:00",
      endTime: "12:00",
      isAvailable: true,
    },
    {
      id: 2,
      day: "Wednesday",
      startTime: "14:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      id: 3,
      day: "Friday",
      startTime: "10:00",
      endTime: "13:00",
      isAvailable: true,
    },
  ];

  const [availability, setAvailability] = useState(() => {
    try {
      const savedAvailability = localStorage.getItem(
        AVAILABILITY_STORAGE_KEY
      );

      if (savedAvailability) {
        const parsedAvailability =
          JSON.parse(savedAvailability);

        return parsedAvailability.map((slot) => ({
          ...slot,
          isAvailable:
            slot.isAvailable !== false,
        }));
      }

      return defaultAvailability;
    } catch (error) {
      console.error(
        "Error loading saved availability:",
        error
      );

      return defaultAvailability;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      AVAILABILITY_STORAGE_KEY,
      JSON.stringify(availability)
    );
  }, [availability]);

  const [showAvailabilityForm, setShowAvailabilityForm] =
    useState(false);

  const [newAvailability, setNewAvailability] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
  });

  const [editingAvailabilityId, setEditingAvailabilityId] =
    useState(null);

  // =========================================
  // FETCH BOOKINGS
  // =========================================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/bookings/mentor/arun-kumar"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch mentor bookings"
          );
        }

        const data = await response.json();

        setBookings(data);
      } catch (error) {
        console.error(
          "Error fetching mentor bookings:",
          error
        );

        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // =========================================
  // FETCH MENTOR REVIEWS
  // =========================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/reviews/mentor/arun-kumar"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch mentor reviews"
          );
        }

        const data = await response.json();

        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Error fetching mentor reviews:",
          error
        );

        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  // =========================================
  // STUDY MATERIALS
  // =========================================

  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialError, setMaterialError] = useState("");
  const [materialMessage, setMaterialMessage] = useState("");

  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    materialType: "PDF",
    resourceUrl: "",
  });

  // =========================================
  // FETCH STUDY MATERIALS
  // =========================================

  const fetchStudyMaterials = async () => {
    setLoadingMaterials(true);
    setMaterialError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/study-materials/mentor/arun-kumar"
      );

      if (!response.ok) {
        throw new Error("Failed to load study materials.");
      }

      const data = await response.json();
      setStudyMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      setMaterialError(
        error.message || "Unable to load study materials."
      );
    } finally {
      setLoadingMaterials(false);
    }
  };

  
  // =========================================
  // STUDY MATERIAL FORM HANDLERS
  // =========================================

  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [savingMaterial, setSavingMaterial] = useState(false);

  const handleMaterialChange = (event) => {
    const { name, value } = event.target;

    setMaterialForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetMaterialForm = () => {
    setMaterialForm({
      title: "",
      description: "",
      materialType: "PDF",
      resourceUrl: "",
    });

    setEditingMaterialId(null);
    setMaterialMessage("");
    setMaterialError("");
  };

  // =========================================
  // ADD OR UPDATE STUDY MATERIAL
  // =========================================

  const handleMaterialSubmit = async (event) => {
    event.preventDefault();

    const title = materialForm.title.trim();
    const resourceUrl = materialForm.resourceUrl.trim();

    if (!title || !resourceUrl) {
      setMaterialError("Please enter a title and resource URL.");
      return;
    }

    try {
      setSavingMaterial(true);
      setMaterialError("");
      setMaterialMessage("");

      const materialData = {
        title,
        description: materialForm.description.trim(),
        materialType: materialForm.materialType,
        mentorSlug: "arun-kumar",
        resourceUrl,
      };

      const isEditing = editingMaterialId !== null;

      const response = await fetch(
        isEditing
          ? `http://localhost:8080/api/study-materials/${editingMaterialId}`
          : "http://localhost:8080/api/study-materials",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(materialData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to ${isEditing ? "update" : "add"} study material.`
        );
      }

      await fetchStudyMaterials();
      resetMaterialForm();

      setMaterialMessage(
        isEditing
          ? "Study material updated successfully."
          : "Study material added successfully."
      );
    } catch (error) {
      setMaterialError(
        error.message || "Something went wrong."
      );
    } finally {
      setSavingMaterial(false);
    }
  };

  // =========================================
  // EDIT STUDY MATERIAL
  // =========================================

  const handleEditMaterial = (material) => {
    setMaterialForm({
      title: material.title || "",
      description: material.description || "",
      materialType: material.materialType || "PDF",
      resourceUrl: material.resourceUrl || "",
    });

    setEditingMaterialId(material.id);
    setMaterialError("");
    setMaterialMessage("");
  };

  // =========================================
  // DELETE STUDY MATERIAL
  // =========================================

  const handleDeleteMaterial = async (materialId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this study material?"
    );

    if (!confirmed) return;

    try {
      setMaterialError("");
      setMaterialMessage("");

      const response = await fetch(
        `http://localhost:8080/api/study-materials/${materialId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete study material.");
      }

      setStudyMaterials((current) =>
        current.filter((material) => material.id !== materialId)
      );

      if (editingMaterialId === materialId) {
        resetMaterialForm();
      }

      setMaterialMessage("Study material deleted successfully.");
    } catch (error) {
      setMaterialError(
        error.message || "Unable to delete study material."
      );
    }
  };

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  // =========================================
  // REVIEW STATISTICS
  // =========================================

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (timeString) => {
    if (!timeString) {
      return "—";
    }

    const [hours, minutes] =
      timeString.split(":");

    const hour = parseInt(hours, 10);

    const modifier =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 || 12;

    return `${displayHour}:${minutes} ${modifier}`;
  };

  // =========================================
  // UPCOMING BOOKING CHECK
  // =========================================

  const isUpcoming = (booking) => {
    if (booking.status !== "CONFIRMED") {
      return false;
    }

    const bookingDateTime = new Date(
      `${booking.bookingDate}T${booking.bookingTime}`
    );

    return bookingDateTime > new Date();
  };

  const upcomingBookings = bookings
    .filter(isUpcoming)
    .sort((a, b) => {
      const dateA = new Date(
        `${a.bookingDate}T${a.bookingTime}`
      );

      const dateB = new Date(
        `${b.bookingDate}T${b.bookingTime}`
      );

      return dateA - dateB;
    });

  // =========================================
  // SESSION START CHECK
  // =========================================

  const isSessionStarted = (bookingId) => {
    return Boolean(
      startedSessions[String(bookingId)]
    );
  };

  // =========================================
  // START SESSION
  // =========================================

  const handleStartSession = (booking) => {
    if (
      !booking ||
      booking.status !== "CONFIRMED" ||
      !isUpcoming(booking)
    ) {
      alert(
        "Only confirmed upcoming sessions can be started."
      );

      return;
    }

    setStartedSessions((current) => ({
      ...current,
      [String(booking.id)]: true,
    }));
  };

  // =========================================
  // BOOKING STATUS COUNTS
  // =========================================

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "CONFIRMED"
  );

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "PENDING"
  );

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status === "CANCELLED"
  );

  const filteredBookings =
    bookingFilter === "ALL"
      ? bookings
      : bookings.filter(
          (booking) =>
            booking.status ===
            bookingFilter
        );

  // =========================================
  // ADD AVAILABILITY
  // =========================================

  const hasAvailabilityConflict = (
    candidate,
    ignoreId = null
  ) => {
    return availability.some((slot) => {
      if (slot.id === ignoreId) {
        return false;
      }

      if (slot.day !== candidate.day) {
        return false;
      }

      return (
        candidate.startTime <
          slot.endTime &&
        candidate.endTime >
          slot.startTime
      );
    });
  };

  const handleAddAvailability = (event) => {
    event.preventDefault();

    if (
      newAvailability.startTime >=
      newAvailability.endTime
    ) {
      alert(
        "End time must be later than start time."
      );

      return;
    }

    if (
      hasAvailabilityConflict(
        newAvailability
      )
    ) {
      alert(
        "This time overlaps with another availability slot on the same day."
      );

      return;
    }

    const newSlot = {
      id: Date.now(),
      day: newAvailability.day,
      startTime:
        newAvailability.startTime,
      endTime:
        newAvailability.endTime,
      isAvailable: true,
    };

    setAvailability((current) => [
      ...current,
      newSlot,
    ]);

    setNewAvailability({
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    });

    setShowAvailabilityForm(false);
    setEditingAvailabilityId(null);
  };

  // =========================================
  // EDIT AVAILABILITY
  // =========================================

  const handleEditAvailability = (slot) => {
    setNewAvailability({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    setEditingAvailabilityId(slot.id);
    setShowAvailabilityForm(true);
  };

  // =========================================
  // UPDATE AVAILABILITY
  // =========================================

  const handleUpdateAvailability = (
    event
  ) => {
    event.preventDefault();

    if (
      newAvailability.startTime >=
      newAvailability.endTime
    ) {
      alert(
        "End time must be later than start time."
      );

      return;
    }

    if (
      hasAvailabilityConflict(
        newAvailability,
        editingAvailabilityId
      )
    ) {
      alert(
        "This time overlaps with another availability slot on the same day."
      );

      return;
    }

    setAvailability((current) =>
      current.map((slot) =>
        slot.id === editingAvailabilityId
          ? {
              ...slot,
              day: newAvailability.day,
              startTime:
                newAvailability.startTime,
              endTime:
                newAvailability.endTime,
            }
          : slot
      )
    );

    setNewAvailability({
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    });

    setEditingAvailabilityId(null);
    setShowAvailabilityForm(false);
  };

  // =========================================
  // CANCEL AVAILABILITY FORM
  // =========================================

  const handleCancelAvailability = () => {
    setShowAvailabilityForm(false);

    setEditingAvailabilityId(null);

    setNewAvailability({
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    });
  };

  // =========================================
  // TOGGLE AVAILABILITY
  // =========================================

  const handleToggleAvailability = (id) => {
    setAvailability((current) =>
      current.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              isAvailable:
                !slot.isAvailable,
            }
          : slot
      )
    );
  };

  // =========================================
  // DELETE AVAILABILITY
  // =========================================

  const handleDeleteAvailability = (id) => {
    setAvailability((current) =>
      current.filter(
        (slot) => slot.id !== id
      )
    );
  };

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="mentor-dashboard">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="navbar">

        <div className="navbar-container">

          <Link
            to="/"
            className="logo"
          >
            Campus<span>Skill</span>
          </Link>

          <div className="nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/explore-skills">
              Explore Skills
            </Link>

            <Link to="/my-bookings">
              My Bookings
            </Link>

          </div>

          <button
            type="button"
            className="nav-login"
          >
            Mentor
          </button>

        </div>

      </nav>


      {/* =========================================
          DASHBOARD
      ========================================= */}

      <main className="mentor-dashboard-container">

        {/* =========================================
            HEADER
        ========================================= */}

        <section className="dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              MENTOR DASHBOARD
            </p>

            <h1>
              Welcome back, Arun 👋
            </h1>

            <p>
              Manage your sessions, students and
              teaching activities.
            </p>

          </div>

          <div className="mentor-dashboard-avatar">
            AK
          </div>

        </section>


        {/* =========================================
            STATS
        ========================================= */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <span>
              📅
            </span>

            <div>

              <small>
                Upcoming Sessions
              </small>

              <strong>
                {upcomingBookings.length}
              </strong>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <span>
              🎓
            </span>

            <div>

              <small>
                Total Sessions
              </small>

              <strong>
                42
              </strong>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <span>
              ⭐
            </span>

            <div>

              <small>
                Rating
              </small>

              <strong>
                {averageRating}
              </strong>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <span>
              👨‍🎓
            </span>

            <div>

              <small>
                Students
              </small>

              <strong>
                28
              </strong>

            </div>

          </div>

        </section>


        {/* =========================================
            MENTOR PROFILE OVERVIEW
        ========================================= */}

        <section className="mentor-overview-card">

          <div className="mentor-overview-left">

            <div className="mentor-overview-avatar">
              AK
            </div>

            <div className="mentor-overview-info">

              <div className="mentor-overview-name">

                <h2>
                  Arun Kumar
                </h2>

                <span className="mentor-verified-badge">
                  ✓ Verified
                </span>

              </div>

              <p className="mentor-overview-role">
                Computer Science Student
              </p>

              <p className="mentor-overview-academic">
                Computer Science & Engineering • 3rd Year
              </p>

              <div className="mentor-overview-stats">

                <span>
                  ⭐{" "}
                  <strong>
                    {averageRating}
                  </strong>
                </span>

                <span>
                  {totalReviews}{" "}
                  {totalReviews === 1
                    ? "review"
                    : "reviews"}
                </span>

                <span>
                  42 sessions
                </span>

              </div>

            </div>

          </div>


          <div className="mentor-overview-right">

            <p>
              Skills I teach
            </p>

            <div className="mentor-overview-skills">

              <span>
                React
              </span>

              <span>
                JavaScript
              </span>

              <span>
                Node.js
              </span>

              <span>
                HTML & CSS
              </span>

              <span>
                Git & GitHub
              </span>

            </div>

            <Link
              to="/mentor/arun-kumar"
              className="mentor-profile-link"
            >
              View Profile →
            </Link>

          </div>

        </section>


        {/* =========================================
            CONTENT
        ========================================= */}

        <section className="dashboard-content">

          {/* =========================================
              UPCOMING SESSIONS
          ========================================= */}

          <div className="dashboard-main-card">

            <div className="dashboard-card-header">

              <div>

                <h2>
                  Upcoming Sessions
                </h2>

                <p>
                  Your scheduled mentoring sessions
                  will appear here.
                </p>

              </div>

              <Link to="/my-bookings">
                View Bookings →
              </Link>

            </div>


            {loadingBookings ? (

              <div className="dashboard-empty">

                <div className="dashboard-empty-icon">
                  ⏳
                </div>

                <h3>
                  Loading sessions...
                </h3>

                <p>
                  Checking your upcoming mentoring
                  sessions.
                </p>

              </div>

            ) : upcomingBookings.length === 0 ? (

              <div className="dashboard-empty">

                <div className="dashboard-empty-icon">
                  📅
                </div>

                <h3>
                  No upcoming sessions
                </h3>

                <p>
                  You don't have any upcoming
                  mentoring sessions.
                </p>

              </div>

            ) : (

              <div className="mentor-upcoming-list">

                {upcomingBookings.map(
                  (booking) => (

                    <div
                      className="mentor-session-item"
                      key={booking.id}
                    >

                      {/* DATE & TIME */}

                      <div className="mentor-session-date">

                        <div className="mentor-session-icon">
                          📅
                        </div>

                        <div className="mentor-session-date-info">

                          <strong>
                            {formatDate(
                              booking.bookingDate
                            )}
                          </strong>

                          <span>
                            {formatTime(
                              booking.bookingTime
                            )}
                          </span>

                        </div>

                      </div>


                      {/* STUDENT */}

                      <div className="mentor-session-student">

                        <strong>
                          {booking.studentName}
                        </strong>

                        <span>
                          👨‍🎓 Student
                        </span>

                      </div>


                      {/* SESSION DETAILS */}

                      <div className="mentor-session-details">

                        <span>
                          ⏱{" "}
                          {booking.durationMinutes}{" "}
                          min
                        </span>

                        <span>
                          🎥{" "}
                          {booking.sessionType}
                        </span>

                        <span className="mentor-session-status">
                          ✓ {booking.status}
                        </span>

                      </div>


                      {/* ACTIONS */}

                      <div className="mentor-session-actions">

                        {!isSessionStarted(
                          booking.id
                        ) ? (

                          <button
                            type="button"
                            className="mentor-start-session-button"
                            onClick={() =>
                              handleStartSession(
                                booking
                              )
                            }
                          >
                            ▶ Start Session
                          </button>

                        ) : (

                          <>

                            <div className="mentor-session-started-panel">

                              <span className="mentor-session-started-label">
                                SESSION STARTED
                              </span>

                              <strong>
                                ✓ Session Started
                              </strong>

                              <p>
                                Session started successfully.
                              </p>

                              <p>
                                You can now join the meeting.
                              </p>

                            </div>

                            <div className="mentor-session-active-status">

                              <span>
                                ●
                              </span>

                              Session Active

                            </div>

                            <button
                              type="button"
                              className="mentor-join-button"
                              onClick={() =>
                                navigate(
                                  "/session",
                                  {
                                    state: {
                                      booking:
                                        booking,
                                    },
                                  }
                                )
                              }
                            >
                              🎥 Join Session →
                            </button>

                          </>

                        )}

                        <Link
                          to="/my-bookings"
                          className="mentor-view-booking-button"
                        >
                          View Booking
                        </Link>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* =========================================
              QUICK ACTIONS
          ========================================= */}

          <aside className="dashboard-side-card">

            <h2>
              Quick Actions
            </h2>

            <Link to="/my-bookings">

              📅

              <span>

                View Bookings

                <small>
                  Manage your sessions
                </small>

              </span>

            </Link>


            <Link to="/explore-skills">

              🔎

              <span>

                Explore Skills

                <small>
                  Browse learning skills
                </small>

              </span>

            </Link>


            <Link to="/mentor/arun-kumar">

              👤

              <span>

                View My Profile

                <small>
                  See your mentor profile
                </small>

              </span>

            </Link>

          </aside>

        </section>


        {/* =========================================
            RECENT BOOKINGS
        ========================================= */}

        <section className="mentor-bookings-card">

          <div className="mentor-bookings-header">

            <div>

              <p className="dashboard-eyebrow">
                BOOKING MANAGEMENT
              </p>

              <h2>
                Recent Bookings
              </h2>

              <p>
                Review your latest student bookings
                and session details.
              </p>

            </div>

            <Link
              to="/my-bookings"
              className="mentor-bookings-view-all"
            >
              View All →
            </Link>

          </div>


          {/* BOOKING STATUS SUMMARY */}

          <div className="mentor-booking-summary">

            <button
              type="button"
              className={`mentor-filter-card ${
                bookingFilter === "ALL"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setBookingFilter("ALL")
              }
            >

              <span>
                📋
              </span>

              <div>

                <small>
                  All Bookings
                </small>

                <strong>
                  {bookings.length}
                </strong>

              </div>

            </button>


            <button
              type="button"
              className={`mentor-filter-card ${
                bookingFilter === "CONFIRMED"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setBookingFilter("CONFIRMED")
              }
            >

              <span>
                ✓
              </span>

              <div>

                <small>
                  Confirmed
                </small>

                <strong>
                  {confirmedBookings.length}
                </strong>

              </div>

            </button>


            <button
              type="button"
              className={`mentor-filter-card ${
                bookingFilter === "PENDING"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setBookingFilter("PENDING")
              }
            >

              <span>
                ⏳
              </span>

              <div>

                <small>
                  Pending
                </small>

                <strong>
                  {pendingBookings.length}
                </strong>

              </div>

            </button>


            <button
              type="button"
              className={`mentor-filter-card ${
                bookingFilter === "CANCELLED"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setBookingFilter("CANCELLED")
              }
            >

              <span>
                ✕
              </span>

              <div>

                <small>
                  Cancelled
                </small>

                <strong>
                  {cancelledBookings.length}
                </strong>

              </div>

            </button>

          </div>


          {/* BOOKINGS */}

          {loadingBookings ? (

            <div className="mentor-bookings-empty">

              <div className="dashboard-empty-icon">
                ⏳
              </div>

              <h3>
                Loading bookings...
              </h3>

              <p>
                Checking your student bookings.
              </p>

            </div>

          ) : filteredBookings.length === 0 ? (

            <div className="mentor-bookings-empty">

              <div className="dashboard-empty-icon">
                📋
              </div>

              <h3>
                {bookingFilter === "ALL"
                  ? "No bookings yet"
                  : `No ${bookingFilter.toLowerCase()} bookings`}
              </h3>

              <p>
                There are no bookings available
                for this status.
              </p>

            </div>

          ) : (

            <div className="mentor-bookings-list">

              {filteredBookings
                .slice()
                .sort((a, b) => {

                  const dateA = new Date(
                    `${a.bookingDate}T${a.bookingTime}`
                  );

                  const dateB = new Date(
                    `${b.bookingDate}T${b.bookingTime}`
                  );

                  return dateB - dateA;

                })
                .slice(0, 5)
                .map((booking) => (

                  <div
                    className="mentor-booking-row"
                    key={booking.id}
                  >

                    {/* STUDENT */}

                    <div className="mentor-booking-student">

                      <div className="mentor-booking-avatar">

                        {booking.studentName
                          ? booking.studentName
                              .charAt(0)
                              .toUpperCase()
                          : "S"}

                      </div>

                      <div>

                        <strong>
                          {booking.studentName ||
                            "Student"}
                        </strong>

                        <span>
                          Student
                        </span>

                      </div>

                    </div>


                    {/* DATE */}

                    <div className="mentor-booking-info">

                      <small>
                        Date
                      </small>

                      <strong>
                        {formatDate(
                          booking.bookingDate
                        )}
                      </strong>

                    </div>


                    {/* TIME */}

                    <div className="mentor-booking-info">

                      <small>
                        Time
                      </small>

                      <strong>
                        {formatTime(
                          booking.bookingTime
                        )}
                      </strong>

                    </div>


                    {/* SESSION */}

                    <div className="mentor-booking-info">

                      <small>
                        Session
                      </small>

                      <strong>
                        {booking.sessionType}
                      </strong>

                    </div>


                    {/* STATUS */}

                    <div className="mentor-booking-status-wrapper">

                      <span
                        className={`mentor-booking-status ${
                          (
                            booking.status || ""
                          ).toLowerCase()
                        }`}
                      >

                        {booking.status ===
                          "CONFIRMED" &&
                          "✓ "}

                        {booking.status ===
                          "PENDING" &&
                          "⏳ "}

                        {booking.status ===
                          "CANCELLED" &&
                          "✕ "}

                        {booking.status}

                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>


        {/* =========================================
            STUDENT REVIEWS
        ========================================= */}

        <section className="mentor-reviews-card">

          <div className="mentor-reviews-header">

            <div>

              <p className="dashboard-eyebrow">
                STUDENT FEEDBACK
              </p>

              <h2>
                Student Reviews
              </h2>

              <p>
                See what students are saying about your
                mentoring sessions.
              </p>

            </div>

            <div className="mentor-reviews-summary">

              <strong>
                ⭐ {averageRating}
              </strong>

              <span>
                {totalReviews}{" "}
                {totalReviews === 1
                  ? "review"
                  : "reviews"}
              </span>

            </div>

          </div>


          {/* REVIEW LOADING */}

          {loadingReviews ? (

            <div className="mentor-reviews-empty">

              <div className="dashboard-empty-icon">
                ⏳
              </div>

              <h3>
                Loading reviews...
              </h3>

              <p>
                Fetching student feedback.
              </p>

            </div>

          ) : reviews.length === 0 ? (

            /* NO REVIEWS */

            <div className="mentor-reviews-empty">

              <div className="dashboard-empty-icon">
                ⭐
              </div>

              <h3>
                No reviews yet
              </h3>

              <p>
                Student reviews will appear here after
                completed sessions.
              </p>

            </div>

          ) : (

            /* REVIEW LIST */

            <div className="mentor-reviews-list">

              {reviews
                .slice()
                .sort((a, b) => {

                  const dateA = new Date(
                    a.createdAt || 0
                  );

                  const dateB = new Date(
                    b.createdAt || 0
                  );

                  return dateB - dateA;

                })
                .map((review) => {

                  const rating = Math.min(
                    5,
                    Math.max(
                      0,
                      Number(
                        review.rating || 0
                      )
                    )
                  );

                  const studentName =
                    review.studentName ||
                    "Student";

                  return (

                    <div
                      className="mentor-review-item"
                      key={review.id}
                    >

                      <div className="mentor-review-top">

                        <div className="mentor-review-student">

                          <div className="mentor-review-avatar">

                            {studentName
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {studentName}
                            </strong>

                            <span>
                              Booking #{review.bookingId}
                            </span>

                          </div>

                        </div>


                        <div className="mentor-review-rating">

                          <span>
                            {Array.from({
                              length: 5,
                            }).map(
                              (_, index) => (
                                <span
                                  key={index}
                                  style={{
                                    opacity:
                                      index <
                                      rating
                                        ? 1
                                        : 0.25,
                                  }}
                                >
                                  ★
                                </span>
                              )
                            )}
                          </span>

                          <strong>
                            {rating.toFixed(1)}
                          </strong>

                        </div>

                      </div>


                      <p className="mentor-review-comment">

                        {review.comment ||
                          "No written feedback provided."}

                      </p>


                      {review.createdAt && (

                        <div className="mentor-review-date">

                          {new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}

                        </div>

                      )}

                    </div>

                  );

                })}

            </div>

          )}

        </section>


        
{/* =========================================
    STUDY MATERIALS MANAGEMENT
========================================= */}

<section className="mentor-materials-card">
  <div className="mentor-materials-header">
    <div>
      <p className="dashboard-eyebrow">LEARNING RESOURCES</p>
      <h2>Study Materials</h2>
      <p>
        Share PDFs, notes, presentations, links and assignments
        with your students.
      </p>
    </div>
  </div>

  {/* STATUS MESSAGES */}

  {materialError && (
    <p role="alert" className="mentor-material-error">
      {materialError}
    </p>
  )}

  {materialMessage && (
    <p role="status" className="mentor-material-success">
      {materialMessage}
    </p>
  )}

  {/* ADD / EDIT FORM */}

  <form
    className="mentor-material-form"
    onSubmit={handleMaterialSubmit}
  >
    <h3>
      {editingMaterialId !== null
        ? "Edit Study Material"
        : "Add New Study Material"}
    </h3>

    <div className="mentor-material-field">
      <label htmlFor="material-title">Material Title *</label>
      <input
        id="material-title"
        name="title"
        type="text"
        placeholder="e.g. Java Basics"
        value={materialForm.title}
        onChange={handleMaterialChange}
        required
      />
    </div>

    <div className="mentor-material-field">
      <label htmlFor="material-description">Description</label>
      <textarea
        id="material-description"
        name="description"
        placeholder="Describe what students will learn..."
        value={materialForm.description}
        onChange={handleMaterialChange}
        rows={3}
      />
    </div>

    <div className="mentor-material-field">
      <label htmlFor="material-type">Resource Type *</label>
      <select
        id="material-type"
        name="materialType"
        value={materialForm.materialType}
        onChange={handleMaterialChange}
        required
      >
        <option value="PDF">PDF</option>
        <option value="NOTES">Notes</option>
        <option value="PPT">Presentation (PPT)</option>
        <option value="LINK">External Link</option>
        <option value="ASSIGNMENT">Assignment</option>
      </select>
    </div>

    <div className="mentor-material-field">
      <label htmlFor="material-url">Resource URL *</label>
      <input
        id="material-url"
        name="resourceUrl"
        type="url"
        placeholder="https://example.com/java-basics.pdf"
        value={materialForm.resourceUrl}
        onChange={handleMaterialChange}
        required
      />
      <small>
        Enter a publicly accessible resource link, such as a hosted
        PDF or a shareable Google Drive link.
      </small>
    </div>

    <div className="mentor-material-form-actions">
      <button
        type="submit"
        disabled={savingMaterial}
        className="mentor-material-save-button"
      >
        {savingMaterial
          ? "Saving..."
          : editingMaterialId !== null
            ? "Update Material"
            : "Add Material"}
      </button>

      {editingMaterialId !== null && (
        <button
          type="button"
          className="mentor-material-cancel-button"
          onClick={resetMaterialForm}
        >
          Cancel Edit
        </button>
      )}
    </div>
  </form>

  {/* MATERIAL LIST */}

  <div className="mentor-material-list-header">
    <h3>Your Resources</h3>
    <span>{studyMaterials.length} materials</span>
  </div>

  {loadingMaterials ? (
    <div className="mentor-material-empty">
      Loading study materials...
    </div>
  ) : studyMaterials.length === 0 ? (
    <div className="mentor-material-empty">
      <div className="dashboard-empty-icon">📚</div>
      <h3>No study materials yet</h3>
      <p>
        Add your first resource using the form above.
      </p>
    </div>
  ) : (
    <div className="mentor-material-list">
      {studyMaterials.map((material) => (
        <article
          className="mentor-material-item"
          key={material.id}
        >
          <div className="mentor-material-icon">
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

          <div className="mentor-material-info">
            <span className="mentor-material-type">
              {material.materialType}
            </span>

            <h4>{material.title}</h4>

            <p>
              {material.description || "No description provided."}
            </p>

            {material.createdAt && (
              <small>
                Added{" "}
                {new Date(material.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </small>
            )}
          </div>

          <div className="mentor-material-actions">
            <a
              className="mentor-material-open-button"
              href={material.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open ↗
            </a>

            <button
  type="button"
  className="mentor-material-edit-button"
  onClick={() => {
    console.log("EDIT BUTTON CLICKED");
    console.log("Selected material:", material);
    handleEditMaterial(material);
  }}
>
  Edit
</button>

            <button
              type="button"
              className="mentor-material-delete-button"
              onClick={() => handleDeleteMaterial(material.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )}
</section>


        {/* =========================================
            MENTOR AVAILABILITY
        ========================================= */}

        <section className="mentor-availability-card">

          <div className="mentor-availability-header">

            <div>

              <p className="dashboard-eyebrow">
                AVAILABILITY
              </p>

              <h2>
                Teaching Availability
              </h2>

              <p>
                Set the days and times when students
                can book your sessions.
              </p>

            </div>

            <button
              type="button"
              className="mentor-add-availability-button"
              onClick={() => {

                setEditingAvailabilityId(
                  null
                );

                setNewAvailability({
                  day: "Monday",
                  startTime: "09:00",
                  endTime: "10:00",
                });

                setShowAvailabilityForm(
                  true
                );

              }}
            >
              + Add Availability
            </button>

          </div>


          {/* =========================================
              AVAILABILITY FORM
          ========================================= */}

          {showAvailabilityForm && (

            <form
              className="mentor-availability-form"
              onSubmit={
                editingAvailabilityId !==
                null
                  ? handleUpdateAvailability
                  : handleAddAvailability
              }
            >

              <div className="mentor-availability-form-title">

                <strong>

                  {editingAvailabilityId !==
                  null
                    ? "Edit Availability"
                    : "Add Availability"}

                </strong>

                <span>

                  {editingAvailabilityId !==
                  null
                    ? "Update your teaching schedule."
                    : "Set a new weekly teaching schedule."}

                </span>

              </div>


              {/* DAY */}

              <div className="mentor-availability-form-field">

                <label>
                  Day
                </label>

                <select
                  value={
                    newAvailability.day
                  }
                  onChange={(event) =>
                    setNewAvailability({
                      ...newAvailability,
                      day:
                        event.target.value,
                    })
                  }
                >

                  <option value="Monday">
                    Monday
                  </option>

                  <option value="Tuesday">
                    Tuesday
                  </option>

                  <option value="Wednesday">
                    Wednesday
                  </option>

                  <option value="Thursday">
                    Thursday
                  </option>

                  <option value="Friday">
                    Friday
                  </option>

                  <option value="Saturday">
                    Saturday
                  </option>

                  <option value="Sunday">
                    Sunday
                  </option>

                </select>

              </div>


              {/* START TIME */}

              <div className="mentor-availability-form-field">

                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  value={
                    newAvailability.startTime
                  }
                  onChange={(event) =>
                    setNewAvailability({
                      ...newAvailability,
                      startTime:
                        event.target.value,
                    })
                  }
                />

              </div>


              {/* END TIME */}

              <div className="mentor-availability-form-field">

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  value={
                    newAvailability.endTime
                  }
                  onChange={(event) =>
                    setNewAvailability({
                      ...newAvailability,
                      endTime:
                        event.target.value,
                    })
                  }
                />

              </div>


              {/* FORM ACTIONS */}

              <div className="mentor-availability-form-actions">

                <button
                  type="submit"
                  className="mentor-save-availability-button"
                >

                  {editingAvailabilityId !==
                  null
                    ? "Update Availability"
                    : "Save Availability"}

                </button>


                <button
                  type="button"
                  className="mentor-cancel-availability-button"
                  onClick={
                    handleCancelAvailability
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          )}


          {/* =========================================
              AVAILABILITY LIST
          ========================================= */}

          <div className="mentor-availability-list">

            {availability.map((slot) => (

              <div
                className="mentor-availability-row"
                key={slot.id}
              >

                {/* DAY */}

                <div className="mentor-availability-day">

                  <div className="mentor-availability-icon">
                    📅
                  </div>

                  <div>

                    <strong>
                      {slot.day}
                    </strong>

                    <span>
                      Weekly availability
                    </span>

                  </div>

                </div>


                {/* TIME */}

                <div className="mentor-availability-time">

                  <small>
                    Available Time
                  </small>

                  <strong>
                    {slot.startTime} -{" "}
                    {slot.endTime}
                  </strong>

                </div>


                {/* STATUS */}

                <div className="mentor-availability-status">

                  <span
                    className={
                      slot.isAvailable
                        ? "availability-status-available"
                        : "availability-status-unavailable"
                    }
                  >

                    {slot.isAvailable
                      ? "● Available"
                      : "○ Unavailable"}

                  </span>

                </div>


                {/* ACTIONS */}

                <div className="mentor-availability-actions">

                  <button
                    type="button"
                    className="mentor-availability-toggle"
                    onClick={() =>
                      handleToggleAvailability(
                        slot.id
                      )
                    }
                  >

                    {slot.isAvailable
                      ? "Disable"
                      : "Enable"}

                  </button>

                  <button
                    type="button"
                    className="mentor-availability-edit"
                    onClick={() =>
                      handleEditAvailability(
                        slot
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="mentor-availability-delete"
                    onClick={() =>
                      handleDeleteAvailability(
                        slot.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

        

      </main>

    </div>
  );
}

export default MentorDashboard;