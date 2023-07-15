import gcipCloudFunctions from 'gcip-cloud-functions';
import { beforeSignInHandler, beforeCreateHandler } from './handlers.js';

const adminEmails = process.env.ADMIN_EMAILS.split(',') || [];
const authClient = new gcipCloudFunctions.Auth();

export const beforeCreate = authClient.functions()
  .beforeCreateHandler((user, context) => beforeCreateHandler(user, context));

export const beforeSignIn = authClient.functions()
  .beforeSignInHandler((user, context) => beforeSignInHandler(user, context, adminEmails));
