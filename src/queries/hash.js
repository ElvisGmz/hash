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

export const getFileHash = async (file, type = 'md4') => {
  // if (!file) {
  //   return;
  // }
  console.log(file)
  try {
    const response = await fetch(
      `${BASE_URL}${type}/hex`,
      {
        method: 'POST',
        body: file,
        redirect: 'follow'
      },
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
