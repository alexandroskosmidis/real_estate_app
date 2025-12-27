import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';

import LoginPage from '../pages/LoginPage/LoginPage';
import HomePage from '../pages/Home/HomePage';
import PropertyDetailPage from '../pages/PropertyDetail/PropertyDetailPage';
import PropertyCreatePage from '../pages/PropertyCreate/PropertyCreatePage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/property/create" element={<PropertyCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;


