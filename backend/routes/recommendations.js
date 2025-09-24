import express from "express";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";

const router = express.Router();

// GET /api/recommendations/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all orders of this user
    const orders = await orderModel.find({ userId });

    if (orders.length === 0) {
      // fallback: return popular items
      const popularFoods = await foodModel.find().limit(5);
      return res.json({ success: true, data: popularFoods });
    }

    // Count frequency of each item
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item._id] = (itemCounts[item._id] || 0) + item.quantity;
      });
    });

    // Sort items by frequency
    const topItemIds = Object.keys(itemCounts).sort(
      (a, b) => itemCounts[b] - itemCounts[a]
    );

    // Fetch full item details
    const recommendedFoods = await foodModel.find({ _id: { $in: topItemIds } }).limit(5);

    res.json({ success: true, data: recommendedFoods });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
