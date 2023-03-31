const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

export const table = base("coffe-stores");

const getMinifiedRecord = (record: any) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

export const getMinifiedRecords = (fetchedRecords: any) => {
  return fetchedRecords.map((record: any) => getMinifiedRecord(record));
};

export const findRecordByFilter = async (id: string) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  if (findCoffeeStoreRecords.length !== 0) {
    return getMinifiedRecords(findCoffeeStoreRecords);
  }

  return [];
};
