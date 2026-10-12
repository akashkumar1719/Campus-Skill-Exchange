import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import "./SessionPage.css";

function SessionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  const SESSION_STARTED_STORAGE_KEY =
    "campus_skill_exchange_started_sessions";

  const ATTENDANCE_STORAGE_KEY =
    "campus_skill_exchange_attendance";

  const SESSION_COMPLETED_STORAGE_KEY =
    "campus_skill_exchange_completed_sessions";

  const SESSION_NOTES_STORAGE_KEY =
    "campus_skill_exchange_session_notes";

  // =====================================================
  // SESSION STARTED STATE
  // =====================================================

  const [sessionStarted, setSessionStarted] = useState(() => {
    if (!booking?.id) {
      return false;
    }

    try {
      const savedSessions = localStorage.getItem(
        SESSION_STARTED_STORAGE_KEY
      );

      const startedSessions = savedSessions
        ? JSON.parse(savedSessions)
        : {};

      return Boolean(startedSessions[String(booking.id)]);
    } catch (error) {
      console.error(
        "Error loading session status:",
        error
      );

      return false;
    }
  });

  const [sessionMessage, setSessionMessage] =
    useState("");

  // =====================================================
  // SESSION COMPLETED STATE
  // =====================================================

  const [sessionCompleted, setSessionCompleted] =
    useState(() => {
      if (!booking?.id) {
        return false;
      }

      try {
        const savedCompletedSessions =
          localStorage.getItem(
            SESSION_COMPLETED_STORAGE_KEY
          );

        const completedSessions =
          savedCompletedSessions
            ? JSON.parse(savedCompletedSessions)
            : {};

        return Boolean(
          completedSessions[String(booking.id)]
        );
      } catch (error) {
        console.error(
          "Error loading completed session status:",
          error
        );

        return false;
      }
    });

  // =====================================================
  // ATTENDANCE STATE
  // =====================================================

  const [attendanceStatus, setAttendanceStatus] =
    useState("");

  const [selectedAttendance, setSelectedAttendance] =
    useState("");

  const [attendanceMessage, setAttendanceMessage] =
    useState("");

  const [attendanceUpdating, setAttendanceUpdating] =
    useState(false);

  // =====================================================
  // LOAD ATTENDANCE FROM BACKEND
  // =====================================================

  useEffect(() => {
    if (!booking?.id) {
      return;
    }

    const loadAttendance = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/attendance/booking/${booking.id}`
        );

        // No attendance has been marked yet
        if (response.status === 404) {
          setAttendanceStatus("");
          setSelectedAttendance("");
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load attendance."
          );
        }

        const attendance =
          await response.json();

        const displayStatus =
          attendance.status === "PRESENT"
            ? "Present"
            : attendance.status === "ABSENT"
            ? "Absent"
            : "";

        setAttendanceStatus(displayStatus);

        console.log(
          "Attendance loaded from backend:",
          attendance
        );
      } catch (error) {
        console.error(
          "Error loading attendance:",
          error
        );
      }
    };

    loadAttendance();
  }, [booking?.id]);

  // =====================================================
  // SESSION NOTES STATE
  // =====================================================

  const [sessionNotes, setSessionNotes] =
    useState("");

  const [savedNotes, setSavedNotes] =
    useState("");

  const [notesMessage, setNotesMessage] =
    useState("");

  // =====================================================
  // LOAD SESSION NOTES
  // =====================================================

  useEffect(() => {
    if (!booking?.id) {
      return;
    }

    try {
      const savedNotesData =
        localStorage.getItem(
          SESSION_NOTES_STORAGE_KEY
        );

      const notesData = savedNotesData
        ? JSON.parse(savedNotesData)
        : {};

      const existingNotes =
        notesData[String(booking.id)] || "";

      setSessionNotes(existingNotes);
      setSavedNotes(existingNotes);
    } catch (error) {
      console.error(
        "Error loading session notes:",
        error
      );
    }
  }, [booking?.id]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] =
      time.split(":");

    const hour = parseInt(hours, 10);

    const modifier =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 || 12;

    return `${displayHour}:${minutes} ${modifier}`;
  };

  // =====================================================
  // FORMAT MENTOR NAME
  // =====================================================

  const formatMentorName = (slug) => {
    if (!slug) return "Mentor";

    return slug
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  // =====================================================
  // SESSION NOT FOUND
  // =====================================================

  if (!booking) {
    return (
      <div className="session-page">
        <div className="session-container">
          <div className="session-empty">

            <div className="session-empty-icon">
              📹
            </div>

            <h1>
              Session Not Found
            </h1>

            <p>
              We couldn't find the booking
              information for this session.
            </p>

            <button
              className="session-back-button"
              onClick={() =>
                navigate("/my-bookings")
              }
            >
              ← Back to My Bookings
            </button>

          </div>
        </div>
      </div>
    );
  }

  const mentorName =
    formatMentorName(
      booking.mentorSlug
    );

  const mentorInitials =
    mentorName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  // =====================================================
  // START SESSION
  // =====================================================

  const handleStartSession = () => {
    if (sessionCompleted) {
      return;
    }

    setSessionStarted(true);

    setSessionMessage(
      "Session started successfully. You can now join the meeting."
    );

    try {
      const savedSessions =
        localStorage.getItem(
          SESSION_STARTED_STORAGE_KEY
        );

      const startedSessions =
        savedSessions
          ? JSON.parse(savedSessions)
          : {};

      const updatedSessions = {
        ...startedSessions,
        [String(booking.id)]: true,
      };

      localStorage.setItem(
        SESSION_STARTED_STORAGE_KEY,
        JSON.stringify(updatedSessions)
      );
    } catch (error) {
      console.error(
        "Error saving session status:",
        error
      );
    }
  };

  // =====================================================
  // MARK / UPDATE ATTENDANCE
  // =====================================================

  const handleMarkAttendance = async () => {
    if (!selectedAttendance) {
      setAttendanceMessage(
        "Please select Present or Absent."
      );

      return;
    }

    if (!booking?.id) {
      setAttendanceMessage(
        "Booking information is missing."
      );

      return;
    }

    try {
      setAttendanceUpdating(true);
      setAttendanceMessage("");

      const attendanceStatusValue =
        selectedAttendance.toUpperCase();

      const attendanceData = {
        bookingId: booking.id,
        studentName: booking.studentName,
        mentorSlug: booking.mentorSlug,
        status: attendanceStatusValue,
      };

      // Check whether attendance already exists
      const checkResponse = await fetch(
        `http://localhost:8080/api/attendance/booking/${booking.id}`
      );

      let response;

      if (checkResponse.ok) {
        // =================================================
        // EXISTING ATTENDANCE → UPDATE
        // =================================================

        response = await fetch(
          `http://localhost:8080/api/attendance/booking/${booking.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              studentName:
                booking.studentName,

              mentorSlug:
                booking.mentorSlug,

              status:
                attendanceStatusValue,
            }),
          }
        );
      } else if (
        checkResponse.status === 404
      ) {
        // =================================================
        // NO ATTENDANCE → CREATE
        // =================================================

        response = await fetch(
          "http://localhost:8080/api/attendance",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              attendanceData
            ),
          }
        );
      } else {
        throw new Error(
          "Unable to check existing attendance."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Failed to save attendance."
        );
      }

      const savedAttendance =
        await response.json();

      const displayStatus =
        savedAttendance.status === "PRESENT"
          ? "Present"
          : savedAttendance.status ===
            "ABSENT"
          ? "Absent"
          : savedAttendance.status;

      // Update current UI
      setAttendanceStatus(
        displayStatus
      );

      setAttendanceMessage(
        `Attendance updated successfully to ${displayStatus}.`
      );

      // Clear selection after successful update
      setSelectedAttendance("");

      console.log(
        "Attendance saved successfully:",
        savedAttendance
      );
    } catch (error) {
      console.error(
        "Error saving attendance:",
        error
      );

      setAttendanceMessage(
        "Unable to save attendance. Please try again."
      );
    } finally {
      setAttendanceUpdating(false);
    }
  };

  // =====================================================
  // COMPLETE SESSION
  // =====================================================

  const handleCompleteSession = () => {
    if (!sessionStarted) {
      alert(
        "The session has not been started yet."
      );

      return;
    }

    if (sessionCompleted) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to complete this session?"
    );

    if (!confirmed) {
      return;
    }

    setSessionCompleted(true);

    try {
      const savedCompletedSessions =
        localStorage.getItem(
          SESSION_COMPLETED_STORAGE_KEY
        );

      const completedSessions =
        savedCompletedSessions
          ? JSON.parse(savedCompletedSessions)
          : {};

      const updatedCompletedSessions = {
        ...completedSessions,
        [String(booking.id)]: true,
      };

      localStorage.setItem(
        SESSION_COMPLETED_STORAGE_KEY,
        JSON.stringify(
          updatedCompletedSessions
        )
      );
    } catch (error) {
      console.error(
        "Error saving completed session status:",
        error
      );
    }
  };

  // =====================================================
  // SAVE SESSION NOTES
  // =====================================================

  const handleSaveNotes = () => {
    if (!booking?.id) {
      return;
    }

    const trimmedNotes =
      sessionNotes.trim();

    if (!trimmedNotes) {
      setNotesMessage(
        "Please enter some notes before saving."
      );

      return;
    }

    try {
      const savedNotesData =
        localStorage.getItem(
          SESSION_NOTES_STORAGE_KEY
        );

      const notesData = savedNotesData
        ? JSON.parse(savedNotesData)
        : {};

      const updatedNotes = {
        ...notesData,
        [String(booking.id)]:
          trimmedNotes,
      };

      localStorage.setItem(
        SESSION_NOTES_STORAGE_KEY,
        JSON.stringify(updatedNotes)
      );

      setSessionNotes(trimmedNotes);
      setSavedNotes(trimmedNotes);

      setNotesMessage(
        "Session notes saved successfully."
      );
    } catch (error) {
      console.error(
        "Error saving session notes:",
        error
      );

      setNotesMessage(
        "Unable to save session notes. Please try again."
      );
    }
  };

  // =====================================================
  // ATTENDANCE CLASS
  // =====================================================

  const getAttendanceClass = () => {
    if (attendanceStatus === "Present") {
      return "attendance-present";
    }

    if (attendanceStatus === "Absent") {
      return "attendance-absent";
    }

    return "";
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="session-page">

      <div className="session-container">

        {/* =========================================
            SESSION HEADER
        ========================================== */}

        <div className="session-header">

          <button
            className="session-back-link"
            onClick={() =>
              navigate("/my-bookings")
            }
          >
            ← My Bookings
          </button>

          <div>

            <p className="page-eyebrow">
              LEARNING SESSION
            </p>

            <h1>
              Mentor Session
            </h1>

            <p>
              Your scheduled learning session
              with your mentor.
            </p>

          </div>

        </div>

        {/* =========================================
            SESSION CARD
        ========================================== */}

        <div className="session-card">

          {/* =========================================
              MENTOR HEADER
          ========================================== */}

          <div className="session-card-header">

            <div className="session-mentor">

              <div className="session-avatar">
                {mentorInitials}
              </div>

              <div>

                <span>
                  Mentor
                </span>

                <h2>
                  {mentorName}
                </h2>

              </div>

            </div>

            <span
              className={`session-status ${
                sessionCompleted
                  ? "completed"
                  : sessionStarted
                  ? "started"
                  : booking.status ===
                    "CONFIRMED"
                  ? "confirmed"
                  : booking.status ===
                    "CANCELLED"
                  ? "cancelled"
                  : ""
              }`}
            >
              {sessionCompleted
                ? "SESSION COMPLETED"
                : sessionStarted
                ? "SESSION STARTED"
                : booking.status}
            </span>

          </div>

          {/* =========================================
              SESSION DETAILS
          ========================================== */}

          <div className="session-details">

            <div className="session-detail">

              <span>
                📅
              </span>

              <div>

                <small>
                  Date
                </small>

                <strong>
                  {formatDate(
                    booking.bookingDate
                  )}
                </strong>

              </div>

            </div>

            <div className="session-detail">

              <span>
                🕐
              </span>

              <div>

                <small>
                  Time
                </small>

                <strong>
                  {formatTime(
                    booking.bookingTime
                  )}
                </strong>

              </div>

            </div>

            <div className="session-detail">

              <span>
                ⏱️
              </span>

              <div>

                <small>
                  Duration
                </small>

                <strong>
                  {booking.durationMinutes}{" "}
                  minutes
                </strong>

              </div>

            </div>

            <div className="session-detail">

              <span>
                🎥
              </span>

              <div>

                <small>
                  Session Type
                </small>

                <strong>
                  {booking.sessionType ||
                    "Video Call"}
                </strong>

              </div>

            </div>

          </div>

          {/* =========================================
              BOOKING INFORMATION
          ========================================== */}

          <div className="booking-information">

            <div>

              <span>
                Booking ID
              </span>

              <strong>
                #{booking.id}
              </strong>

            </div>

            <div>

              <span>
                Student
              </span>

              <strong>
                {booking.studentName}
              </strong>

            </div>

            <div>

              <span>
                Status
              </span>

              <strong>
                {sessionCompleted
                  ? "SESSION COMPLETED"
                  : sessionStarted
                  ? "SESSION STARTED"
                  : booking.status}
              </strong>

            </div>

          </div>

          {/* =========================================
              START SESSION ACTION
          ========================================== */}

          {booking.status ===
            "CONFIRMED" &&
            !sessionStarted &&
            !sessionCompleted && (
              <div className="session-action-area">

                <div>

                  <h3>
                    Ready to start?
                  </h3>

                  <p>
                    Start the session when
                    you are ready to begin
                    your learning session.
                  </p>

                </div>

                <button
                  type="button"
                  className="start-session-button"
                  onClick={
                    handleStartSession
                  }
                >
                  ▶ Start Session
                </button>

              </div>
            )}

          {/* =========================================
              SESSION STARTED MESSAGE
          ========================================== */}

          {sessionStarted &&
            !sessionCompleted && (
              <div className="session-started-message">

                <div className="session-started-icon">
                  ✓
                </div>

                <div>

                  <h3>
                    Session Started
                  </h3>

                  <p>
                    {sessionMessage ||
                      "Session started successfully. You can now join the meeting."}
                  </p>

                </div>

              </div>
            )}

          {/* =========================================
              ATTENDANCE
          ========================================== */}

          {sessionStarted && (
            <div
              className="attendance-section"
              style={{
                marginTop: "24px",
                padding: "24px",
                border:
                  "1px solid #e5e7eb",
                borderRadius: "16px",
                background:
                  "#ffffff",
              }}
            >

              <div
                style={{
                  marginBottom:
                    "18px",
                }}
              >

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing:
                      "1.5px",
                    color:
                      "#6b7280",
                  }}
                >
                  ATTENDANCE
                </span>

                <h3
                  style={{
                    margin:
                      "6px 0 4px",
                    fontSize: "22px",
                  }}
                >
                  Mark Attendance
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#6b7280",
                  }}
                >
                  Record attendance for{" "}
                  <strong>
                    {booking.studentName}
                  </strong>
                  .
                </p>

              </div>

              {/* =====================================
                  CURRENT ATTENDANCE
              ====================================== */}

              {attendanceStatus ? (
                <div>

                  <div
                    className={getAttendanceClass()}
                    style={{
                      padding:
                        "16px",
                      borderRadius:
                        "12px",
                      background:
                        attendanceStatus ===
                        "Present"
                          ? "#f0fdf4"
                          : "#fef2f2",
                      border:
                        attendanceStatus ===
                        "Present"
                          ? "1px solid #bbf7d0"
                          : "1px solid #fecaca",
                      marginBottom:
                        "18px",
                    }}
                  >

                    <strong
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "4px",
                        color:
                          attendanceStatus ===
                          "Present"
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      ✓ Attendance Marked
                    </strong>

                    <span>
                      {booking.studentName} —{" "}
                      <strong>
                        {attendanceStatus}
                      </strong>
                    </span>

                  </div>

                  {/* =================================
                      UPDATE ATTENDANCE
                  ================================== */}

                  <div>

                    <p
                      style={{
                        margin:
                          "0 0 12px",
                        fontWeight:
                          "700",
                        color:
                          "#374151",
                      }}
                    >
                      Change Attendance
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap:
                          "wrap",
                        marginBottom:
                          "14px",
                      }}
                    >

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAttendance(
                            "Present"
                          );
                          setAttendanceMessage(
                            ""
                          );
                        }}
                        style={{
                          padding:
                            "12px 20px",
                          borderRadius:
                            "10px",
                          border:
                            selectedAttendance ===
                            "Present"
                              ? "2px solid #16a34a"
                              : "1px solid #d1d5db",
                          background:
                            selectedAttendance ===
                            "Present"
                              ? "#f0fdf4"
                              : "#ffffff",
                          color:
                            "#166534",
                          fontWeight:
                            "600",
                          cursor:
                            "pointer",
                        }}
                      >
                        ✓ Present
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAttendance(
                            "Absent"
                          );
                          setAttendanceMessage(
                            ""
                          );
                        }}
                        style={{
                          padding:
                            "12px 20px",
                          borderRadius:
                            "10px",
                          border:
                            selectedAttendance ===
                            "Absent"
                              ? "2px solid #dc2626"
                              : "1px solid #d1d5db",
                          background:
                            selectedAttendance ===
                            "Absent"
                              ? "#fef2f2"
                              : "#ffffff",
                          color:
                            "#991b1b",
                          fontWeight:
                            "600",
                          cursor:
                            "pointer",
                        }}
                      >
                        ✕ Absent
                      </button>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleMarkAttendance
                      }
                      disabled={
                        !selectedAttendance ||
                        attendanceUpdating
                      }
                      style={{
                        padding:
                          "12px 22px",
                        border: "none",
                        borderRadius:
                          "10px",
                        background:
                          selectedAttendance &&
                          !attendanceUpdating
                            ? "#111827"
                            : "#d1d5db",
                        color:
                          "#ffffff",
                        fontWeight:
                          "700",
                        cursor:
                          selectedAttendance &&
                          !attendanceUpdating
                            ? "pointer"
                            : "not-allowed",
                      }}
                    >
                      {attendanceUpdating
                        ? "Updating..."
                        : "↻ Update Attendance"}
                    </button>

                    {attendanceMessage && (
                      <p
                        style={{
                          marginTop:
                            "12px",
                          marginBottom:
                            0,
                          color:
                            attendanceMessage.includes(
                              "Unable"
                            )
                              ? "#991b1b"
                              : "#166534",
                          fontWeight:
                            "600",
                        }}
                      >
                        {attendanceMessage}
                      </p>
                    )}

                  </div>

                </div>
              ) : (

                /* =================================
                   FIRST ATTENDANCE MARKING
                ================================== */

                <>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap:
                        "wrap",
                      marginBottom:
                        "18px",
                    }}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAttendance(
                          "Present"
                        )
                      }
                      style={{
                        padding:
                          "12px 20px",
                        borderRadius:
                          "10px",
                        border:
                          selectedAttendance ===
                          "Present"
                            ? "2px solid #16a34a"
                            : "1px solid #d1d5db",
                        background:
                          selectedAttendance ===
                          "Present"
                            ? "#f0fdf4"
                            : "#ffffff",
                        color:
                          "#166534",
                        fontWeight:
                          "600",
                        cursor:
                          "pointer",
                      }}
                    >
                      ✓ Present
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAttendance(
                          "Absent"
                        )
                      }
                      style={{
                        padding:
                          "12px 20px",
                        borderRadius:
                          "10px",
                        border:
                          selectedAttendance ===
                          "Absent"
                            ? "2px solid #dc2626"
                            : "1px solid #d1d5db",
                        background:
                          selectedAttendance ===
                          "Absent"
                            ? "#fef2f2"
                            : "#ffffff",
                        color:
                          "#991b1b",
                        fontWeight:
                          "600",
                        cursor:
                          "pointer",
                      }}
                    >
                      ✕ Absent
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleMarkAttendance
                    }
                    disabled={
                      !selectedAttendance ||
                      attendanceUpdating
                    }
                    style={{
                      padding:
                        "12px 22px",
                      border: "none",
                      borderRadius:
                        "10px",
                      background:
                        selectedAttendance &&
                        !attendanceUpdating
                          ? "#111827"
                          : "#d1d5db",
                      color:
                        "#ffffff",
                      fontWeight:
                        "700",
                      cursor:
                        selectedAttendance &&
                        !attendanceUpdating
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    {attendanceUpdating
                      ? "Saving..."
                      : "✓ Mark Attendance"}
                  </button>

                  {attendanceMessage && (
                    <p
                      style={{
                        marginTop:
                          "12px",
                        marginBottom:
                          0,
                        color:
                          attendanceMessage.includes(
                            "Unable"
                          )
                            ? "#991b1b"
                            : "#166534",
                        fontWeight:
                          "600",
                      }}
                    >
                      {attendanceMessage}
                    </p>
                  )}

                </>
              )}

            </div>
          )}

          {/* =========================================
              COMPLETE SESSION ACTION
          ========================================== */}

          {sessionStarted &&
            !sessionCompleted && (
              <div
                className="complete-session-area"
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "16px",
                  background:
                    "#ffffff",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  flexWrap:
                    "wrap",
                }}
              >

                <div>

                  <h3
                    style={{
                      margin:
                        "0 0 6px",
                      fontSize:
                        "18px",
                    }}
                  >
                    Session finished?
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color:
                        "#6b7280",
                    }}
                  >
                    Complete the session
                    after the learning
                    session has ended.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    handleCompleteSession
                  }
                  style={{
                    padding:
                      "12px 22px",
                    border: "none",
                    borderRadius:
                      "10px",
                    background:
                      "#111827",
                    color:
                      "#ffffff",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  ✓ Complete Session
                </button>

              </div>
            )}

          {/* =========================================
              SESSION COMPLETED MESSAGE
          ========================================== */}

          {sessionCompleted && (
            <div
              className="session-completed-message"
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius:
                  "16px",
                border:
                  "1px solid #bbf7d0",
                background:
                  "#f0fdf4",
                display: "flex",
                alignItems:
                  "center",
                gap: "14px",
              }}
            >

              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius:
                    "50%",
                  background:
                    "#16a34a",
                  color:
                    "#ffffff",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize:
                    "20px",
                  fontWeight:
                    "700",
                  flexShrink: 0,
                }}
              >
                ✓
              </div>

              <div>

                <h3
                  style={{
                    margin:
                      "0 0 5px",
                    color:
                      "#166534",
                  }}
                >
                  Session Completed
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#166534",
                  }}
                >
                  This learning session
                  has been completed
                  successfully.
                </p>

              </div>

            </div>
          )}

          {/* =========================================
              SESSION NOTES
          ========================================== */}

          {sessionStarted && (
            <div className="session-notes-section">

              <div className="session-notes-header">

                <div>

                  <span className="notes-eyebrow">
                    SESSION NOTES
                  </span>

                  <h3>
                    📝 Session Notes
                  </h3>

                  <p>
                    Add notes about this learning session.
                  </p>

                </div>

              </div>

              <textarea
                className="session-notes-textarea"
                value={sessionNotes}
                onChange={(event) => {
                  setSessionNotes(
                    event.target.value
                  );

                  setNotesMessage("");
                }}
                placeholder="Add notes about this learning session..."
                rows={6}
              />

              <div className="session-notes-actions">

                <button
                  type="button"
                  className="save-notes-button"
                  onClick={
                    handleSaveNotes
                  }
                >
                  💾 Save Notes
                </button>

              </div>

              {notesMessage && (
                <div className="session-notes-message">
                  {notesMessage}
                </div>
              )}

              {savedNotes && (
                <div className="saved-notes-card">

                  <div className="saved-notes-icon">
                    ✓
                  </div>

                  <div>

                    <h4>
                      Notes Saved
                    </h4>

                    <p>
                      {savedNotes}
                    </p>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* =========================================
              MEETING AREA
          ========================================== */}

          <div className="meeting-area">

            {/* Meeting Header */}

            <div className="meeting-area-header">

              <div>

                <span className="meeting-eyebrow">
                  LIVE SESSION
                </span>

                <h2>
                  Meeting Room
                </h2>

                <p>
                  Your online learning session
                  will take place here.
                </p>

              </div>

              <span className="meeting-ready-badge">

                {sessionCompleted
                  ? "● Session Completed"
                  : sessionStarted
                  ? "● Session Active"
                  : "● Ready"}

              </span>

            </div>

            {/* Meeting Screen */}

            <div className="meeting-screen">

              <div className="meeting-screen-content">

                <div className="meeting-icon">
                  📹
                </div>

                <h3>

                  {sessionCompleted
                    ? "Session has ended"
                    : sessionStarted
                    ? "Session is now active"
                    : "Your meeting will appear here"}

                </h3>

                <p>

                  {sessionCompleted
                    ? "The meeting is no longer active."
                    : sessionStarted
                    ? "The meeting area is ready for the mentor and student."
                    : "The video meeting area is ready for your upcoming learning session."}

                </p>

                {!sessionStarted &&
                  !sessionCompleted && (
                    <span>
                      Meeting integration will be
                      connected in a later step.
                    </span>
                  )}

              </div>

              {/* Meeting Controls */}

              <div className="meeting-controls">

                <button
                  className="meeting-control-button"
                  type="button"
                  title="Microphone"
                  disabled={
                    !sessionStarted ||
                    sessionCompleted
                  }
                >
                  🎤
                </button>

                <button
                  className="meeting-control-button"
                  type="button"
                  title="Camera"
                  disabled={
                    !sessionStarted ||
                    sessionCompleted
                  }
                >
                  📹
                </button>

                <button
                  className="meeting-control-button"
                  type="button"
                  title="Chat"
                  disabled={
                    !sessionStarted ||
                    sessionCompleted
                  }
                >
                  💬
                </button>

                <button
                  className="meeting-control-button leave"
                  type="button"
                  title="Leave Session"
                  onClick={() =>
                    navigate(
                      "/my-bookings"
                    )
                  }
                >
                  📞
                </button>

              </div>

            </div>

            {/* Meeting Footer */}

            <div className="meeting-footer">

              <div className="meeting-participant">

                <div className="participant-avatar">
                  {mentorInitials}
                </div>

                <div>

                  <strong>
                    {mentorName}
                  </strong>

                  <span>
                    Mentor
                  </span>

                </div>

              </div>

              <div className="meeting-session-info">

                <span>
                  {formatTime(
                    booking.bookingTime
                  )}
                </span>

                <span>
                  •
                </span>

                <span>
                  {booking.durationMinutes} min
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SessionPage;