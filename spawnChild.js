import { publicEncrypt } from 'node:crypto'
import process from 'node:process'

process.stdin.on('data', (data) => {
  const parsed = JSON.parse(data)
  const encryptParsed = publicEncrypt(parsed.publicKey, Buffer.from(JSON.stringify(parsed.objFile)))
  process.stdout.write(encryptParsed)
})

process.stderr.on('data', (data) => {
  console.error(data.error)
})
