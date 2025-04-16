import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <>
        <div className="all-page">
            <div className="landing-page">
                <Navbar />
                <div className="landing-content">
                    <div className="text-section">
                        <h1>Plan Smart. Stay Ahead.</h1>
                        <p>Manage and track your appointments and events seamlessly.<br />
                        Join us today and never miss an important date again!<br/>
                        Our platform offers a comprehensive solution for all your event management needs.</p>
                        <button onClick={() => navigate('/signup')}>Get Started</button>
                    </div>
                    
                    <div className="image-section">
                        <img src="https://www.proglobalevents.com/wp-content/uploads/bigstock-People-Planning-Concept-Entre-327380749-1.jpg" alt="Event Planning" />
                    </div>
                </div>
            </div>
            <div className="features-section">
                <h2>Features</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>Event Management</h3>
                        <p>Organize and manage your events with ease.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Registration Tracking</h3>
                        <p>Keep track of all your registrations in one place.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Reminders</h3>
                        <p>Never miss an important event with our reminder system.</p>
                    </div>
                </div>
            </div> {/* Closing the features-section div */}
            <footer>
                <p>© 2023 Your Company. All rights reserved.</p>
            </footer>
            </div>
        </>
    );
};

export default Landing;
