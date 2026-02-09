import React from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useEffect, useState } from 'react';

const Stats = () => {
  const stats = [
    {
      icon: MenuBookIcon,
      value: 10000,
      suffix: '+',
      label: 'Books Available',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: PeopleIcon,
      value: 5000,
      suffix: '+',
      label: 'Active Members',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: EmojiEventsIcon,
      value: 50,
      suffix: '+',
      label: 'Award Winning',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: TrendingUpIcon,
      value: 98,
      suffix: '%',
      label: 'Satisfaction Rate',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Impact in{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Numbers
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied readers who trust Zosh Library for their reading journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} Icon={stat.icon} index={index} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center animate-fade-in-up animation-delay-600">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 border-4 border-white flex items-center justify-center text-white font-bold text-sm"
                >
                  {i === 4 ? '+' : '👤'}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-900">1,200+</p>
              <p className="text-gray-600">New members joined this month</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Counter animation component
const StatCard = ({ stat, Icon, index }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = stat.value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
              setCount(stat.value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`stat-${index}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated, stat.value, index]);

  return (
    <div
      id={`stat-${index}`}
      className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      {/* Icon */}
      <div className={`inline-flex p-4 rounded-xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={stat.color} sx={{ fontSize: 32 }} />
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-4xl font-bold text-gray-900">
          {count.toLocaleString()}
        </span>
        <span className={`text-4xl font-bold ${stat.color}`}>
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-gray-600 font-medium">{stat.label}</p>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color.replace('text-', 'from-')} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    </div>
  );
};

export default Stats;
