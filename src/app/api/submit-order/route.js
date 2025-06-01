import { db } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

function generateOrderNumber(userData, productData) {
  const timestamp = Date.now();
  const emailPart = userData.email.split("@")[0].slice(0, 3).toUpperCase();
  const productPart = productData.productId.toString().slice(-4);
  return `ORD-${emailPart}${productPart}-${timestamp}`;
}

export async function POST(request) {
  try {
    await db();
    const { userData, productData } = await request.json();

    const orderNumber = generateOrderNumber(userData, productData);

    const productObjectId = new Types.ObjectId(productData.productId);

    // Step 1: Check product and update quantity
    const product = await Product.findById(productObjectId);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.quantity < productData.quantity) {
      return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
    }

    product.quantity -= productData.quantity;
    await product.save();

    // Step 2: Create the order with productId 
    const order = new Order({
      orderNumber,
      user: userData,
      product: {
        ...productData,
        productId: productObjectId, 
      },
    });
    console.log("🧾 userData received:", userData);

    const savedOrder = await order.save();

    return NextResponse.json(
      {
        message: "Order received successfully",
        orderId: savedOrder._id,
        orderNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


