import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/LoginPage/LoginPage';
import HomePage from '../pages/Home/HomePage';
import PropertyDetailPage from '../pages/PropertyDetail/PropertyDetailPage';
import CreatePropertyPage from '../pages/CreatePropertyPage/CreatePropertyPage';
import SendMessagePage from '../pages/SendMessagePage/SendMessagePage';
import SignUpPage from '../pages/SignUpPage/SignupPage';
import MyMessages from "../pages/MyMessages/MyMessages";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/property/create" element={<CreatePropertyPage />} />
        <Route path="/properties/:id/message" element={<SendMessagePage />} />
        <Route path="/my-messages" element={<MyMessages />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;


