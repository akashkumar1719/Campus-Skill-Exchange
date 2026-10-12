import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./MyBookings.css";
import "./MentorProfile.css";

const mentors = {
  "arun-kumar": {
    name: "Arun Kumar",
    role: "Computer Science Student",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    avatar: "AK",
    rating: 4.9,
    reviews: 28,
    sessions: 42,
    about:
      "I enjoy helping fellow students learn practical web development and programming concepts through simple, hands-on sessions.",
    skills: [
      "React",
      "JavaScript",
      "Node.js",
      "HTML & CSS",
      "Git & GitHub",
    ],
  },

  "priya-sharma": {
    name: "Priya Sharma",
    role: "Final Year Student",
    department: "Information Technology",
    year: "4th Year",
    avatar: "PS",
    rating: 4.8,
    reviews: 22,
    sessions: 31,
    about:
      "I help students understand Python, data science and machine learning concepts with practical examples and projects.",
    skills: [
      "Python",
      "Data Science",
      "Pandas",
      "Machine Learning",
      "Data Visualization",
    ],
  },

  "rahul-verma": {
    name: "Rahul Verma",
    role: "Software Engineering Student",
    department: "Computer Science & Engineering",
    year: "4th Year",
    avatar: "RV",
    rating: 4.9,
    reviews: 35,
    sessions: 56,
    about:
      "I specialize in backend development and enjoy helping students build real-world applications using Java and Spring Boot.",
    skills: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "MySQL",
      "Backend Development",
    ],
  },
};

const timeSlots = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "04:30 PM",
  "06:00 PM",
];


const dates = Array.from({ length: 4 }, (_, index) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + index + 1);

  return {
    label: date.toLocaleDateString("en-US", {
      weekday: "short",
    }),
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
    isoDate: [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-"),
  };
});


