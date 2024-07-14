export const getStateCode = (stateName) => {
  const stateCodes = {
    Johor: "jhr",
    Kedah: "kdh",
    Kelantan: "ktn",
    Melaka: "mlk",
    "Negeri Sembilan": "nsn",
    Pahang: "phg",
    Penang: "png",
    Perak: "prk",
    Perlis: "pls",
    Sabah: "sbh",
    Sarawak: "swk",
    Selangor: "sgr",
    Terengganu: "trg",
    "Wp Kuala Lumpur": "kul",
    "Wp Labuan": "lbn",
    "Wp Putrajaya": "pjy",
    "Federal territories": "ft",
  };

  return stateCodes[stateName] || "";
};
