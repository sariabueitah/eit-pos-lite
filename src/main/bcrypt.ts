import bcrypt from 'bcrypt'

const saltRounds = 10

export function hashPasswordSync(password): string {
  return bcrypt.hashSync(password, saltRounds)
}

export function compareHashSync(password, hash): boolean {
  return bcrypt.compareSync(password, hash)
}
