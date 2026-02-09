import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyBookLoans } from "../../store/features/bookLoans/bookLoanThunk";
import { useEffect } from "react";
import { History } from "@mui/icons-material";

const ReadingHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myLoans } = useSelector((state) => state.bookLoans);

  const loadLoans = () => {
    const status = "RETURNED";
    dispatch(
      fetchMyBookLoans({
        status,
        page: 0,
        size: 20,
      })
    );
  };

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Your Reading History
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myLoans.map((history) => (
          <div
            key={history.id}
            onClick={() => navigate(`/books/${history.bookId}`)}
            className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1"
          >
           {history.bookCoverImage? <img src={history.bookCoverImage} alt={history.bookTitle} className="aspect-[3/4] rounded-lg mb-3" /> : <div className="aspect-[3/4] bg-gradient-to-br from-green-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
              <History sx={{ fontSize: 64, color: "#10B981", opacity: 0.3 }} />
            </div>}

            <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
              {history.bookTitle}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
              {history.bookAuthor}
            </p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {new Date(history.returnDate).toLocaleDateString()}
              </span>
              <div className="flex items-center">
                {[...Array(history.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    ★★★★★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingHistory;
