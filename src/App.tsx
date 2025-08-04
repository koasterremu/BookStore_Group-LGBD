import React from "react";
// import components
import Header from "./components/Header/Header";
import Subscribe from "./components/Subscribe/Subscribe";
import Footer from "./components/Footer/Footer";
import BackToTopBtn from "./components/Other/BackToTopBtn";
import NavigationList from "./components/Other/NavigationList";
import { ToastContainer } from "react-toastify";
// import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Compare from "./pages/Compare";
import Wishlist from "./pages/Wishlist";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import ProtectedRoute from "./utils/ProtectedRoute"; // Import ProtectedRoute
// import react-router
import { BrowserRouter, Route } from "react-router-dom";
// import store
import store from "./redux/store/store";
// import Provider
import { Provider } from "react-redux";
import CheckOutSuccess from "./components/CheckOutSuccess/CheckOutSuccess";
import History from "./pages/History";
import CheckoutVNPay from "./pages/CheckoutVNPay";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import NewDetail from "./pages/NewsDetail";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <header>
            <Header />
          </header>

          <main>
            <Route path="/" component={Home} exact />
            <Route path="/about" component={About} />
            <Route path="/shop" component={Shop} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/compare" component={Compare} />
            <Route path="/wishlist" component={Wishlist} />
            <Route path="/cart" component={ShoppingCart} />
            <ProtectedRoute path="/profile" component={Profile} />{" "}
            {/* Protected */}
            <ProtectedRoute path="/checkout" component={Checkout} />{" "}
            {/* Protected */}
            <ProtectedRoute
              path="/checkoutvnpay"
              component={CheckoutVNPay}
            />{" "}
            {/* Protected */}
            <ProtectedRoute
              path="/checkoutsuccess"
              component={CheckOutSuccess}
            />{" "}
            {/* Protected */}
            <ProtectedRoute path="/history" component={History} />{" "}
            {/* Protected */}
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/product-details/:id" component={ProductDetails} />
            <Route path="/news/:id" component={NewDetail} />
            {/* <Subscribe /> */}
          </main>

          <footer>
            <Footer />
          </footer>

          <BackToTopBtn />
          <NavigationList />
          <ToastContainer position="top-right" autoClose={4000} closeOnClick />
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
