const BASE_URL = "https://api.hashify.net/hash/";

export const getHash = async (value = '', type = 'md4') => {
  try {
    const response = await fetch(
      `${BASE_URL}${type}/hex?value=${value}`,
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
