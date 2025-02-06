export const generateMessage = (fieldName = "") => {
  return {
    success: {
      sendOTP: {
        msg: "Code Was Sent Successfully",
        status: 201,
      },
      created: { msg: `${fieldName} Created Successfully`, status: 201 },
      updated: { msg: `${fieldName} Updated Successfully`, status: 200 },
      deleted: { msg: `${fieldName} Deleted Successfully`, status: 200 },
      confirmed: { msg: `${fieldName} Confirmed Successfully`, status: 200 },
      loggedIn: { msg: `${fieldName} Logged-in Successfully`, status: 200 },
    },
    errors: {
      invalidCredentials: {
        error: "in-valid E-mail or Password!",
        status: 400,
      },
      invalidToken: { error: "in-valid Token!", status: 400 },
      invalidOTP: { error: "in-valid Confirmation Code!", status: 400 },
      unAuthenticated: {
        error: "You are not Authenticated to Procced!",
        status: 403,
      },
      blockedReq: {
        error:
          "Your Request Has Been Blocked, You Can Request Another Confirmation Code Again After 30s!",
        status: 403,
      },
      notFound: { error: `${fieldName} Is Not Found!`, status: 404 },
      codeAlreadySent: {
        error:
          "You Can't Request Another Confirmation Code Until The Old One Expires After 5m",
        status: 400,
      },
      alreadyExist: { error: `${fieldName} Already Exist!`, status: 409 },
      conflictedPasswords: {
        error: "New Password Can't Be As Same As The Old One!",
        status: 409,
      },

      expiredToken: {
        error: "Expired Token, Try To Login Again",
        status: 400,
      },

      required: { error: `${fieldName} Is Required!`, status: 403 },
      emptyField: { error: `${fieldName} Can't Be Empty!` },
      invalidFormate: { error: `In-valid ${fieldName}!`, status: 400 },
      unMatchedPasswords: { error: "Passwords Aren't Matching!", status: 400 },
    },
  };
};
