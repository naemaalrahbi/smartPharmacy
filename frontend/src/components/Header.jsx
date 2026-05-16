import React, { useState } from 'react';
import { Navbar, NavbarToggler, Collapse, Nav, NavItem, NavbarBrand } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaListAlt, FaInfoCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../features/UserSlice';

const BTN_COLOR = "#C27B8A";

function Header() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <Navbar light expand="md" style={{ backgroundColor: '#FFE4E8', padding: '10px 20px', borderBottom: '2px solid ' + BTN_COLOR }}>
            <NavbarBrand style={{ fontWeight: 'bold', fontSize: '20px' }}>
                <Link to="/home" style={{ textDecoration: 'none', color: 'black' }}>
                    💊 Smart Pharmacy
                </Link>
            </NavbarBrand>
            <NavbarToggler onClick={() => setOpen(!open)} />
            <Collapse isOpen={open} navbar>
                <Nav className="ms-auto" navbar>
                    <NavItem className="px-3"><Link to="/home" style={{ color: 'black' }}><FaHome size={20} /></Link></NavItem>
                    <NavItem className="px-3"><Link to="/about" style={{ color: 'black' }}><FaInfoCircle size={20} /></Link></NavItem>
                    <NavItem className="px-3"><Link to="/cart" style={{ color: 'black' }}><FaShoppingCart size={20} /></Link></NavItem>
                    <NavItem className="px-3"><Link to="/my-list" style={{ color: 'black' }}><FaHeart size={20} /></Link></NavItem>
                    <NavItem className="px-3"><Link to="/my-orders" style={{ color: 'black' }}><FaListAlt size={20} /></Link></NavItem>
                    <NavItem className="px-3"><Link to="/profile" style={{ color: 'black' }}><FaUser size={20} /></Link></NavItem>
                    <NavItem className="px-3" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <FaSignOutAlt size={20} color="red" />
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default Header;
