import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    fullName: String,
    email: String,
    country: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    cardNumber: String,
    expiryDate: String,
    cvv: String,
  },
  product: {
    productName: String,
    variant: String,
    quantity: Number,
    pricePerUnit: Number,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
