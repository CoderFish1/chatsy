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

// logic if next sender is diff (then we will use this logic to show the avatar in chat)
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    m.sender._id !== userId
  );
};

// if this is last message from someone else logic(then we will show avatar in chat)
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId
  );
};

// helps in aligning in the user and sender message left or right
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    m.sender._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      m.sender._id !== userId) ||
    (i === messages.length - 1 && m.sender._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

// Is the previous message from the same sender?(Decide the vertical spacing between messages.)
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};