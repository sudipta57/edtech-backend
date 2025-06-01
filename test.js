// const now = new Date();
// const iso8pm = new Date(
//   now.getFullYear(),
//   now.getMonth(),
//   now.getDate(),
//   11,
//   0,
//   0 // 8 PM = 20 hours
// ).toISOString();

import axios from "axios";

// console.log(iso8pm);

const getVideoStatus = async (guid) => {
  const status = await axios.get(
    `https://video.bunnycdn.com/library/429157/videos/${guid}`,
    { headers: { AccessKey: "4e13dd10-43f2-4c66-a40825a77aca-5948-4ca2" } }
  );
  console.log(status.data);
};

getVideoStatus("045a0d9a-2715-47d2-a570-0503ddb91f0a");