function MentorProfile() {
  const { mentorSlug } = useParams();
  const navigate = useNavigate();

  const mentor = mentors[mentorSlug];

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState("10:30 AM");

  const [bookingConfirmed, setBookingConfirmed] =
    useState(false);

  const [bookingError, setBookingError] = useState("");

  const [bookedTimes, setBookedTimes] = useState([]);

  const [loadingBookedTimes, setLoadingBookedTimes] =
    useState(false);

  // =====================================================
  // MENTOR AVAILABILITY
  // =====================================================

  const [mentorAvailability, setMentorAvailability] =
    useState([]);

  // Load mentor availability from localStorage
  useEffect(() => {
    if (mentorSlug !== "arun-kumar") {
      setMentorAvailability([]);
      return;
    }

    try {
      const savedAvailability = localStorage.getItem(
        "mentor_availability_arun_kumar"
      );

      if (savedAvailability) {
        const parsedAvailability =
          JSON.parse(savedAvailability);

        setMentorAvailability(parsedAvailability);
      } else {
        setMentorAvailability([
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
        ]);
      }
    } catch (error) {
      console.error(
        "Error loading mentor availability:",
        error
      );

      setMentorAvailability([]);
    }
  }, [mentorSlug]);

  // =====================================================
  // FETCH BOOKED TIMES
  // =====================================================

  useEffect(() => {
    const fetchBookedTimes = async () => {
      setLoadingBookedTimes(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/mentor/${mentorSlug}?date=${selectedDate.isoDate}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch booked slots"
          );
        }

        const bookings = await response.json();

        const bookedTimeList = bookings.map(
          (booking) => {
            const [hours, minutes] =
              booking.bookingTime.split(":");

            const hour = parseInt(hours, 10);

            const modifier =
              hour >= 12 ? "PM" : "AM";

            const displayHour =
              hour % 12 || 12;

            return `${String(
              displayHour
            ).padStart(2, "0")}:${minutes} ${modifier}`;
          }
        );

        setBookedTimes(bookedTimeList);
      } catch (error) {
        console.error(
          "Error fetching booked slots:",
          error
        );

        setBookedTimes([]);
      } finally {
        setLoadingBookedTimes(false);
      }
    };

    fetchBookedTimes();
  }, [mentorSlug, selectedDate]);

  // =====================================================
  // AVAILABILITY HELPERS
  // =====================================================

  const dayNameMap = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

  const getSelectedDayName = () => {
    return dayNameMap[selectedDate.label];
  };

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time
      .split(":")
      .map(Number);

    return hours * 60 + minutes;
  };

  const convert12HourToMinutes = (time) => {
    const [rawTime, modifier] =
      time.split(" ");

    let [hours, minutes] = rawTime
      .split(":")
      .map(Number);

    if (
      modifier === "AM" &&
      hours === 12
    ) {
      hours = 0;
    }

    if (
      modifier === "PM" &&
      hours !== 12
    ) {
      hours += 12;
    }

    return hours * 60 + minutes;
  };

  const isTimeAvailable = (time) => {
    const selectedDay =
      getSelectedDayName();

    const matchingSlots =
      mentorAvailability.filter(
        (slot) =>
          slot.day === selectedDay &&
          slot.isAvailable !== false
      );

    if (matchingSlots.length === 0) {
      return false;
    }

    const timeInMinutes =
      convert12HourToMinutes(time);

    const sessionDuration = 30;

    return matchingSlots.some((slot) => {
      const startMinutes =
        convertTimeToMinutes(
          slot.startTime
        );

      const endMinutes =
        convertTimeToMinutes(
          slot.endTime
        );

      return (
        timeInMinutes >= startMinutes &&
        timeInMinutes +
          sessionDuration <=
          endMinutes
      );
    });
  };

  // =====================================================
  // AUTO SELECT FIRST AVAILABLE TIME
  // =====================================================

  useEffect(() => {
    if (mentorAvailability.length === 0) {
      setSelectedTime("");
      return;
    }

    const firstAvailableTime =
      timeSlots.find((time) =>
        isTimeAvailable(time)
      );

    if (
      selectedTime &&
      isTimeAvailable(selectedTime)
    ) {
      return;
    }

    setSelectedTime(
      firstAvailableTime || ""
    );
  }, [
    selectedDate,
    mentorAvailability,
  ]);

  // =====================================================
  // MENTOR NOT FOUND
  // =====================================================

  if (!mentor) {
    return (
      <div className="mentor-not-found">
        <h1>Mentor Not Found</h1>

        <p>
          The mentor profile you're looking
          for does not exist.
        </p>

        <Link
          to="/explore-skills"
          className="back-button"
        >
          ← Back to Explore Skills
        </Link>
      </div>
    );
  }

  // =====================================================
  // CONFIRM BOOKING
  // =====================================================

  const handleConfirmBooking =
    async () => {
      setBookingError("");

      

      if (!selectedTime) {
        setBookingError(
          "Please select a time slot."
        );

        return;
      }

      // Check mentor availability
      if (
        !isTimeAvailable(selectedTime)
      ) {
        setBookingError(
          "This time slot is outside the mentor's availability."
        );

        return;
      }

      // Check existing bookings
      if (
        bookedTimes.includes(selectedTime)
      ) {
        setBookingError(
          "This time slot is already booked."
        );

        return;
      }

      try {
        // Convert 12-hour time to 24-hour time
        const convertTo24Hour = (
          time
        ) => {
          const [rawTime, modifier] =
            time.split(" ");

          let [hours, minutes] =
            rawTime.split(":");

          if (hours === "12") {
            hours = "00";
          }

          if (modifier === "PM") {
            hours = String(
              parseInt(hours, 10) +
                12
            );
          }

          return `${hours.padStart(
            2,
            "0"
          )}:${minutes}:00`;
        };

        const bookingData = {
          mentorSlug: mentorSlug,
          studentName: "Test Student",
          bookingDate:
            selectedDate.isoDate,
          bookingTime:
            convertTo24Hour(
              selectedTime
            ),
          durationMinutes: 30,
          sessionType: "Video Call",
          status: "CONFIRMED",
        };

        const response =
          await fetch(
            "http://localhost:8080/api/bookings",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                bookingData
              ),
            }
          );

        if (!response.ok) {
          const errorMessage =
            await response.text();

          if (
            response.status === 409
          ) {
            setBookingError(
              errorMessage
            );

            return;
          }

          throw new Error(
            errorMessage ||
              "Booking failed"
          );
        }

        const savedBooking =
          await response.json();

        console.log(
          "Booking saved:",
          savedBooking
        );

        setBookingConfirmed(true);

        // Add newly booked time
        setBookedTimes(
          (currentTimes) => [
            ...currentTimes,
            selectedTime,
          ]
        );
      } catch (error) {
        console.error(
          "Booking error:",
          error
        );

        alert(
          "Booking failed. Please make sure the backend is running."
        );
      }
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mentor-page">

      {/* NAVBAR */}
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

            <a href="#booking">
              Sessions
            </a>
          </div>

          <button className="nav-login">
            Login
          </button>

        </div>
      </nav>

      {/* PAGE CONTAINER */}
      <div className="mentor-container">

        {/* BREADCRUMB */}
        <div className="breadcrumb">

          <Link to="/">
            Home
          </Link>

          <span>›</span>

          <Link to="/explore-skills">
            Explore Skills
          </Link>

          <span>›</span>

          <span>
            {mentor.name}
          </span>

        </div>

        {/* PROFILE HEADER */}
        <section className="mentor-profile-header">

          <div className="mentor-avatar-large">
            {mentor.avatar}
          </div>

          <div className="mentor-main-info">

            <div className="mentor-name-row">

              <h1>
                {mentor.name}
              </h1>

              <span className="verified-badge">
                ✓ Verified
              </span>

            </div>

            <p className="mentor-role">
              {mentor.role}
            </p>

            <p className="mentor-academic">
              {mentor.department} •{" "}
              {mentor.year}
            </p>

            <div className="mentor-stats">

              <span>
                ⭐{" "}
                <strong>
                  {mentor.rating}
                </strong>
              </span>

              <span>
                {mentor.reviews} reviews
              </span>

              <span>
                {mentor.sessions} sessions
              </span>

            </div>

            <div className="availability">

              <span className="availability-dot"></span>

              Available for sessions

            </div>

          </div>

          <div className="mentor-header-action">

            <button
              className="book-session-button"
              onClick={() =>
                document
                  .getElementById(
                    "booking"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                  })
              }
            >
              Book a Session
            </button>

          </div>

        </section>

        {/* MAIN CONTENT */}
        <div className="mentor-content-grid">

          <div className="mentor-left">

            {/* ABOUT */}
            <section className="mentor-section">

              <h2>
                About{" "}
                {mentor.name.split(
                  " "
                )[0]}
              </h2>

              <p>
                {mentor.about}
              </p>

            </section>

            {/* SKILLS */}
            <section className="mentor-section">

              <h2>
                Skills I can teach
              </h2>

              <div className="mentor-skills">

                {mentor.skills.map(
                  (skill) => (
                    <span
                      className="mentor-skill-tag"
                      key={skill}
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </section>

            {/* AVAILABILITY */}
<section className="mentor-section mentor-availability-section">

  <h2>
    Availability
  </h2>

  <p className="availability-subtitle">
    Available days and times for mentoring sessions.
  </p>

  <div className="mentor-availability-list">

    {mentorAvailability.length === 0 ? (

      <div className="no-availability-message">
        <span>📅</span>
        <p>
          No availability has been added yet.
        </p>
      </div>

    ) : (

      mentorAvailability.map((slot) => {

        const formatTime = (time) => {
          const [hours, minutes] =
            time.split(":");

          let hour = parseInt(hours, 10);

          const modifier =
            hour >= 12 ? "PM" : "AM";

          hour = hour % 12 || 12;

          return `${String(hour).padStart(
            2,
            "0"
          )}:${minutes} ${modifier}`;
        };

        return (
          <div
            className={`mentor-availability-item ${
              slot.isAvailable === false
                ? "unavailable"
                : ""
            }`}
            key={slot.id}
          >

            <div className="availability-day">
              <span className="availability-calendar">
                📅
              </span>

              <strong>
                {slot.day}
              </strong>
            </div>

            <div className="availability-time">
              {slot.isAvailable === false ? (
                <span className="availability-unavailable-text">
                  Unavailable
                </span>
              ) : (
                <span>
                  {formatTime(slot.startTime)}
                  {" – "}
                  {formatTime(slot.endTime)}
                </span>
              )}
            </div>

            <div className="availability-state">

              {slot.isAvailable === false ? (
                <span className="availability-badge unavailable">
                  ○ Unavailable
                </span>
              ) : (
                <span className="availability-badge available">
                  ● Available
                </span>
              )}

            </div>

          </div>
        );
      })

    )}

  </div>

</section>

            {/* BOOKING */}
            <section
              className="mentor-section booking-section"
              id="booking"
            >

              <h2>
                Book a Session
              </h2>

              <p className="booking-subtitle">
                Choose a date and time
                that works for you.
              </p>

              {/* DATE */}
              <div className="booking-group">

                <h3>
                  Select a date
                </h3>

                <div className="date-options">

                  {dates.map(
                    (item) => (
                      <button
                        key={
                          item.date
                        }
                        className={`date-card ${
                          selectedDate.date ===
                          item.date
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedDate(
                            item
                          );

                          setBookingConfirmed(
                            false
                          );

                          setBookingError(
                            ""
                          );
                        }}
                      >

                        <span>
                          {item.label}
                        </span>

                        <strong>
                          {item.date}
                        </strong>

                      </button>
                    )
                  )}

                </div>

              </div>

              {/* TIME */}
              <div className="booking-group">

                <h3>
                  Select a time
                </h3>

                {loadingBookedTimes && (
                  <p className="booking-loading">
                    Checking available
                    time slots...
                  </p>
                )}

                <div className="time-options">

                  {timeSlots.map(
                    (time) => {

                      const isBooked =
                        bookedTimes.includes(
                          time
                        );

                      const isAvailable =
                        isTimeAvailable(
                          time
                        );

                      const isDisabled =
                        isBooked ||
                        !isAvailable;

                      return (
                        <button
                          key={time}
                          className={`time-slot ${
                            selectedTime ===
                            time
                              ? "selected"
                              : ""
                          } ${
                            isBooked
                              ? "booked"
                              : ""
                          } ${
                            !isAvailable
                              ? "unavailable"
                              : ""
                          }`}
                          disabled={
                            isDisabled
                          }
                          onClick={() => {
                            setSelectedTime(
                              time
                            );

                            setBookingConfirmed(
                              false
                            );

                            setBookingError(
                              ""
                            );
                          }}
                        >

                          {isBooked
                            ? `${time} — Booked`
                            : !isAvailable
                            ? `${time} — Unavailable`
                            : time}

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

          </div>

          {/* BOOKING SUMMARY */}
          <aside className="booking-card">

            <div className="booking-card-header">

              <h3>
                Booking Summary
              </h3>

            </div>

            <div className="booking-details">

              <div className="booking-detail-row">

                <span>
                  👨‍🏫 Mentor
                </span>

                <strong>
                  {mentor.name}
                </strong>

              </div>

              <div className="booking-detail-row">

                <span>
                  📅 Date
                </span>

                <strong>
                  {selectedDate.label},{" "}
                  {selectedDate.date}
                </strong>

              </div>

              <div className="booking-detail-row">

                <span>
                  🕐 Time
                </span>

                <strong>
                  {selectedTime ||
                    "No available time"}
                </strong>

              </div>

              <div className="booking-detail-row">

                <span>
                  ⏱ Duration
                </span>

                <strong>
                  30 min
                </strong>

              </div>

              <div className="booking-detail-row">

                <span>
                  🎥 Session
                </span>

                <strong>
                  Video Call
                </strong>

              </div>

            </div>

            <div className="booking-price">

              <span>
                Total
              </span>

              <strong>
                FREE
              </strong>

            </div>

            {!bookingConfirmed ? (

              <>
                {bookingError && (
                  <div className="booking-error">

                    <span>
                      ⚠️
                    </span>

                    <p>
                      {bookingError}
                    </p>

                  </div>
                )}

                <button
                  className="confirm-booking-button"
                  onClick={
                    handleConfirmBooking
                  }
                  disabled={
                    !selectedTime ||
                    !isTimeAvailable(
                      selectedTime
                    )
                  }
                >
                  Confirm Booking →
                </button>

              </>

            ) : (

              <div className="booking-success">

                <div className="success-icon">
                  ✓
                </div>

                <h3>
                  Booking Confirmed!
                </h3>

                <p>
                  Your session with{" "}
                  <strong>
                    {mentor.name}
                  </strong>{" "}
                  is scheduled for{" "}
                  <strong>
                    {selectedDate.label},{" "}
                    {selectedDate.date}
                  </strong>{" "}
                  at{" "}
                  <strong>
                    {selectedTime}
                  </strong>
                  .
                </p>

                <div className="booking-success-actions">

                  <button
                    className="change-booking-button"
                    onClick={() =>
                      setBookingConfirmed(
                        false
                      )
                    }
                  >
                    Change Booking
                  </button>

                  <button
                    className="view-bookings-button"
                    onClick={() =>
                      navigate(
                        "/my-bookings"
                      )
                    }
                  >
                    View My Bookings →
                  </button>

                </div>

              </div>

            )}

          </aside>

        </div>

      </div>

    </div>
  );
}

export default MentorProfile;