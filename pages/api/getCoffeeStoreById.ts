import type { NextApiRequest, NextApiResponse } from "next";
import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const getCoffeeStoreById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    throw new Error("Query param 'id' has to be of type string");
  }

  if (!id) {
    res.json("id is missing");
    return;
  }

  try {
    const record = await findRecordByFilter(id);

    if (record.length > 0) {
      res.json(record);
    }
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

export default getCoffeeStoreById;
