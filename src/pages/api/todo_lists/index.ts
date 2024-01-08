import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const todoLists = await db.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        completionDate: true,
        status: true,
        updatedAt: true,
      },
    });
    res.status(200).json(todoLists);
  } else if (req.method === "POST") {
    const params = JSON.parse(req.body);
		const { title, description, completionDate, status } = params;
    const newTodo = await db.todo.create({
      data: {
        title,
        description,
        completionDate,
        status,
      },
    });
    res.status(200).json(newTodo);
  }
}
