import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './features/store';
import Landing from './pages/Landing';

// Test 1: Landing page renders Smart Pharmacy title
test('renders Smart Pharmacy title', () => {
    render(
        <Provider store={store}>
            <Landing />
        </Provider>
    );
    const title = screen.getByText(/Smart Pharmacy/i);
    expect(title).toBeInTheDocument();
});

// Test 2: Landing page has Shop Now button
test('renders Shop Now button', () => {
    render(
        <Provider store={store}>
            <Landing />
        </Provider>
    );
    const btn = screen.getByText(/Shop Now/i);
    expect(btn).toBeInTheDocument();
});

// Test 3: Landing page has Sign Up link
test('renders Sign Up link', () => {
    render(
        <Provider store={store}>
            <Landing />
        </Provider>
    );
    const signup = screen.getByText(/Sign Up/i);
    expect(signup).toBeInTheDocument();
});

// Test 4: Landing page has Admin button
test('renders Admin button', () => {
    render(
        <Provider store={store}>
            <Landing />
        </Provider>
    );
    const admin = screen.getByText(/Admin/i);
    expect(admin).toBeInTheDocument();
});
