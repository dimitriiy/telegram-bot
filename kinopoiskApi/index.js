import axios from "axios";

export const kinopoiskApi = async (filmId) => {
  return axios
    .get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`, {
      method: "GET",
      headers: {
        "X-API-KEY": "e20e46e8-3eb7-40ea-8d72-59d9ea43cd06",
        "Content-Type": "application/json",
      },
    })

    .then((json) => json.data)
    .catch((err) => console.log(err));
};
