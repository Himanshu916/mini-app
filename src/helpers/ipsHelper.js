export const collectionNotifications = {
  first: {
    operation: "mint",
    text: "Click here to mint a greenpill NFT now to tokenize your real world impact",
  },
  second: {
    operation: "tokenize",
    text: "Click here to select a greenpill to direct all your points and tokenize your real world impact",
  },
  third: {
    operation: "mint",
    text: "but your NFT(s) are fully transformed. Click here to mint a new NFT to direct all your points and tokenize your real world impact",
  },
}

export const getNotificationNumber = (nfts) => {
  const totalGreenNFTs = nfts
    ?.map((nft) => (nft?.totalIPs / nft?.maxIPs) * 100)
    ?.filter((progress) => progress >= 100)

  if (nfts.length === 0) {
    return "first"
  } else if (totalGreenNFTs.length === nfts.length) {
    return "third"
  } else {
    return "second"
  }
}
