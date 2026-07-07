import expressAsyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

// logic for sending a new message
const sendMessage = expressAsyncHandler(async  (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    // create the message
    var message = await Message.create(newMessage);

    // populate the sender and chat references
    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")

    // populate the users inside the chat object
    message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email"
  })

  //update the latest message in chat model
  await Chat.findByIdAndUpdate(req.body.chatId, {
    latestMessage: message,
  });

  // send the fully populated message to the client
  res.json(message)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
});

// logic for featching message for a single chat
const allMessages = expressAsyncHandler(async  (req, res) => {
    try {
        // req.params.chatId grabs the ID from the URL: /api/message/:chatId
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export { sendMessage, allMessages };
