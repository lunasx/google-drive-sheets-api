const express = require("express");
const fs = require('fs');
const {google} = require("googleapis");
const app = express();
const http = require('https'); 

app.get("/", async (req, res) => {
    const KEY_FILE = 'credentials.json';
    const SCOPES = 'https://www.googleapis.com/auth/drive';
    const FILE_NAME = 'data/picture.jpg';
    const PARENT_ID = '< DRIVE FOLDER ID >';
    const fileUrl = new URL('< URL >');
    const file = fs.createWriteStream(FILE_NAME);

    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE,
        scopes: SCOPES
    });

    async function uploadFile(auth) {
        const driveServices = google.drive({ version: 'v3', auth });

        http.get(fileUrl, function(response) {
            response.pipe(file);
    
            file.on("finish", () => {
                file.close();
            });
        });
        file.on("finish", async () => {
            let fileMetaData = {
                'name': FILE_NAME,
                'parents': [PARENT_ID]
            }

            let media = {
                mimeType: 'image/jpeg',
                body: fs.createReadStream(FILE_NAME)
            }

            let response = await driveServices.files.create({
                resource: fileMetaData,
                media: media,
                fields: 'id'
            });

            switch(response.status)
            {
                case 200:
                    console.log('Google Drive ID:', response.data.id);
                break;
            }
        });
    }

    uploadFile(auth).catch(console.error);
});

app.listen(600, (req, res) => console.log("http://localhost:600/"));