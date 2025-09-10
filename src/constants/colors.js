export const colors = {
  Water: {
    text: "text-[#76C8E8]",
  },
  Earth: {
    text: "text-[#36B67A]",
  },
  Energy: {
    text: "text-[#FBCF4E]",
  },
  Social: {
    text: "text-[#ED1F1F]",
  },
}

export const fundText = {
  red: {
    // text: "text-[#EFD1D1]",
    text: "text-[#B33030]",
    progress: "bg-[#B33030]",
    perFundText: "text-[#EB9E9E]",
    image: 1,
  },

  green: {
    // text: "text-[#D1EFE0]",
    text: "text-[#287950]",
    progress: "bg-[#287950]",
    perFundText: "text-[#D1EFE0]",
    image: 4,
  },
  yellow: {
    // text: "text-[#EFE5D1]",
    text: "text-[#EBD29E]",
    progress: "bg-[#C09536]",
    perFundText: "text-[#EBD29E]",
    image: 3,
  },
}

export const getImage = (n) => {
  if (Number(isNaN(n))) {
    return 1
  }
  if (!n) return 1
  if (n < 35) return 1
  else if (n < 70) return 3
  else return 4
}

export const getColor = (n) => {
  if (n < 35) return "red"
  else if (n < 70) return "yellow"
  else return "green"
}
