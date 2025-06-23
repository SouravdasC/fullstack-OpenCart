import { Router } from "express";
import { deleteMessage, getAllMessages, submitContact } from "../controllers/contact.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const contactdRouter = Router();

contactdRouter.route('/contact').post(isAuthenticatedUser,submitContact);
contactdRouter.route('/admin/messages').get(isAuthenticatedUser, authorizeRoles('admin'), getAllMessages);
contactdRouter.route('/admin/messages/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteMessage);

export default contactdRouter