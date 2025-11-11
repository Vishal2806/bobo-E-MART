import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  password : string;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  //   Virtual Attribute
  age: number;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Please enter Name"],
      validate: validator.default.isEmail,
    },
    password :{
      type : String,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dob: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// schema.virtual("age").get(function () {
//   const today = new Date();
//   const dob = this.dob;
//   let age = today.getFullYear() - dob.getFullYear();

//   if (
//     today.getMonth() < dob.getMonth() ||
//     (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
//   ) {
//     age--;
//   }

//   return age;
// });

export const User = mongoose.model<IUser>("User", schema);