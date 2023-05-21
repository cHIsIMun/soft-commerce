import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function verifyCredentials({email, password}) {
    const user = await prisma.user.findUnique({
      where: { email },
    })
  
    if (!user) {
      return {}
    }
  
    // Verificar se a senha fornecida corresponde ao hash de senha armazenado no banco de dados
    const isValid = await bcrypt.compare(password, user.password)
  
    if (!isValid) {
      return {}
    }
  
    return user
  }
  
