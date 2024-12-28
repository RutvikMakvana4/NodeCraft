import "dotenv/config";

module.exports = {
  mongodb: {
    url: `${process.env.MONGO_URL}`,
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
};
