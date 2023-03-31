import type { NextApiRequest, NextApiResponse } from "next";
import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.json("not allowed");
    return;
  }

  const { body } = req;

  if (!body.id) {
    res.json("missing id");
    return;
  }

  try {
    const record = await findRecordByFilter(body.id);

    if (record.length > 0) {
      res.json(record);
      return;
    }

    if (!body.name) {
      res.json("missing name");
      return;
    }

    const newRecords = await table.create([
      {
        fields: body,
      },
    ]);

    const mappedRecords = getMinifiedRecords(newRecords);

    res.json(mappedRecords);
  } catch (error) {
    res.status(500);
    return;
  }
};

export default createCoffeeStore;
