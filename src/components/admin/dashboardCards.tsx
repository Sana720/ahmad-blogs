import { FaRegFileAlt, FaUsers, FaTags, FaCog, FaChartBar } from 'react-icons/fa';

export const dashboardCards = [
  {
    title: 'Total Posts',
    icon: <FaRegFileAlt size={32} className="text-[#3CB371]" />,
    key: 'posts',
    color: 'bg-[#eaf0f6]'
  },
  {
    title: 'Total Authors',
    icon: <FaUsers size={32} className="text-[#3CB371]" />,
    key: 'authors',
    color: 'bg-[#f7f8fa]'
  },
  {
    title: 'Total Categories',
    icon: <FaTags size={32} className="text-[#3CB371]" />,
    key: 'categories',
    color: 'bg-[#eaf0f6]'
  },
  {
    title: 'Total Views',
    icon: <FaChartBar size={32} className="text-[#3CB371]" />,
    key: 'views',
    color: 'bg-[#f7f8fa]'
  },
];
