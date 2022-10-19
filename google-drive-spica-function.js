// Dependencies: googleapis@^108.0.0 - https@^1.0.0
import http from 'https';
import { google } from 'googleapis';

const SCOPES = 'https://www.googleapis.com/auth/drive';
const FILE_NAME = 'file name';
const PARENT_ID = '< PARENT ID >';
const fileUrl = '< FILE URL >';

const auth = new google.auth.GoogleAuth({
    credentials: {
        "type": "",
        "project_id": "",
        "private_key_id": "",
        "private_key": "",
        "client_email": "",
        "client_id": "",
        "auth_uri": "",
        "token_uri": "",
        "auth_provider_x509_cert_url": "",
        "client_x509_cert_url": ""
    },
    scopes: SCOPES
});

export default async function (req, res) {
    http.get(fileUrl, async (resultData) => {
        const driveServices = google.drive({ version: 'v3', auth });

        let fileMetaData = {
            'name': FILE_NAME,
            'parents': [PARENT_ID]
        }

        let media = {
            body: resultData
        }

        let response = await driveServices.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        });

        switch (response.status) {
            case 200:
                console.log('Google Drive ID:', response.data.id);
                break;
        }
    }).on('error', (err) => {
        console.log("http error")
    });

    return {}
}
