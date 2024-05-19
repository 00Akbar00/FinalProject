const fs = require("fs");
const driveService = require("../../utils/driveService");

// controller to upload files
const uploadFile = async (req, res) => {
  const image = req.file;
  console.log(req.file);

  try {
    // as the file name stored is gibberish with no extension, that file is replaced by the original filename
    await fs.promises.rename(
      image.destination + "/" + image.filename,
      image.destination + "/" + image.originalname
    );

    const metaData = {
      name: image.originalname.substring(
        0,
        image.originalname.lastIndexOf(".")
      ),
      //   parents: ['viro-images-folder'], // the ID of the folder you get from createFolder.js is used here
    };

    const media = {
      mimeType: image.mimeType,
      body: fs.createReadStream(image.destination + "/" + image.originalname), // the image sent through multer will be uploaded to Drive
    };

    // uploading the file
    const response = await driveService.files.create({
      resource: metaData,
      media: media,
      fields: "id",
    });

    console.log("ID:", response.data.id);

    const fileId = response.data.id;
    await driveService.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await driveService.files.get({
      fileId: fileId,
      fields: "webViewLink",
    });

    const fileUrl = result.data.webViewLink;

    // Here you can save the fileUrl to your database
    // Example: await saveToFileDatabase(fileUrl);

    // Clean up the uploaded file from the server
    fs.unlinkSync(image.destination + "/" + image.originalname);

    res.send({ fileUrl });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};


module.exports = {
  uploadFile
};
