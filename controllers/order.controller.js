const Order = require('../models/order.model');
const Product = require('../models/product.model');

const orderController = {
  create: async (req, res) => {
    try {
      const { products } = req.body;
      let totalAmount = 0;

      // Validate stock and calculate total amount
      for (let item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.product} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
        }
        totalAmount += product.price * item.quantity;
        
        // Update stock
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      const order = new Order({
        user: req.user._id,
        products,
        totalAmount
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllForUser: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate('products.product')
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = orderController;