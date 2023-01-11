import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { sign, verify } from 'node:crypto'
import dotenv from 'dotenv'
import createKey from './lib/keyGen.js'

const before = Date.now()

try {
  if (process.argv.length !== 3) {
    console.error('Please input filename.')
  }

  const fileName = process.argv[2]
  const filePath = resolve(process.cwd(), fileName)
  if (!existsSync(filePath)) {
    writeFileSync(fileName, 'some message')
  }

  const fileContent = readFileSync(filePath, 'utf-8')

  dotenv.config()
  const password = process.env.PASSWORD

  const { publicKey, privateKey } = createKey(password)

  const child = spawn('node', ['./spawnChild.js'])

  const objFile = { fileName, fileContent }

  child.stdin.write(JSON.stringify({ publicKey, objFile }))

  child.stdout.on('data', (data) => {
    const signature = sign('SHA256', data, { key: privateKey, passphrase: password })
    const isVerified = verify('SHA256', data, publicKey, signature)

    console.table([{
      name: fileName,
      content: fileContent.toString(),
      verified: isVerified,
    },
    ])

    const usedMemory = (process.memoryUsage().heapUsed) / (1024 * 1024)
    console.log(`\nUsed Memory: ${usedMemory} mb`)

    const after = Date.now()
    const timeConsumed = (after - before) / 1000
    console.log(`Time Consumed: ${timeConsumed} sec`)

    process.exit()
  })

  child.stderr.on('data', (data) => {
    console.log(data.error)
  })
} catch (err) {
  console.log(err)
}
