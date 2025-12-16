const Footer = () => {
    return (
        <footer className="bg-dark text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold">ParkEase</h2>
                        <p className="text-gray-400 mt-2">Smart Parking Finder & Booking System</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white transition">About</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} ParkEase. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
