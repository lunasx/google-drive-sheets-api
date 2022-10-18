const express = require("express");
const { ExecutableError } = require("google-auth-library/build/src/auth/pluggable-auth-client");
const {GoogleAuth} = require('google-auth-library');
const {google} = require("googleapis");
const Excel = require("exceljs");
const app = express();
const SCOPES_LINK = 'https://www.googleapis.com/auth/spreadsheets';


app.get("/", async (req, res) => {
    let randomString = (Math.random() * 500).toString(36).substring(7);
    let randomNumber = Math.floor(Math.random() * 500);

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: SCOPES_LINK,
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth: client});

    const spreadsheetId = "< spreadsheet id >";

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A:A",
    });

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [randomString, randomNumber]
            ],
        },
    });

    res.send((await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
    })).data);

    const wb = new Excel.Workbook();
    let exelFile = await wb.xlsx.readFile("table.xlsx");
    let ws = exelFile.getWorksheet("Sheet1");
    let data = ws.getSheetValues();
    console.log(data);
});

app.listen(400, (req, res) => console.log("http://localhost:400/"));