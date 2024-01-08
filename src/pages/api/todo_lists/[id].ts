import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = req.query.id;
    const todo = await db.todo.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(todo);
  } else if (req.method === "PUT") {
    const params = JSON.parse(req.body);
    const { title, description, completionDate, status } = params;
    const newTodo = await db.todo.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        title,
        description,
        completionDate,
        status,
      },
    });
    res.status(200).json(newTodo);
  } else if (req.method === "DELETE") {
    await db.todo.delete({
      where: {
        id: Number(req.query.id),
      },
    });
    res.status(200).json({ response: "ok" });
  }
}
