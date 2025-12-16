import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-6xl font-extrabold text-primary">404</h1>
            <p className="mt-4 text-xl text-gray-600">Page not found.</p>
            <Link to="/" className="mt-8 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
