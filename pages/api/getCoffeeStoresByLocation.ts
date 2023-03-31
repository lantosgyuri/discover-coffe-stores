import type { NextApiRequest, NextApiResponse } from "next";
import { fetchCoffeStores } from "../../lib/coffe-stores";

const getCoffeeStoresByLocation = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { latLong, limit } = req.query;

    if (typeof latLong !== "string") {
      throw new Error("Query param 'latLong' has to be of type string");
    }

    const response = await fetchCoffeStores(latLong);

    res.status(200).json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500);
  }

  res.status(200);
};

export default getCoffeeStoresByLocation;
