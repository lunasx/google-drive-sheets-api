const express = require("express");
const {GoogleAuth} = require('google-auth-library');
const {google} = require("googleapis");
const app = express();
const SCOPES_LINK = 'https://www.googleapis.com/auth/spreadsheets';

app.get("/", async (req, res) => {
    async function create(title) {
        const auth = new GoogleAuth({
          keyFile: "credentials.json",
          scopes: SCOPES_LINK,
        });
      
        const service = google.sheets({version: 'v4', auth});
        const resource = {
          properties: {
            title,
          },
        };
        try {
          const spreadsheet = await service.spreadsheets.create({
            resource,
            fields: 'spreadsheetId'
          });
          console.log(`new sheet id: ${spreadsheet.data.spreadsheetId}`);
          return spreadsheet.data.spreadsheetId;
        } catch (error) {
            console.log(error);
        }
    }
    await create('Sheet1');
});
app.listen(200, (req, res) => console.log("http://localhost:200/"));