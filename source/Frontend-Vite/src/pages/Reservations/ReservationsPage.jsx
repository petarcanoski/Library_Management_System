import React, { useState, useEffect } from "react";
import {
  AccessAlarm,
  Book,
  BookmarkAdd,
  CheckCircle,
  Close,
  Notifications,
  X,
} from "@mui/icons-material";
import { cancelReservation } from "../../store/features/reservations/reservationThunk";
import { CalendarIcon } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReservationCard from "./ReservationCard";
import { createReservation, getMyReservations }
    from "../../store/features/reservations/reservationThunk";

const ReservationsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  // const [bookId, setBookId] = useState("");
    const [isbn, setIsbn] = useState("");
    const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading] = useState(false);
  // const [reservations, setReservations] = useState([]);

  const dispatch = useDispatch();
  const {reservations}=useSelector((state)=>state.reservations)

  console.log("reservations ---------------", reservations);


  useEffect(() => {

    loadReservations();
  }, [activeTab, filterStatus]);

  const loadReservations=()=>{
    dispatch(
      getMyReservations({
        status: filterStatus || null,
        activeOnly: activeTab === 1 ? true : false,
        page: 0,
        size: 20,
      })
    );
  }



  // const handleCreateReservation = async () => {
  //   if (!bookId.trim()) {
  //     showSnackbar("Please enter a book ID", "warning");
  //     return;
  //   }
  //   showSnackbar("Reservation created successfully!", "success");
  //   setCreateDialogOpen(false);
  //   setBookId("");
  //
  // };

    const handleCreateReservation = async () => {
        if (!isbn.trim()) {
            showSnackbar("Please enter ISBN", "warning");
            return;
        }

        try {
            await dispatch(
                createReservation({
                    isbn: isbn.trim(),
                    notes: null,
                })
            ).unwrap();

            showSnackbar("Reservation created successfully!", "success");
            setCreateDialogOpen(false);
            setIsbn("");
            loadReservations();
        } catch (error) {
            showSnackbar(
                typeof error === "string" ? error : error.message,
                "error"
            );
        }
    };




    const handleCancelReservation = async () => {
        try {
            await dispatch(
                cancelReservation(selectedReservation.id)
            ).unwrap();

            showSnackbar("Reservation cancelled successfully", "success");
            setCancelDialogOpen(false);
            setSelectedReservation(null);

            loadReservations();
        } catch (error) {
            showSnackbar(error || "Failed to cancel reservation", "error");
        }
    };



  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(
      () => setSnackbar({ open: false, message: "", severity: "success" }),
      4000
    );
  };









  const tabs = [
    { label: "All Reservations", icon: <Book className="w-5 h-5" /> },
    { label: "Active", icon: <AccessAlarm className="w-5 h-5" /> },
    { label: "Completed", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const stats = {
    total: reservations.length,
    active: reservations.filter((r) =>
      ["PENDING", "AVAILABLE"].includes(r.status)
    ).length,
    available: reservations.filter((r) => r.status === "AVAILABLE").length,
  };



  const EmptyState = () => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 text-center border-2 border-dashed border-gray-300 animate-fade-in">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center opacity-20">
        <Book className="w-16 h-16 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-700 mb-2">
        No reservations found
      </h3>
      <p className="text-gray-500 mb-6 text-lg">
        {activeTab === 0
          ? "You haven't made any reservations yet"
          : `No ${tabs[activeTab].label.toLowerCase()} reservations`}
      </p>
      <button
        onClick={() => setCreateDialogOpen(true)}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
      >
        <BookmarkAdd className="w-5 h-5" />
        Create Your First Reservation
      </button>
    </div>
  );

  return (
    <div className="min-h-screen  py-8">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl ">📖</span>
            <span className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600  bg-clip-text text-transparent py-2">
              My Reservations
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Manage and track your book reservations
          </p>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Total Reservations
                </p>
                <p className="text-4xl font-extrabold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Book className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-800 uppercase tracking-wide">
                  Active
                </p>
                <p className="text-4xl font-extrabold text-yellow-900 mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
                <AccessAlarm className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                  Ready to Pick Up
                </p>
                <p className="text-4xl font-extrabold text-green-900 mt-1">
                  {stats.available}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div
          className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex border-b border-gray-200">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 px-6 py-4 font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                  activeTab === index
                    ? "text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>


        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.map((reservation, index) => (
                  <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      index={index}
                      onCancel={(res) => {
                          setSelectedReservation(res);
                          setCancelDialogOpen(true);
                      }}
                  />
              ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      {createDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center gap-3">
              <BookmarkAdd className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Create New Reservation
              </h2>
            </div>
            <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Book ISBN
                </label>

                <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="9780134685991"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    autoFocus
                />

                <p className="mt-2 text-sm text-gray-500">
                    Enter the ISBN printed on the book
                </p>

            </div>
            <div className="px-6 pb-6 flex gap-3 bg-gray-50">
              <button
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReservation}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <BookmarkAdd className="w-5 h-5" />
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className="bg-red-50 px-6 py-4 flex items-center gap-3">
              <X className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-red-700">
                Cancel Reservation
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-4">
                Are you sure you want to cancel this reservation
                <strong>{selectedReservation?.book?.isbn}</strong>?
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-center gap-2">
                  <Notifications className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-semibold text-yellow-800">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3 bg-gray-50">
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="cursor-pointer hover:bg-red-50 hover:scale-105 active:scale-95
  flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancelReservation}
                className=" cursor-pointer hover:bg-red-50 hover:scale-105 active:scale-95
 flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Close className="w-5 h-5" />
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div
            className={`px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 ${
              snackbar.severity === "success"
                ? "bg-green-500"
                : snackbar.severity === "error"
                ? "bg-red-500"
                : snackbar.severity === "warning"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
          >
            {snackbar.severity === "success" && (
              <CheckCircle className="w-6 h-6 text-white" />
            )}
            {snackbar.severity === "error" && (
              <Notifications className="w-6 h-6 text-white" />
            )}
            {snackbar.severity === "warning" && (
              <Notifications className="w-6 h-6 text-white" />
            )}
            <span className="text-white font-semibold text-lg">
              {snackbar.message}
            </span>
            <button
              onClick={() => setSnackbar({ ...snackbar, open: false })}
              className="ml-2"
            >
              <X className="w-5 h-5 text-white hover:text-gray-200" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
