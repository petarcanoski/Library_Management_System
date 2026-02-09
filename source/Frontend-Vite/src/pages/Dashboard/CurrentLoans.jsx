import React from 'react'
import { useSelector } from 'react-redux';

import { getDaysRemainingColor } from './utils';
import { useNavigate } from 'react-router-dom';
import GetStatusChip from './getStatusChip';
import CurrentLoanCard from './CurrentLoanCard';
import { fetchMyBookLoans } from '../../store/features/bookLoans/bookLoanThunk';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const CurrentLoans = () => {
  
    const { myLoans } = useSelector((state) => state.bookLoans);
 

    

  return (
      <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Books You're Currently Reading
                </h3>

                <div className="space-y-4">
                  {myLoans.map((loan) => (
                    <CurrentLoanCard key={loan.id} loan={loan} />
                  ))}
                </div>
              </div>
  )
}

export default CurrentLoans