import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { isAdminUser } from '../utils/api';

export const useAuthForm = (type = 'login') => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === 'login' ? '/login' : '/register';
      const { data } = await api.post(endpoint, formData);
      const authenticatedUser = data?.user || data?.data?.user;
      const token = data?.token || data?.data?.token;

      if (!token) {
        throw new Error('Missing API token in authentication response');
      }

      const currentUser = await login(authenticatedUser, token);

      toast.success(type === 'login' ? 'Welcome back!' : 'Account created successfully!');

      const fallbackPath = isAdminUser(currentUser) ? '/admin' : '/';
      const redirectTo = location.state?.from?.pathname || fallbackPath;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        Object.values(err.response.data.errors).flat().forEach((message) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading };
};
