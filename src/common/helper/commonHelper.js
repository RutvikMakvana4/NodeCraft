/**
 * @description : unlinkFile : remove files from folder
 * @param filename : file name store in database
 * @return { boolean } : true/false
 */
export const unlinkFile = async (filename) => {
  const img = path.join(`${__dirname}` + `../../../${filename}`);

  if (fs.existsSync(img)) {
    try {
      fs.unlinkSync(img);
      return true;
    } catch (error) {
      console.error("Error while deleting the file:", error);
    }
  }
};
