import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/LoginPage/LoginPage';
import HomePage from '../pages/Home/HomePage';
import PropertyDetailPage from '../pages/PropertyDetail/PropertyDetailPage';
import CreatePropertyPage from '../pages/CreatePropertyPage/CreatePropertyPage';


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/property/create" element={<CreatePropertyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;


