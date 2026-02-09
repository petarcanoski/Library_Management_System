import { EventAvailable } from '@mui/icons-material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import GetStatusChip from './getStatusChip';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getMyReservations } from '../../store/features/reservations/reservationThunk';
import { useDispatch } from 'react-redux';

const Reservation = () => {
    
    const navigate = useNavigate();
      const { reservations } = useSelector((state) => state.reservations);
      const dispatch = useDispatch();
        useEffect(() => {
         
          loadReservations();
        }, []);
      
        const loadReservations=()=>{
          dispatch(
            getMyReservations({
             
              page: 0,
              size: 20,
            })
          );
        }
  return (
 <div className="p-6">
  <h3 className="text-2xl font-bold text-gray-900 mb-6">
    Your Book Reservations
  </h3>

  {/* EMPTY STATE */}
  {reservations.length === 0 ? (
    <div className="text-center py-12 border border-dashed rounded-xl">
      <p className="text-gray-500 text-lg">
        📚 You haven’t reserved any books yet
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Browse the library and reserve your next read!
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
        >
          {/* LEFT */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-16 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <EventAvailable
                sx={{
                  fontSize: 32,
                  color: "#9333EA",
                  opacity: 0.3,
                }}
              />
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {reservation.bookTitle}
              </h4>
              <p className="text-gray-600 mb-2">
                {reservation.bookAuthor}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Reserved:{" "}
                  {new Date(reservation.reservedAt).toLocaleDateString()}
                </span>

                <GetStatusChip status={reservation.status} />

                {reservation.status === "PENDING" && (
                  <>
                    <span className="text-gray-600">
                      Queue Position: #{reservation.queuePosition}
                    </span>

                    {reservation.availableAt && (
                      <span className="text-gray-600">
                        Est. Available:{" "}
                        {new Date(
                          reservation.availableAt
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </>
                )}

                {reservation.status === "READY" && (
                  <span className="text-green-600 font-medium">
                    Ready for pickup
                  </span>
                )}
              </div>

              {reservation.notes && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  “{reservation.notes}”
                </p>
              )}
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/books/${reservation.bookId}`)}
              sx={{ borderColor: "#9333EA", color: "#9333EA" }}
            >
              View
            </Button>

            {reservation.status === "READY" && (
              <Button
                variant="contained"
                size="small"
                sx={{ bgcolor: "#10B981" }}
              >
                Pick Up
              </Button>
            )}

            {reservation.canBeCancelled && reservation.status === "PENDING" && (
              <Button
                variant="outlined"
                size="small"
                color="error"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  )
}

export default Reservation