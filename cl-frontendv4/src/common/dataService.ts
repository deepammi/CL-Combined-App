import axios from "axios";

export const getBuyerData = async () => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASEURL}/buyer-list`;
      console.log("endpoint => ", endpoint);
      let result = await axios.get(endpoint);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };