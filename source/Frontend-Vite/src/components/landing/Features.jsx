import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SecurityIcon from '@mui/icons-material/Security';

const Features = () => {
  const features = [
    {
      icon: SearchIcon,
      title: 'Smart Book Search',
      description: 'Find your perfect book with our advanced search filters. Search by title, author, genre, or ISBN.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: EventIcon,
      title: 'Online Reservation',
      description: 'Reserve books online and pick them up at your convenience. Get instant notifications.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: PaymentIcon,
      title: 'Secure Payments',
      description: 'Integrated payment gateway for membership fees and fines. Multiple payment options available.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: PeopleIcon,
      title: 'Digital Membership',
      description: 'Manage your membership digitally. Track borrowed books, due dates, and reading history.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: BookmarkIcon,
      title: 'Personal Library',
      description: 'Create your reading lists, save favorites, and get personalized recommendations.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: SecurityIcon,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We respect your privacy and protect your information.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Zosh Library
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience modern library management with cutting-edge features designed for book lovers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={feature.color} sx={{ fontSize: 32 }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color.replace('text-', 'from-')} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up animation-delay-600">
          <p className="text-gray-600 mb-6 text-lg">
            Ready to explore our features?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
