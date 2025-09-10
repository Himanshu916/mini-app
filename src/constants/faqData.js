import redNftHolder from "../assets/images/redNftHolder.png"
import yellowNftHolder from "../assets/images/yellowNftHolder.png"
import greenNftHolder from "../assets/images/greenNftHolder.png"

export const faqData = [
  {
    id: 1,
    question: "How do I get started with Impact Landscapes?",
    answer: [
      "Start by connecting your wallet, then choose one of the 10 available landscapes to fund. Click ‘Mint a New NFT’ to mint your first Red Pill NFT.",
    ],
    links: [
      // {
      //     text: 'Step by step walkthrough',
      //     href: 'https://app.tango.us/app/workflow/Creating-a-New-Organization-d173295344464bfa96bedd949d8b3873',
      // },
    ],
  },
  {
    id: 2,
    question: "What is the Red Pill NFT?",
    answer: [
      "The Red Pill NFT is your key to funding climate-positive actions in a chosen landscape. It starts red and mutates as you fund more, eventually turning green after you’ve funded $250, reflecting the real world impact.",
    ],
    imagesData: [
      {
        isArrow: false,
        image: redNftHolder,
        fundPercent: 35,
        ips: 1260,
        color: "red",
      },
      {
        isArrow: true,
      },
      {
        isArrow: false,
        image: yellowNftHolder,
        fundPercent: 70,
        ips: 2520,
        color: "yellow",
      },
      {
        isArrow: true,
      },
      {
        isArrow: false,
        image: greenNftHolder,
        fundPercent: 100,
        ips: 3600,
        color: "green",
      },
    ],
    links: [],
  },
  {
    id: 3,
    question: "How do I fund my existing NFT?",
    answer: [
      "To fund your Red Pill NFT, select it and click ‘Fund Existing NFT.’ You can contribute incrementally until the $250 funding goal is reached.",
    ],
    links: [],
  },
  {
    id: 4,
    question:
      "Can I mint multiple NFTs in the same landscape? Is there a limit?",
    answer: [
      "Yes! You can mint and fund multiple Red Pill NFTs within a single landscape. While you can mint as many Red Pills as you want from any landscape, each landscape can only accommodate 400 Green Pills.",
    ],
    links: [],
  },
  {
    id: 5,
    question: "What happens when my NFT turns green?",
    answer: [
      "Once your Red Pill NFT turns green, you unlock rewards (more to come 👀), leaderboard recognition and bragging rights!!",
    ],
    links: [],
  },
]
