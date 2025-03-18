import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (password: string): Promise<Buffer> => {
    const hashedPasswordString = await bcrypt.hash(password, saltRounds);
    return Buffer.from(hashedPasswordString, 'utf-8')
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};