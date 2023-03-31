import { createApi } from "unsplash-js";

const key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const unsplash = createApi({
  accessKey: key!,
});

const getUrlForCoffeStores = (
  query: string,
  latLong: string,
  limit: number
): string => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });

  return photos.response?.results.map((result) => result.urls["small"]);
};

export const fetchCoffeStores = async (
  latLong = "47.6639743970019,10.577372616557078"
) => {
  const photos = await getListOfCoffeStorePhotos();

  const apiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: apiKey!,
    },
  };

  const response = await fetch(
    getUrlForCoffeStores("coffee", latLong, 6),
    options
  );

  const data = await response.json();

  return data.results.map((result: any, index: number) => {
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address,
      neighborhood: result.location.locality,
      imgUrl: photos![index],
    };
  });
};
