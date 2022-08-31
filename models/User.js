const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    image: {
      png: {
        type: String,
        required: [true, "Please upload image"],
      },
    },
    username: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
  },
  {
    methods: {
      async comparePassword(candidatePassword) {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
      },
    },
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", UserSchema);

module.exports = { User, UserSchema };
