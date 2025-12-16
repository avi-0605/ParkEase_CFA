import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, CreditCard, Zap, ChevronRight, Shield, Smartphone, Star, Car, User, Calendar } from 'lucide-react';
import DashboardImage from '../assets/Dashboard_Image.webp';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const stepsRef = useRef(null);
    const statsRef = useRef(null);
    const testimonialsRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        // Hero Animations
        const heroCtx = gsap.context(() => {
            gsap.from('.animate-hero', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, heroRef);

        // Features Animation
        gsap.fromTo(featuresRef.current.children,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 80%",
                }
            }
        );

        // Steps Animation
        gsap.fromTo('.step-card',
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: stepsRef.current,
                    start: "top 75%",
                }
            }
        );

        // Stats Animation
        gsap.from('.stat-item', {
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: statsRef.current,
                start: "top 80%",
            }
        });

        // Testimonials Animation
        gsap.from('.testimonial-card', {
            x: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: testimonialsRef.current,
                start: "top 80%",
            }
        });

        // CTA Animation
        gsap.from(ctaRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
            }
        });

        return () => {
            heroCtx.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-dark text-white pt-24 pb-16 lg:pb-32 lg:pt-32">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent z-10"></div>
                    <img src="https://images.unsplash.com/photo-1573152958734-192f8a85e486?q=80&w=2669&auto=format&fit=crop" alt="City Background" className="w-full h-full object-cover" />
                </div>

                <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 animate-hero backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                                Smart Parking v2.0 is Live
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-hero leading-tight">
                                Parking Made <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Effortless & Smart.</span>
                            </h1>
                            <p className="mt-4 text-xl text-slate-300 max-w-2xl animate-hero font-light mx-auto lg:mx-0">
                                Stop circling the block. Find, book, and pay for parking in real-time.
                                Experience the future of urban mobility with ParkEase.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-hero">
                                <Link
                                    to="/parking-lots"
                                    className="px-8 py-4 rounded-xl text-lg font-bold text-white bg-primary hover:bg-blue-600 shadow-glow transition-all transform hover:-translate-y-1 flex items-center justify-center"
                                >
                                    Find a Spot <MapPin className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-8 py-4 rounded-xl text-lg font-bold text-white border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all flex items-center justify-center"
                                >
                                    Get Started <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image / Dashboard Preview */}
                        <div className="lg:w-1/2 animate-hero relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group transform transition duration-500 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent z-10 pointer-events-none"></div>
                                <img
                                    src={DashboardImage}
                                    alt="ParkEase Dashboard"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl hidden md:block animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                                        <Zap className="text-emerald-400 h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                                        <p className="text-white font-bold">Live Updates</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-20"></div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
                        <div className="stat-item">
                            <div className="text-4xl font-bold text-primary mb-2">50+</div>
                            <div className="text-slate-500 font-medium">Locations</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                            <div className="text-slate-500 font-medium">Happy Drivers</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-slate-500 font-medium">Support</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-4xl font-bold text-primary mb-2">4.9</div>
                            <div className="text-slate-500 font-medium">App Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-slate-50 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Why Choose ParkEase?</h2>
                        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                            We combine cutting-edge technology with user-centric design to solve the most frustrating part of driving.
                        </p>
                    </div>

                    <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Clock className="h-8 w-8 text-primary" />}
                            title="Real-Time Availability"
                            description="See exactly which spots are open right now. No more guessing."
                        />
                        <FeatureCard
                            icon={<Zap className="h-8 w-8 text-yellow-500" />}
                            title="Instant Booking"
                            description="Reserve your spot in seconds. Your space waits for you."
                        />
                        <FeatureCard
                            icon={<CreditCard className="h-8 w-8 text-accent" />}
                            title="Seamless Payments"
                            description="Pay digitally. Calculated automatically based on duration."
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-green-500" />}
                            title="Secure & Reliable"
                            description="Verified parking lots with 24/7 security monitoring."
                        />
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mt-2">How It Works</h2>
                    </div>

                    <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                        <div className="step-card text-center relative bg-white p-6">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg relative z-10">
                                <MapPin className="h-10 w-10 text-primary" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold border-2 border-white">1</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Find a Location</h3>
                            <p className="text-slate-500">Search for parking spots near your destination using our interactive map.</p>
                        </div>

                        <div className="step-card text-center relative bg-white p-6">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg relative z-10">
                                <Calendar className="h-10 w-10 text-primary" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold border-2 border-white">2</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Book Your Spot</h3>
                            <p className="text-slate-500">Select your time slot and vehicle. Confirm your booking instantly.</p>
                        </div>

                        <div className="step-card text-center relative bg-white p-6">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg relative z-10">
                                <Car className="h-10 w-10 text-primary" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold border-2 border-white">3</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Park & Go</h3>
                            <p className="text-slate-500">Navigate to your spot, park drastically, and enjoy your day.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">What Drivers Say</h2>
                    </div>
                    <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Alex Morgan"
                            role="Daily Commuter"
                            text="ParkEase changed my morning routine. I book my spot while having breakfast and drive straight there. No more stress!"
                        />
                        <TestimonialCard
                            name="Sarah Jenkins"
                            role="Event Goer"
                            text="Used it for a concert last week. The navigation took me right to my reserved spot. Super smooth experience."
                        />
                        <TestimonialCard
                            name="David Chen"
                            role="Business Traveler"
                            text="The best parking app I've used. The interface is clean, and the real-time availability is actually accurate."
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white py-24" ref={ctaRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-primary to-blue-700 rounded-3xl shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="relative z-10 px-6 py-16 md:py-20 text-center md:text-left md:flex md:items-center md:justify-between">
                            <div className="md:w-2/3">
                                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                    Ready to park smarter?
                                </h2>
                                <p className="mt-4 text-lg text-blue-100">
                                    Join thousands of drivers saving time and money every day.
                                </p>
                            </div>
                            <div className="mt-8 md:mt-0 flex justify-center md:justify-end">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 rounded-xl text-lg font-bold text-primary bg-white hover:bg-blue-50 shadow-lg transition-transform transform hover:scale-105"
                                >
                                    Create Free Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
);

const TestimonialCard = ({ name, role, text }) => (
    <div className="testimonial-card bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
        </div>
        <p className="text-slate-600 mb-6 italic">"{text}"</p>
        <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold mr-3">
                {name[0]}
            </div>
            <div>
                <h4 className="font-bold text-slate-900">{name}</h4>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{role}</p>
            </div>
        </div>
    </div>
);

export default Home;
