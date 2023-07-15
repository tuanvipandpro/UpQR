const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const credentials = require('../credentials.json')

const getDrive = async () => {
  return await google.drive({
    version: 'v3', auth: new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: "https://www.googleapis.com/auth/drive"
    })
  });
}

const createFolder = async (folderName) => {

  const drive = await getDrive();

  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['FOLDER_ID'], 
  };

  const createdFolder =  await drive.files.create({
    resource: folderMetadata,
    fields: 'id,webViewLink',
  });

  return createdFolder.data
}

const uploadFileToDrive = async (filePath, folderId) => {
  const drive = await getDrive();

  const fileMetadata = {
    name: getFileName(filePath),
    parents: [folderId],
  };
  const media = {
    mimeType: 'application/octet-stream',
    body: fs.createReadStream(filePath),
  };
  const uploadedFile = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });
}

const getFileName = (filePath) => {

  let filename = path.basename(filePath)

  if (filename.length > 0) return filename

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

module.exports = {
  createFolder, uploadFileToDrive
}