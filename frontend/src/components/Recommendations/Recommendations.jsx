import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext.jsx"; // adjust path if needed
import "./Recommendations.css";

const Recommendations = ({ userIdProp }) => {
  const { url, token, user } = useContext(StoreContext);
  const [recommendations, setRecommendations] = useState([]);

  // prefer userId from context, fallback to prop, fallback to localStorage
  const userId = (user && user._id) || userIdProp || localStorage.getItem("userId");

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) return;
      try {
        const headers = token ? { token } : {};
        const res = await axios.get(`${url}/api/recommendations/${userId}`, { headers });
        setRecommendations(res.data || []);
      } catch (err) {
        console.error("fetch recommendations error:", err);
      }
    };
    fetchRecommendations();
  }, [userId, token, url]);

  if (!recommendations || !recommendations.length) return null;

  return (
    <section className="recommendations">
      <h3>Recommended for You</h3>
      <div className="recommendation-list">
        {recommendations.map(item => (
          <div key={item._id} className="food-card">
            <img src={item.image} alt={item.name} className="food-image" />
            <p className="food-name">{item.name}</p>
            <p className="food-price">₹{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
