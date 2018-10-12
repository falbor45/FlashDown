export const determineQueueType = queueId => {
  switch (queueId) {
    case 0: {
      return "Custom game";
    }
    case 72:
    case 73: {
      return "Snowdown";
    }
    case 75: {
      return "Hexakill";
    }
    case 76:
    case 83: {
      return "URF";
    }
    case 78:
    case 1020: {
      return "One for All";
    }
    case 98: {
      return "3v3 Hexakill";
    }
    case 100:
    case 450: {
      return "ARAM";
    }
    case 310: {
      return "Nemesis"
    }
    case 313: {
      return "Black Market Brawlers";
    }
    case 317: {
      return "Definitely Not Dominion";
    }
    case 325: {
      return "SR ARAM";
    }
    case 400: {
      return "5v5 Draft Pick"
    }
    case 420: {
      return "5v5 Ranked Solo"
    }
    case 430: {
      return "5v5 Blind Pick"
    }
    case 440: {
      return "5v5 Ranked Flex"
    }
    case 460: {
      return "3v3 Blind Pick"
    }
    case 470: {
      return "3v3 Ranked Flex"
    }
    case 600: {
      return "Blood Hunt Assassin"
    }
    case 610: {
      return "Dark Star: Singularity"
    }
    case 700: {
      return "Clash"
    }
    case 800:
    case 810:
    case 820:
    case 830:
    case 840:
    case 850: {
      return "vs. AI"
    }
    case 900:
    case 1010: {
      return "ARURF"
    }
    case 910: {
      return "Ascension"
    }
    case 920: {
      return "Legend of the Poro"
    }
    case 940: {
      return "Nexus Siege"
    }
    case 950:
    case 960: {
      return "Doom Bots"
    }
    case 980:
    case 990: {
      return "Star Guardian Invasion"
    }
    case 1000: {
      return "PROJECT: Hunters"
    }
    case 1030: {
      return "Odyssey: Extraction Intro"
    }
    case 1040: {
      return "Odyssey: Extraction Cadet"
    }
    case 1050: {
      return "Odyssey: Extraction Crewmember"
    }
    case 1060: {
      return "Odyssey: Extraction Captain"
    }
    case 1070: {
      return "Odyssey: Extraction Onslaught"
    }
    case 1200: {
      return "Nexus Blitz"
    }
    default: {
      return "Unknown game mode"
    }
  }
};

export const removeArrayElement = (array, element) => {
  let index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

export const shortenSummonerName = summonerName => summonerName.replace(' ', '').toLowerCase();
