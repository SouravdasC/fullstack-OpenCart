// controllers/contactController.js

import { Contact } from "../models/contact.model.js";
import { errorAsynHandler } from "../utils/errorAsynHandler.js";

//create message: /ap/v1/contact
export const submitContact = errorAsynHandler(
  async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
)

//delete message: /api/v1/admin/messages/:id
export const deleteMessage = errorAsynHandler(
  async (req, res, next) => {
  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    await msg.deleteOne();
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
)

//admin all msessage : /api/v1/admin/messages
export const getAllMessages = errorAsynHandler(async (req, res) => {
  try {
    const messages = await Contact.find().populate('user','user name').sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
})
