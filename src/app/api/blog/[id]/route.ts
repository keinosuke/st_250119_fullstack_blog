import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { main } from "../route";

const prisma = new PrismaClient();

// 記事記事取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const id: number = parseInt(req.url.split("/blog/")[1]);
    const post = await prisma.post.findFirst({ where: { id } });

    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// 記事編集用API
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const id: number = parseInt(req.url.split("/blog/")[1]);
    const { title, description } = await req.json();

    await main();

    const post = await prisma.post.update({
      data: { title, description },
      where: { id },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// 記事投稿用API
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const id: number = parseInt(req.url.split("/blog/")[1]);
    const post = await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
