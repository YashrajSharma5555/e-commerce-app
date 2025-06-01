import { NextResponse } from 'next/server';
import { db } from '@/lib/db'
import Product from '@/models/Product';

export async function GET() {
  try {
    await db();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}


