import gcipCloudFunctions from 'gcip-cloud-functions';
import { beforeSignInHandler } from './handlers.js';

const adminEmails = process.env.ADMIN_EMAILS.split(',') || [];
const authClient = new gcipCloudFunctions.Auth();

export const beforeSignIn = authClient.functions()
  .beforeSignInHandler((user, context) => beforeSignInHandler(user, context, adminEmails));
