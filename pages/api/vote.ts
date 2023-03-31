import type { NextApiRequest, NextApiResponse } from "next";
import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const vote = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    res.json("not allowed");
    return;
  }

  const { body } = req;

  if (!body.id) {
    res.json("missing id or vote count");
    return;
  }

  try {
    const records = await findRecordByFilter(body.id);

    if (records.length < 1) {
      res.json("item not exist");
      return;
    }

    const record = records[0];

    const calculateVoting = parseInt(record.voting) + 1;

    const updateRecord = await table.update([
      {
        id: record.recordId,
        fields: {
          voting: calculateVoting,
        },
      },
    ]);

    const mappedRecords = getMinifiedRecords(updateRecord);

    res.json(mappedRecords);
  } catch (error) {
    res.status(500);
    return;
  }
};

export default vote;
