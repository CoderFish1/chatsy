export const getSender = (loggedUser, users) => {
  // If no user is logged in or user list is invalid, return 'Guest'
  if (!loggedUser || !users || users.length === 0) return "Unknown Chat";

  // Filter out the logged-in user from the array to find the "other" person
  const otherUser = users.find((user) => user._id !== loggedUser._id);

  // If no other user found (e.g., self-chat), return own name
  return otherUser ? otherUser.name : "Me";
};

export const getSenderPic = (loggedUser, users) => {
  if (!loggedUser || !users || users.length === 0) return null;
  const otherUser = users.find((user) => user._id !== loggedUser._id);
  return otherUser?.pic || null;
};
