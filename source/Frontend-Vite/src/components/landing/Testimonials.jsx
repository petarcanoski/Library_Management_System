import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Teacher',
      image: '👩‍🏫',
      rating: 5,
      text: 'FINKI Library has transformed the way I discover and access books. The online reservation system is incredibly convenient, and the collection is outstanding!',
      color: 'text-blue-600',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      image: '👨‍💻',
      rating: 5,
      text: 'As a busy professional, I love how easy it is to manage my reading list and renewals online. The digital membership feature is a game-changer!',
      color: 'text-purple-600',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student',
      image: '👩‍🎓',
      rating: 5,
      text: 'The book search feature is amazing! I can quickly find research materials for my studies. The staff recommendations have helped me discover so many great books.',
      color: 'text-pink-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Members{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Say
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our community of passionate readers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <FormatQuoteIcon sx={{ fontSize: 64, color: '#4F46E5' }} />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{ fontSize: 20, color: '#FBBF24' }}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-2xl shadow-md`}>
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 shadow-lg animate-fade-in-up animation-delay-600">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Join Our Community of Readers
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Become a member today and start your reading journey with access to thousands of books and exclusive benefits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg">
              View Membership Plans
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
