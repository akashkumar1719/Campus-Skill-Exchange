import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "../App.css";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  // =====================================================
  // BASIC STATE
  // =====================================================

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  // =====================================================
  // FILTER / SEARCH / SORT STATE
  // =====================================================

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [sortOption, setSortOption] =
    useState("DATE_ASC");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [periodFilter, setPeriodFilter] =
    useState("ALL");

  // =====================================================
  // ATTENDANCE STATE
  // =====================================================

  const [attendanceMap, setAttendanceMap] =
    useState({});

  const [attendanceLoading, setAttendanceLoading] =
    useState(false);

  // =====================================================
  // REVIEW STATE
  // =====================================================

  const [reviewMap, setReviewMap] =
    useState({});

  const [reviewLoading, setReviewLoading] =
    useState(false);

  // Review form
  const [selectedRating, setSelectedRating] =
    useState(0);

  const [reviewComment, setReviewComment] =
    useState("");

  const [reviewMessage, setReviewMessage] =
    useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/bookings/student/Test%20Student"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch bookings."
        );
      }

      const data = await response.json();

      setBookings(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Error fetching bookings:",
        err
      );

      setError(
        "Unable to load your bookings. Please try again."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

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

  // =====================================================
  // FORMAT TIME
  // =====================================================

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

  // =====================================================
  // BOOKING DATE/TIME
  // =====================================================

  const getBookingDateTime = (booking) => {
    if (
      !booking?.bookingDate ||
      !booking?.bookingTime
    ) {
      return null;
    }

    return new Date(
      `${booking.bookingDate}T${booking.bookingTime}`
    );
  };

  // =====================================================
  // BOOKING PERIOD
  // =====================================================

  const getBookingPeriod = (booking) => {
    const bookingDateTime =
      getBookingDateTime(booking);

    if (!bookingDateTime) {
      return "PAST";
    }

    return bookingDateTime > new Date()
      ? "UPCOMING"
      : "PAST";
  };

  // =====================================================
  // JOIN SESSION CHECK
  // =====================================================

  const canJoinSession = (booking) => {
    return (
      booking.status === "CONFIRMED" &&
      getBookingPeriod(booking) ===
        "UPCOMING"
    );
  };

  // =====================================================
  // REVIEW CHECK
  // =====================================================

  const canReviewSession = (booking) => {
    return (
      booking.status === "CONFIRMED" &&
      getBookingPeriod(booking) ===
        "PAST"
    );
  };

  // =====================================================
  // FORMAT MENTOR NAME
  // =====================================================

  const formatMentorName = (slug) => {
    if (!slug) {
      return "Mentor";
    }

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
  // FETCH ATTENDANCE
  // =====================================================

  const fetchAttendance = useCallback(async () => {
    if (bookings.length === 0) {
      setAttendanceMap({});
      return;
    }

    try {
      setAttendanceLoading(true);

      const attendanceResults = {};

      await Promise.all(
        bookings.map(async (booking) => {
          try {
            const response = await fetch(
              `http://localhost:8080/api/attendance/booking/${booking.id}`
            );

            if (response.ok) {
              const attendance =
                await response.json();

              attendanceResults[booking.id] =
                attendance;
            } else if (
              response.status === 404
            ) {
              attendanceResults[booking.id] =
                null;
            } else {
              attendanceResults[booking.id] =
                null;
            }
          } catch (error) {
            console.error(
              `Error fetching attendance for booking ${booking.id}:`,
              error
            );

            attendanceResults[booking.id] =
              null;
          }
        })
      );

      setAttendanceMap(
        attendanceResults
      );
    } catch (error) {
      console.error(
        "Error fetching attendance:",
        error
      );
    } finally {
      setAttendanceLoading(false);
    }
  }, [bookings]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // =====================================================
  // REFRESH ATTENDANCE WHEN TAB BECOMES VISIBLE
  // =====================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        fetchAttendance();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchAttendance]);

  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  const fetchReviews = useCallback(async () => {
    if (bookings.length === 0) {
      setReviewMap({});
      return;
    }

    try {
      setReviewLoading(true);

      const reviewResults = {};

      await Promise.all(
        bookings.map(async (booking) => {
          try {
            const response = await fetch(
              `http://localhost:8080/api/reviews/booking/${booking.id}`
            );

            if (response.ok) {
              const review =
                await response.json();

              reviewResults[booking.id] =
                review;
            } else if (
              response.status === 404
            ) {
              reviewResults[booking.id] =
                null;
            } else {
              reviewResults[booking.id] =
                null;
            }
          } catch (error) {
            console.error(
              `Error fetching review for booking ${booking.id}:`,
              error
            );

            reviewResults[booking.id] =
              null;
          }
        })
      );

      setReviewMap(reviewResults);
    } catch (error) {
      console.error(
        "Error fetching reviews:",
        error
      );
    } finally {
      setReviewLoading(false);
    }
  }, [bookings]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // =====================================================
  // REFRESH REVIEWS WHEN TAB BECOMES VISIBLE
  // =====================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        fetchReviews();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchReviews]);

  // =====================================================
  // GET ATTENDANCE
  // =====================================================

  const getAttendance = (bookingId) => {
    return (
      attendanceMap[bookingId] || null
    );
  };

  // =====================================================
  // GET ATTENDANCE DISPLAY
  // =====================================================

  const getAttendanceDisplay = (bookingId) => {
    const attendance =
      getAttendance(bookingId);

    if (!attendance) {
      return {
        label: "Not Marked",
        className: "not-marked",
      };
    }

    if (
      attendance.status ===
      "PRESENT"
    ) {
      return {
        label: "Present",
        className: "present",
      };
    }

    if (
      attendance.status ===
      "ABSENT"
    ) {
      return {
        label: "Absent",
        className: "absent",
      };
    }

    return {
      label: attendance.status,
      className: "not-marked",
    };
  };

  // =====================================================
  // GET REVIEW
  // =====================================================

  const getReview = (bookingId) => {
    return (
      reviewMap[bookingId] || null
    );
  };

  // =====================================================
  // OPEN REVIEW FORM
  // =====================================================

  const openReviewForm = (booking) => {
    const existingReview =
      getReview(booking.id);

    if (existingReview) {
      setSelectedRating(
        existingReview.rating || 0
      );

      setReviewComment(
        existingReview.comment || ""
      );
    } else {
      setSelectedRating(0);
      setReviewComment("");
    }

    setReviewMessage("");
    setSelectedBooking(booking);
  };

  // =====================================================
  // SUBMIT / UPDATE REVIEW
  // =====================================================

  const handleSubmitReview = async (
    booking
  ) => {
    if (!booking?.id) {
      setReviewMessage(
        "Booking information is missing."
      );

      return;
    }

    if (
      selectedRating < 1 ||
      selectedRating > 5
    ) {
      setReviewMessage(
        "Please select a rating from 1 to 5 stars."
      );

      return;
    }

    if (!reviewComment.trim()) {
      setReviewMessage(
        "Please write some feedback."
      );

      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewMessage("");

      const existingReview =
        getReview(booking.id);

      const reviewData = {
        bookingId: booking.id,
        studentName:
          booking.studentName,
        mentorSlug:
          booking.mentorSlug,
        rating: selectedRating,
        comment:
          reviewComment.trim(),
      };

      let response;

      // =================================================
      // UPDATE EXISTING REVIEW
      // =================================================

      if (existingReview) {
        response = await fetch(
          `http://localhost:8080/api/reviews/booking/${booking.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              rating: selectedRating,
              comment:
                reviewComment.trim(),
            }),
          }
        );
      }

      // =================================================
      // CREATE NEW REVIEW
      // =================================================

      else {
        response = await fetch(
          "http://localhost:8080/api/reviews",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              reviewData
            ),
          }
        );
      }

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to save review."
        );
      }

      const savedReview =
        await response.json();

      setReviewMap(
        (currentReviews) => ({
          ...currentReviews,
          [booking.id]:
            savedReview,
        })
      );

      setSelectedRating(
        savedReview.rating || 0
      );

      setReviewComment(
        savedReview.comment || ""
      );

      setReviewMessage(
        existingReview
          ? "Review updated successfully."
          : "Review submitted successfully."
      );
    } catch (error) {
      console.error(
        "Error saving review:",
        error
      );

      setReviewMessage(
        "Unable to save review. Please try again."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // =====================================================
  // CANCEL BOOKING
  // =====================================================

  const handleCancelBooking = async (
    booking
  ) => {
    if (!booking?.id) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${booking.id}/cancel`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to cancel booking."
        );
      }

      const updatedBooking =
        await response.json();

      setBookings(
        (currentBookings) =>
          currentBookings.map(
            (item) =>
              item.id === booking.id
                ? updatedBooking
                : item
          )
      );

      if (
        selectedBooking?.id ===
        booking.id
      ) {
        setSelectedBooking(
          updatedBooking
        );
      }
    } catch (error) {
      console.error(
        "Error cancelling booking:",
        error
      );

      alert(
        "Unable to cancel booking. Please try again."
      );
    }
  };

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings =
    bookings.filter((booking) => {
      // Status filter
      if (
        statusFilter !== "ALL" &&
        booking.status !==
          statusFilter
      ) {
        return false;
      }

      // Period filter
      if (
        periodFilter !== "ALL" &&
        getBookingPeriod(
          booking
        ) !== periodFilter
      ) {
        return false;
      }

      // Search
      if (
        searchTerm.trim()
      ) {
        const search =
          searchTerm
            .trim()
            .toLowerCase();

        const mentorName =
          formatMentorName(
            booking.mentorSlug
          ).toLowerCase();

        const studentName =
          (
            booking.studentName ||
            ""
          ).toLowerCase();

        const sessionType =
          (
            booking.sessionType ||
            ""
          ).toLowerCase();

        const bookingId =
          String(
            booking.id || ""
          );

        const matches =
          mentorName.includes(
            search
          ) ||
          studentName.includes(
            search
          ) ||
          sessionType.includes(
            search
          ) ||
          bookingId.includes(
            search
          );

        if (!matches) {
          return false;
        }
      }

      return true;
    });

  // =====================================================
  // SORT BOOKINGS
  // =====================================================

  const sortedBookings = [
    ...filteredBookings,
  ].sort((a, b) => {
    const dateA =
      getBookingDateTime(a);

    const dateB =
      getBookingDateTime(b);

    if (!dateA || !dateB) {
      return 0;
    }

    switch (sortOption) {
      case "DATE_DESC":
        return dateB - dateA;

      case "NEWEST":
        return (
          Number(b.id) -
          Number(a.id)
        );

      case "OLDEST":
        return (
          Number(a.id) -
          Number(b.id)
        );

      case "DATE_ASC":
      default:
        return dateA - dateB;
    }
  });

  // =====================================================
  // OPEN BOOKING DETAILS
  // =====================================================

  const openBookingDetails = (
    booking
  ) => {
    setReviewMessage("");
    setSelectedBooking(booking);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setSelectedBooking(null);

    setSelectedRating(0);
    setReviewComment("");
    setReviewMessage("");
    setReviewSubmitting(false);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="my-bookings-page">
        <div className="my-bookings-container">
          <div className="bookings-loading">
            <div className="loading-spinner">
              ⏳
            </div>

            <h2>
              Loading your bookings...
            </h2>

            <p>
              Please wait while we
              fetch your sessions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="my-bookings-page">

      <div className="my-bookings-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="my-bookings-header">

          <div>
            <p className="page-eyebrow">
              LEARNING SESSIONS
            </p>

            <h1>
              My Bookings
            </h1>

            <p>
              Manage your scheduled
              learning sessions.
            </p>
          </div>

          <button
            type="button"
            className="browse-skills-button"
            onClick={() =>
              navigate(
                "/explore-skills"
              )
            }
          >
            + Book New Session
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="bookings-error">
            <strong>
              Something went wrong
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchBookings}
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="bookings-toolbar">

          {/* STATUS */}

          <div className="filter-group">

            <label>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="ALL">
                All
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

          </div>

          {/* PERIOD */}

          <div className="filter-group">

            <label>
              Period
            </label>

            <select
              value={periodFilter}
              onChange={(event) =>
                setPeriodFilter(
                  event.target.value
                )
              }
            >
              <option value="ALL">
                All
              </option>

              <option value="UPCOMING">
                Upcoming
              </option>

              <option value="PAST">
                Past
              </option>
            </select>

          </div>

          {/* SORT */}

          <div className="filter-group">

            <label>
              Sort
            </label>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value
                )
              }
            >
              <option value="DATE_ASC">
                Date ↑
              </option>

              <option value="DATE_DESC">
                Date ↓
              </option>

              <option value="NEWEST">
                Newest
              </option>

              <option value="OLDEST">
                Oldest
              </option>
            </select>

          </div>

          {/* SEARCH */}

          <div className="search-group">

            <label>
              Search
            </label>

            <div className="search-input-wrapper">

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search mentor, session..."
              />

              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                >
                  ×
                </button>
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        <div className="booking-results-info">

          <span>
            Showing{" "}
            <strong>
              {sortedBookings.length}
            </strong>{" "}
            booking
            {sortedBookings.length !==
            1
              ? "s"
              : ""}
          </span>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {sortedBookings.length ===
        0 ? (
          <div className="empty-bookings">

            <div className="empty-bookings-icon">
              📅
            </div>

            <h2>
              {periodFilter ===
              "UPCOMING"
                ? "No upcoming bookings"
                : statusFilter ===
                  "CANCELLED"
                ? "No cancelled bookings"
                : "No bookings found"}
            </h2>

            <p>
              {periodFilter ===
              "UPCOMING"
                ? "You don't have any upcoming bookings."
                : searchTerm
                ? "Try changing your search or filters."
                : "Book a learning session with a mentor to get started."}
            </p>

            {!searchTerm &&
              periodFilter ===
                "ALL" && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/explore-skills"
                    )
                  }
                >
                  Explore Skills
                </button>
              )}

          </div>
        ) : (
          <div className="bookings-list">

            {sortedBookings.map(
              (booking) => {
                const attendance =
                  getAttendance(
                    booking.id
                  );

                const attendanceDisplay =
                  getAttendanceDisplay(
                    booking.id
                  );

                const review =
                  getReview(
                    booking.id
                  );

                return (
                  <div
                    className="booking-card"
                    key={booking.id}
                  >

                    {/* CARD HEADER */}

                    <div className="booking-card-header">

                      <div className="mentor-card-info">

                        <div className="mentor-avatar">
                          {formatMentorName(
                            booking.mentorSlug
                          )
                            .split(" ")
                            .map(
                              (word) =>
                                word[0]
                            )
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div>
                          <span className="mentor-label">
                            Mentor
                          </span>

                          <h2>
                            {formatMentorName(
                              booking.mentorSlug
                            )}
                          </h2>
                        </div>

                      </div>

                      <span
                        className={`booking-status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>

                    </div>

                    {/* BOOKING DETAILS */}

                    <div className="booking-details-grid">

                      <div className="booking-detail">

                        <span className="detail-icon">
                          📅
                        </span>

                        <div>
                          <span className="detail-label">
                            Date
                          </span>

                          <strong>
                            {formatDate(
                              booking.bookingDate
                            )}
                          </strong>
                        </div>

                      </div>

                      <div className="booking-detail">

                        <span className="detail-icon">
                          🕐
                        </span>

                        <div>
                          <span className="detail-label">
                            Time
                          </span>

                          <strong>
                            {formatTime(
                              booking.bookingTime
                            )}
                          </strong>
                        </div>

                      </div>

                      <div className="booking-detail">

                        <span className="detail-icon">
                          ⏱️
                        </span>

                        <div>
                          <span className="detail-label">
                            Duration
                          </span>

                          <strong>
                            {
                              booking.durationMinutes
                            }{" "}
                            minutes
                          </strong>
                        </div>

                      </div>

                      <div className="booking-detail">

                        <span className="detail-icon">
                          🎥
                        </span>

                        <div>
                          <span className="detail-label">
                            Session
                          </span>

                          <strong>
                            {booking.sessionType ||
                              "Video Call"}
                          </strong>
                        </div>

                      </div>

                      {/* ATTENDANCE */}

                      <div className="booking-detail">

                        <span className="detail-icon">
                          📋
                        </span>

                        <div>
                          <span className="detail-label">
                            Attendance
                          </span>

                          <strong
                            className={`attendance-status ${attendanceDisplay.className}`}
                          >
                            {attendanceDisplay.label ===
                            "Present"
                              ? "✓ "
                              : attendanceDisplay.label ===
                                "Absent"
                              ? "✕ "
                              : ""}
                            {
                              attendanceDisplay.label
                            }
                          </strong>
                        </div>

                      </div>

                      {/* REVIEW */}

                      {canReviewSession(
                        booking
                      ) && (
                        <div className="booking-detail">

                          <span className="detail-icon">
                            ⭐
                          </span>

                          <div>
                            <span className="detail-label">
                              Review
                            </span>

                            <strong>
                              {review
                                ? `${review.rating}/5`
                                : "Not reviewed"}
                            </strong>
                          </div>

                        </div>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="booking-actions">

                      {/* REVIEW */}

                      {canReviewSession(
                        booking
                      ) && (
                        <button
                          type="button"
                          className="review-booking-button"
                          onClick={() =>
                            openReviewForm(
                              booking
                            )
                          }
                        >
                          {review
                            ? "⭐ Edit Review"
                            : "⭐ Review Session"}
                        </button>
                      )}

                      {/* VIEW DETAILS */}

                      <button
                        type="button"
                        className="view-details-button"
                        onClick={() =>
                          openBookingDetails(
                            booking
                          )
                        }
                      >
                        View Details
                      </button>

                      {/* JOIN */}

                      {canJoinSession(
                        booking
                      ) && (
                        <button
                          type="button"
                          className="join-session-button"
                          onClick={() =>
                            navigate(
                              "/session",
                              {
                                state: {
                                  booking,
                                },
                              }
                            )
                          }
                        >
                          🎥 Join Session
                        </button>
                      )}

                      {/* CANCEL */}

                      {booking.status ===
                        "CONFIRMED" &&
                        getBookingPeriod(
                          booking
                        ) ===
                          "UPCOMING" && (
                          <button
                            type="button"
                            className="cancel-booking-button"
                            onClick={() =>
                              handleCancelBooking(
                                booking
                              )
                            }
                          >
                            Cancel Booking
                          </button>
                        )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =================================================
          BOOKING DETAILS MODAL
      ================================================= */}

      {selectedBooking && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="booking-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>
                <span className="modal-eyebrow">
                  BOOKING DETAILS
                </span>

                <h2>
                  Booking #
                  {selectedBooking.id}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* MODAL MENTOR */}

            <div className="modal-mentor">

              <div className="modal-mentor-avatar">
                {formatMentorName(
                  selectedBooking.mentorSlug
                )
                  .split(" ")
                  .map(
                    (word) =>
                      word[0]
                  )
                  .join("")
                  .toUpperCase()}
              </div>

              <div>

                <span>
                  Mentor
                </span>

                <strong>
                  {formatMentorName(
                    selectedBooking.mentorSlug
                  )}
                </strong>

              </div>

            </div>

            {/* MODAL DETAILS */}

            <div className="modal-details-grid">

              <div className="modal-detail">
                <span>
                  Student
                </span>

                <strong>
                  {
                    selectedBooking.studentName
                  }
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  Date
                </span>

                <strong>
                  {formatDate(
                    selectedBooking.bookingDate
                  )}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  Time
                </span>

                <strong>
                  {formatTime(
                    selectedBooking.bookingTime
                  )}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  Duration
                </span>

                <strong>
                  {
                    selectedBooking.durationMinutes
                  }{" "}
                  minutes
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  Session Type
                </span>

                <strong>
                  {selectedBooking.sessionType ||
                    "Video Call"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  Status
                </span>

                <strong
                  className={`modal-status ${selectedBooking.status.toLowerCase()}`}
                >
                  {
                    selectedBooking.status
                  }
                </strong>
              </div>

              {/* ATTENDANCE */}

              <div className="modal-detail">

                <span>
                  Attendance
                </span>

                <strong
                  className={`modal-attendance-status ${
                    getAttendanceDisplay(
                      selectedBooking.id
                    ).className
                  }`}
                >
                  {
                    getAttendanceDisplay(
                      selectedBooking.id
                    ).label ===
                    "Present"
                      ? "✓ "
                      : getAttendanceDisplay(
                          selectedBooking.id
                        ).label ===
                        "Absent"
                      ? "✕ "
                      : ""}

                  {
                    getAttendanceDisplay(
                      selectedBooking.id
                    ).label
                  }
                </strong>

              </div>

              {/* MARKED AT */}

              {getAttendance(
                selectedBooking.id
              )?.markedAt && (
                <div className="modal-detail">

                  <span>
                    Marked At
                  </span>

                  <strong>
                    {new Date(
                      getAttendance(
                        selectedBooking.id
                      ).markedAt
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              )}

            </div>

            {/* =================================================
                REVIEW SECTION
            ================================================= */}

            {canReviewSession(
              selectedBooking
            ) && (
              <div className="review-section">

                <div className="review-section-header">

                  <span className="review-section-label">
                    REVIEW
                  </span>

                  <h3>
                    {getReview(
                      selectedBooking.id
                    )
                      ? "Your Review"
                      : "How was your session?"}
                  </h3>

                </div>

                {/* EXISTING REVIEW / FORM */}

                <div className="review-rating">

                  <span className="review-form-label">
                    Rating
                  </span>

                  <div className="star-rating">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-button ${
                            star <=
                            selectedRating
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedRating(
                              star
                            )
                          }
                          aria-label={`Rate ${star} out of 5`}
                        >
                          {star <=
                          selectedRating
                            ? "★"
                            : "☆"}
                        </button>
                      )
                    )}

                  </div>

                  {selectedRating >
                    0 && (
                    <span className="rating-value">
                      {selectedRating}
                      /5
                    </span>
                  )}

                </div>

                {/* COMMENT */}

                <div className="review-comment">

                  <label
                    htmlFor="review-comment"
                    className="review-form-label"
                  >
                    Feedback
                  </label>

                  <textarea
                    id="review-comment"
                    value={
                      reviewComment
                    }
                    onChange={(event) =>
                      setReviewComment(
                        event.target.value
                      )
                    }
                    placeholder="Tell us about your session..."
                    rows="4"
                    maxLength="1000"
                  />

                  <div className="review-character-count">
                    {
                      reviewComment.length
                    }
                    /1000
                  </div>

                </div>

                {/* MESSAGE */}

                {reviewMessage && (
                  <div
                    className={`review-message ${
                      reviewMessage.includes(
                        "successfully"
                      )
                        ? "success"
                        : "error"
                    }`}
                  >
                    {reviewMessage.includes(
                      "successfully"
                    )
                      ? "✓"
                      : "⚠"}{" "}
                    {reviewMessage}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="button"
                  className="submit-review-button"
                  disabled={
                    reviewSubmitting
                  }
                  onClick={() =>
                    handleSubmitReview(
                      selectedBooking
                    )
                  }
                >
                  {reviewSubmitting
                    ? "Saving Review..."
                    : getReview(
                        selectedBooking.id
                      )
                    ? "Update Review"
                    : "Submit Review"}
                </button>

              </div>
            )}

            {/* =================================================
                MODAL ACTIONS
            ================================================= */}

            <div className="modal-actions">

              {canJoinSession(
                selectedBooking
              ) && (
                <button
                  type="button"
                  className="join-session-button"
                  onClick={() => {
                    closeModal();

                    navigate(
                      "/session",
                      {
                        state: {
                          booking:
                            selectedBooking,
                        },
                      }
                    );
                  }}
                >
                  🎥 Join Session
                </button>
              )}

              {selectedBooking.status ===
                "CONFIRMED" &&
                getBookingPeriod(
                  selectedBooking
                ) ===
                  "UPCOMING" && (
                  <button
                    type="button"
                    className="cancel-booking-button"
                    onClick={() =>
                      handleCancelBooking(
                        selectedBooking
                      )
                    }
                  >
                    Cancel Booking
                  </button>
                )}

              <button
                type="button"
                className="modal-secondary-button"
                onClick={closeModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MyBookings;