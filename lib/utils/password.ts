
import bcrypt from "bcryptjs";

export  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++; // Check for numbers
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };


export const  hashingPassword = async (password:string) => {

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password,salt)

  return hashedPassword

}