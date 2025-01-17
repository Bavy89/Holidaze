import { useState, useEffect } from "react";

export const useApi = (url, options) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        setData(json);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    fetchData();
  }, [url, options]);

  return { data, status };
};
