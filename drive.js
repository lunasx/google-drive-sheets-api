const express = require("express");
const {google} = require("googleapis");
const app = express();
const http = require('https'); 

app.get("/", async (req, res) => {
    const KEY_FILE = 'credentials.json';
    const SCOPES = 'https://www.googleapis.com/auth/drive';
    const FILE_NAME = 'test picture';
    const PARENT_ID = '< DRIVE FOLDER ID >';
    const fileUrl = '< UPLOAD URL >';

    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE,
        scopes: SCOPES
    });

    async function uploadFile(auth) {
        http.get(fileUrl, async (res) => {
            const driveServices = google.drive({ version: 'v3', auth });

            let fileMetaData = {
                'name': FILE_NAME,
                'parents': [PARENT_ID]
            }

            let media = {
                body: res
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
        }).on('error', (err) => {
            console.log("http error")
        });
    }

    uploadFile(auth).catch(console.error);
});

app.listen(600, (req, res) => console.log("http://localhost:600/"));
