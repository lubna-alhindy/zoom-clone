import * as bcrypt from 'bcrypt';

export async function hashString(str: string): Promise<string> {
  return await bcrypt.hash(str, await bcrypt.genSalt());
}

export async function validateString(
  enteredString: string,
  realString: string
) {
  return await bcrypt.compare(enteredString, realString);
}
