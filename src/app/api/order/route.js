import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await db();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing order ID" }, { status: 400 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    console.log(NextResponse.json)


    return NextResponse.json({
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      fullName: order.user.fullName,
      email: order.user.email,
      status: "Confirmed",
      product: {
        title: order.product.productName,
        variant: order.product.variant,
        qty: order.product.quantity,
        price: order.product.pricePerUnit,
      },
      createdAt: order.createdAt,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
