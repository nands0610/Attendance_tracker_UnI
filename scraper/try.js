import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const COOKIE = process.env.COOKIE;
const API_URL = process.env.API_URL;

async function fetchData() {
  try {
    const url = API_URL
      ;

    const body = {
      filterCriteria: {},
      options: {
        cellFormat: "string",
        timeZone: "UTC",
        userLocale: "en-US",
      },
      pageContext: null,
      pagingOption: {
        offset: null,
        count: 1000,
      },
      sortingOption: {
        sortingField: "Centre Class Schedule",
        sortType: "DESC",
      },
    };

    const response = await axios.post(url, body, {
      headers: {
        "Cookie": COOKIE,
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://build.uandi.org.in/attendance-verification"
      },
    });

    console.log("Status:", response.status);
    console.log("Data:", response.data);

    const records = response.data.records;

    records.forEach((record, index) => {
      console.log(`Record ${index + 1}:`, record.fields);
    });

    records.forEach((record, index) => {
      console.log(`Record ${index + 1}:`, record.fields['Walkthrough ID']);
    });


  } catch (error) {
    console.log("Error occurred!");
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
  }
}

fetchData();
