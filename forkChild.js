import { publicEncrypt } from 'node:crypto'
import process from 'node:process'

process.on('message', (message) => {
  const parsed = JSON.parse(message)
  const encryptParsed = publicEncrypt(parsed.publicKey, Buffer.from(JSON.stringify(parsed.objFile)))
  process.send(encryptParsed)
})

process.stderr.on('message', (message) => {
  console.error(message.error)
})
