import User from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import crypto from 'crypto'


// 1-recieve data from req.body
// 2-check if user aleady exists by email and mobile number 
// 3-if user not exists (hash password) 
// 4-store new user in datatbase

//   =========== 1-SignUp Api
export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
  } = req.body;

  // check for duplicate email

  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) return next(new Error("Duplicate email", { cause: 409 }));

  // check for duplicate mobile number

  const isMobleNumberExists = await User.findOne({ mobileNumber });
  if (isMobleNumberExists)
    return next(new Error("Duplicate mobile number", { cause: 409 }));

  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_Rounds);

  const createdUser = await User.create({
    firstName,
    lastName,
    userName: firstName + " " + lastName,
    email,
    mobileNumber,
    password: hashedPassword,
    recoveryEmail,
    DOB,
  });
  if (!createdUser) return next(new Error("user not created", { cause: 409 }));

  res.status(200).json({
    message: "success",
    user: createdUser,
  });
};


// 1-recieve data for login 
// 2-can login by email or mobilenumber 
// 3-if user is found i will chech password
// 4-i use compareSync that hashed first parameter and compare it with second parameter which is the hashed password in database
// 5-if password is correct 
// 6-create a token for user and change his status to online

// ====================== 2-signIn Api

export const signIn = async (req, res, next) => {
  const { email, mobileNumber,password } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { mobileNumber }],
  });
  if (!user) return next(new Error("invalid credentials", { cause: 401 }));

  const isPasswordMatched = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatched)
    return next(new Error("invalid credentials", { cause: 401 }));

  const token = jwt.sign(
    { id: user._id, userEmail: user.email },
    process.env.TOKEN_SIGNATURE,
    { expiresIn: "7d" }
  );

  await User.findByIdAndUpdate(user._id, { status: "online" });

  return res.status(200).json({ message: "login successfully", token });
};


// 1-before update data yoe have to check if new email and new mobileNumber already exists or not
// if it is not exists then you can ckech if he is the owner of the account or not 
// if he is the owner now you can let him update his account
// ========================== 3-update account =====================

export const updateAccount = async (req, res, next) => {
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body;
  const { _id } = req.authUser;

  if (email) {
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists)
      return next(new Error("Duplicate email", { cause: 409 }));
  }
  if (mobileNumber) {
    const isMobleNumberExists = await User.findOne({ mobileNumber });
    if (isMobleNumberExists)
      return next(new Error("Duplicate mobile number", { cause: 409 }));
  }
  const updatedAccount = await User.findByIdAndUpdate(
    { _id },
    {
      email,
      mobileNumber,
      recoveryEmail,
      DOB,
      lastName,
      firstName,
      userName: firstName + " " + lastName,
    },
    { new: true }
  );

  if (!updatedAccount) return next(new Error("updated fail", { cause: 400 }));

  res.status(200).json({ message: "updated Done ", updatedAccount });
};



// to delete account you need only to check if he is the owner of this account 

// ============================ 4-delete Account====================

export const deleteAccount = async (req, res, next) => {
  const { _id } = req.authUser;

  const deletedAccount = await User.findByIdAndDelete({ _id });
  if (!deletedAccount) return next(new Error("deleted fail"));

  res.status(200).json({ message: "deleted Done" });
};


// to get profile data you have to be the owner of this account and loggined already
// ======================= 5-Get user account data ===================

export const getUserAccountData = async (req, res, _) => {
  res.status(200).json({ message: "User Data", Data: req.authUser });
};


// 
// ================== 6-Get profile data for another user ===========

export const getProfileDataForAnotherUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById({ _id: userId });
  if (!user) return next(new Error("user not found", { cause: 404 }));

  res.status(200).json({ message: "User Data", Data: user });
};


// to update password you have to be the owner of account and already logged in first
// use compareSync to compare old password with the hashedpassword in database 
//if it is matched  hash new password first 
// search for  user by id and update password 

// ====================== 7-update password=============
export const updatePassword = async (req, res, next) => {
  const { _id, password } = req.authUser;
  const { oldPassword, newPassword } = req.body;

  const isPasswordMatched = bcrypt.compareSync(oldPassword, password);

  if (!isPasswordMatched)
    return next(new Error("invalid password", { cause: 401 }));

      const hashedNewPassword = bcrypt.hashSync(newPassword,+process.env.SALT_Rounds);

    const updatedPassword = await User.findByIdAndUpdate(
     { _id },
     { password: hashedNewPassword },
     { new: true }
    );
  if (!updatedPassword) return next(new Error("updated password fail"));

  res.status(200).json({ message: "password updated successfully", user: updatedPassword });
};

// ====================== 8- Forget password============================================

// declare empty oject to store otp
const userDatabase = {
 
};
// check if user already exists 
// generate random otp and store it in the userDatabase

// Generate and store a one-time password (OTP) for the user

export const generateOTP=async(req, res,next) => {
  const { email} = req.body;

  // Check if the user exists in the database
   const isUserExists=await User.findOne({email}).lean()
   if(!isUserExists) return next(new Error('User not found',{cause:400}))

    // Generate a random OTP
    const otp = crypto.randomBytes(3).toString('hex'); // 6 characters OTP

    // Store the OTP in the database
    userDatabase.otp = otp;

    res.status(200).json({ message: 'OTP generated successfully',otp});
  
   
}
// recieve data from user 
// check if user exists alredy 
// check if otp is valid 
// if valid hashed newpassword and update it 
// // Validate the OTP and update the password

export const resetPassword=async (req, res,next) => {
  const { email, otp, newPassword } = req.body;

const isUserExists=await User.findOne({email})
if(!isUserExists) return next(new Error('User not found',{cause:400}))

// check otp
if(!otp==userDatabase.otp) return next(new Error('invalid otp'))

      // Update the password in the database 
      const hashedPassword=bcrypt.hashSync(newPassword,+process.env.SALT_Rounds)
      await User.findOneAndUpdate({email},{password:hashedPassword})

    userDatabase.otp=null

      res.json({message:"password reset",});

}

// ============= 9-Get all accounts associated to a specific recovery Email ==============

 export const getAllAccountsAssociatedToRecoveryEmail = async (req,res,next) => {
  const { recoveryEmail } = req.body;
  const allAccount = await User.find({ recoveryEmail });
  if (!allAccount.length) return next(new Error("no data Entry"));

  res.status(200).json({ message: "Done", all_Accounts: allAccount });
};
