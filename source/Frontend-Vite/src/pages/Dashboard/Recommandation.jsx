import React from 'react'
import { recommendations } from './recommandData'
import { useNavigate } from 'react-router-dom';
import { AutoAwesome } from '@mui/icons-material';
import { Button } from '@mui/material';

const Recommandation = () => {
    const navigate = useNavigate();
  return (
    <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Recommended For You
                </h3>
                <p className="text-gray-600 mb-6">
                  Based on your reading history and preferences
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {recommendations.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                        <AutoAwesome
                          sx={{ fontSize: 64, color: "#4F46E5", opacity: 0.3 }}
                        />
                      </div>

                      <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {book.author}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/books")}
                    sx={{
                      borderColor: "#4F46E5",
                      color: "#4F46E5",
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    Explore All Books
                  </Button>
                </div>
              </div>
  )
}

export default Recommandation