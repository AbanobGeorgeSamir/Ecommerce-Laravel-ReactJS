import { Routes, Route, Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { useAuth } from './context/useAuth';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Cart from './pages/Cart';
import ProductShow from './pages/ProductShow';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import EditCategory from './pages/admin/EditCategory';
import ManageOrders from './pages/admin/ManageOrders';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { isAdminUser } from './utils/api';

const StoreLayout = () =>
<>
        <Navbar />
        <Outlet />
    </>;

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
            </div>);

  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
            <Routes>
                <Route element={<StoreLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:id" element={<ProductShow />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<StoreLayout />}>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/:id" element={<OrderDetailPage />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute adminOnly={true} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="products" element={<ManageProducts />} />
                        <Route path="categories" element={<ManageCategories />} />
                        <Route path="categories/:id" element={<EditCategory />} />
                        <Route path="orders" element={<ManageOrders />} />
                    </Route>
                </Route>

                <Route
          path="*"
          element={
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                            <h1 className="text-5xl font-black text-slate-900">404</h1>
                            <p className="text-slate-500 mt-3">The page you requested could not be found.</p>
                            <Link to="/" className="mt-6 text-blue-600 font-bold hover:underline">
                                Go back home
                            </Link>
                        </div>
          } />

            </Routes>
        </div>);

}
