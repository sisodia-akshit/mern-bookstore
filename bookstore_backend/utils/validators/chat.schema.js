const { z } = require("zod");

const globalChatSchema = z.object({
  message: z.string(),
});



module.exports = { globalChatSchema };