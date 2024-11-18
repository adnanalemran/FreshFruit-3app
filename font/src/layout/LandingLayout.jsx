
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
const LandingLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
            <Toaster />
        </div>
    );
};

export default LandingLayout;