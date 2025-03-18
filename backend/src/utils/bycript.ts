import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (password: string): Promise<Buffer> => {
    const hashedPasswordString = await bcrypt.hash(password, saltRounds);
    return Buffer.from(hashedPasswordString, 'utf-8')
};

export const comparePassword = async (password: string, hash: Buffer): Promise<boolean> => {
    const hashedPasswordString = hash.toString('utf-8');
    return await bcrypt.compare(password, hashedPasswordString);
};