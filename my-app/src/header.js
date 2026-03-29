
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './App.css';

function Home() {
  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="App"
    >

      <header className="App-header">
        <img src="MitraLogo.png" className="App-logo" alt="logo" />
        <h1 style={{ fontSize: "50px" }}>Welcome to Mitra</h1>
        <p>Start your journey</p>
        <Link className="App-link" to="/signup">
          Sign Up
        </Link>
      </header>
      </motion.div>
  );
}

export default Home;

