export const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Tony Stark",
        email: "tony@avengers.com",
      },
      {
        name: "Shrey",
        email: "shrey@gmail.com",
      },
    ],
    _id: "chat001",
    chatName: "Tony Stark",
  },

  {
    isGroupChat: true,
    users: [
      {
        name: "Bruce Wayne",
        email: "bruce@wayneenterprises.com",
      },
      {
        name: "Peter Parker",
        email: "peter@dailybugle.com",
      },
      {
        name: "Shrey",
        email: "shrey@gmail.com",
      },
    ],
    _id: "chat002",
    chatName: "Superhero Squad",
    groupAdmin: {
      name: "Bruce Wayne",
      email: "bruce@wayneenterprises.com",
    },
  },

  {
    isGroupChat: false,
    users: [
      {
        name: "Naruto Uzumaki",
        email: "naruto@konoha.com",
      },
      {
        name: "Shrey",
        email: "shrey@gmail.com",
      },
    ],
    _id: "chat003",
    chatName: "Naruto Uzumaki",
  },

  {
    isGroupChat: true,
    users: [
      {
        name: "Luffy",
        email: "luffy@pirates.com",
      },
      {
        name: "Zoro",
        email: "zoro@pirates.com",
      },
      {
        name: "Nami",
        email: "nami@pirates.com",
      },
      {
        name: "Shrey",
        email: "shrey@gmail.com",
      },
    ],
    _id: "chat004",
    chatName: "Straw Hat Crew",
    groupAdmin: {
      name: "Luffy",
      email: "luffy@pirates.com",
    },
  },

  {
    isGroupChat: false,
    users: [
      {
        name: "Gojo Satoru",
        email: "gojo@jjk.com",
      },
      {
        name: "Shrey",
        email: "shrey@gmail.com",
      },
    ],
    _id: "chat005",
    chatName: "Gojo Satoru",
  },

  {
    isGroupChat: true,
    users: [
      {
        name: "Monkey D. Dragon",
        email: "dragon@revolutionary.com",
      },
      {
        name: "Itachi Uchiha",
        email: "itachi@akatsuki.com",
      },
      {
        name: "Levi Ackerman",
        email: "levi@surveycorps.com",
      },
      {
        name: "Shrey",
        email: "shrey@gmail.com",
      },
    ],
    _id: "chat006",
    chatName: "Legends Only",
    groupAdmin: {
      name: "Levi Ackerman",
      email: "levi@surveycorps.com",
    },
  },
];
