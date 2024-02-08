import { v2 as cloudinary } from "cloudinary";

// cloudinary config
cloudinary.config({
  cloud_name: "dcpenj5rv",
  api_key: "515218532747541",
  api_secret: "I5WyOOlbBQGvbOOfdxtfq84_wvY",
});

// cloudinary upload handler

const cloudinaryFileHandler = async (folderName, filenamePath) => {
  try {
    if (!filenamePath) return false;
    const result = await cloudinary.uploader.upload(filenamePath, {
      resource_type: "auto",
      folder: `${folderName}`,
      backup: false,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

// delete image from cloudinary

const cloudinaryDeleteFileHandler = async (
  folderName,
  whatType,
  filenamePath
) => {
  try {
    if (!filenamePath) return false;

    const result = await cloudinary.uploader.destroy(
      `${folderName}/${filenamePath}`,
      {
        invalidate: true,
        resource_type: `${whatType}`,
      }
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};

const cloudImageFinder = (fileUrl) => {
  const arr = fileUrl.split("/");

  const imageIndex = arr[arr.length - 1];

  const imageNameFind = imageIndex.split(".");

  const fileName = imageNameFind[0].toString();
  const title = imageNameFind[1].toString();

  const whatType = title === "png" ? "image" : "video";

  return {
    fileName,
    whatType,
  };
};

export { cloudinaryFileHandler, cloudinaryDeleteFileHandler, cloudImageFinder };
