export const generateMessage = (fieldName = "", enumValues = []) => {
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
      // Invalids :
      invalidCredentials: {
        error: "in-valid E-mail or Password!",
        status: 400,
      },
      invalidToken: { error: "in-valid Token!", status: 400 },
      invalidOTP: { error: "in-valid Confirmation Code!", status: 400 },
      invalidFormate: { error: `In-valid ${fieldName}!`, status: 400 },

      enums: {
        error: `In-valid Value, value Must Be "${enumValues.join("Or")}"`,
        status: 400,
      },
      // Authintecation :
      unAuthenticated: {
        error:
          "Your Account is Deactiveted to Procced!, login again To Restore Your Account",
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
        status: 429,
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
      unMatchedPasswords: { error: "Passwords Aren't Matching!", status: 400 },

      notTheOwner: {
        error: `You're Not The Owner Of The Requseted ${fieldName} to Procced`,
        status: 403,
      },

      private: {
        error: `The Requested ${fieldName} Is Private`,
        status: 403,
      },

      notAllowed: {
        error: `Only Adimns are Allowed To Procced!`,
        status: 403,
      },
    },
  };
};
