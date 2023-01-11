import crypto from 'crypto'

const createKey = (password) => crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-128-cbc',
    passphrase: password,
  },
})

export default createKey
