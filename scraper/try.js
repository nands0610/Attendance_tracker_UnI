import axios from "axios";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const COOKIE = process.env.COOKIE;
const API_URL = process.env.API_URL;

async function uploadToDB(data) {
  const { error } = await supabase
    .from("attendance_records")
    .upsert(data, {
      onConflict: "date,lc_leader_name,attendance_type"
    });

  if (error) {
    console.log("Error inserting:", error);
  } else {
    console.log("Successfully inserted!");
  }
}

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

    function extractDate(y) {
      const raw = y.fields["Walkthrough ID"];  // e.g. "Name - BLM, 12/10/25"
      const datePart = raw.split(",")[1].trim();   // "12/10/25"

      const [day, month, year] = datePart.split("/");
      const fullYear = "20" + year;

      return `${fullYear}-${month}-${day}`;
    }

    const records = response.data.records;

    const finalData = records.map(record => ({
      date: extractDate(record),
      lc_leader_name: record.fields["LC Leader Name"].split('-')[0].trim(),
      attendance_type: record.fields["Attendance Type"],
      duration: record.fields["Duration"]
    }));

    await uploadToDB(finalData);

  } catch (error) {
    console.log("Error occurred!");
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
  }
}

fetchData();
