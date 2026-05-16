import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from './components/Header';
import Footer from './components/Footer';

import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import AdminProducts from './admin/AdminProducts';
import MyList from './pages/MyList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderDetails from './pages/OrderDetails';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import OrderCancelled from './pages/OrderCancelled';

function App() {
    const email = useSelector((state) => state.users.user?.email);

    return (
        <Router>
            {email && <Header />}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/my-list" element={<MyList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/track-order/:id" element={<TrackOrder />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order-cancelled" element={<OrderCancelled />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
