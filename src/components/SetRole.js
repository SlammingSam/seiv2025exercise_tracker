import userServices from "../services/userServices.js";

export default async function setRole(router, new_role, user) {
  const new_user = {
    fName: user.fName,
    lName: user.lName,
    email: user.email,
    role: new_role,
  };
  console.log("setRole.js - updating user role to: " + new_role); // log for troubleshooting later :(
  await userServices.update(user.userId, new_user); // update user role
  router.push({ name: "Home" }); // Push to home, could be changed to profile later
}
