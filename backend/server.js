const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

console.log('ENV DEBUG SMTP_USER:', process.env.SMTP_USER)
console.log('ENV DEBUG SMTP_PASS length:', process.env.SMTP_PASS?.length)
console.log('ENV DEBUG SMTP_HOST:', process.env.SMTP_HOST)
console.log('ENV DEBUG SMTP_PORT:', process.env.SMTP_PORT)

const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001
const COMMUNITIES = {
  borborema: {
    name: 'Comunidade Salina Borborema',
  },
  boraceia: {
    name: 'Comunidade Salina Boracéia',
  },
}

function envValue(name, fallback = '') {
  const raw = process.env[name]
  if (raw === undefined || raw === null || raw === '') return fallback
  return String(raw).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')
}

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

app.set('trust proxy', true)

app.use(cors())
app.use(express.json())

const FALLBACK_FILE = path.join(__dirname, 'submissions-fallback.log')

function storeFallbackSubmission(payload, reason) {
  const line = JSON.stringify({
    createdAt: new Date().toISOString(),
    reason,
    ...payload,
  })
  fs.appendFileSync(FALLBACK_FILE, `${line}\n`, 'utf8')
}

app.use(express.static(path.join(__dirname, '../frontend/dist')))

const transporter = nodemailer.createTransport({
  host: envValue('SMTP_HOST'),
  port: parseInt(envValue('SMTP_PORT', '587'), 10) || 587,
  secure: envValue('SMTP_SECURE', 'false').toLowerCase() === 'true',
  authMethod: envValue('SMTP_AUTH_METHOD', 'LOGIN'),
  auth: {
    user: envValue('SMTP_USER'),
    pass: envValue('SMTP_PASS'),
  },
})

app.post('/api/submit', async (req, res) => {
  const nome = normalizeField(req.body?.nome)
  const cpf = normalizeField(req.body?.cpf)
  const telefone = normalizeField(req.body?.telefone)
  const communityId = normalizeField(req.body?.comunidade || 'borborema').toLowerCase()
  const community = COMMUNITIES[communityId]

  if (!community) {
    return res.status(400).json({ success: false, error: 'Comunidade inválida.' })
  }

  if (!nome || !cpf || !telefone) {
    return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' })
  }

  const safeNome = escapeHtml(nome)
  const safeCpf = escapeHtml(cpf)
  const safeTelefone = escapeHtml(telefone)
  const safeCommunityName = escapeHtml(community.name)
  const subjectNome = nome.replace(/[\r\n]+/g, ' ')

  const mailOptions = {
    from: `"Formulário ${community.name}" <${envValue('SMTP_USER')}>`,
    to: 'lgpd.salina@salina.com.br',
    subject: `Novo cadastro na ${community.name}: ${subjectNome}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #1f4298, #00a3d7, #ee1c25); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Novo cadastro na comunidade</h1>
          <p style="color: white; margin: 8px 0 0; font-size: 14px; font-weight: 600;">${safeCommunityName}</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #1e293b; font-size: 16px; margin-top: 0; margin-bottom: 20px;">Dados do cadastrado:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 140px;">Nome completo</td>
              <td style="padding: 12px 0; color: #1e293b; font-size: 14px;">${safeNome}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">CPF</td>
              <td style="padding: 12px 0; color: #1e293b; font-size: 14px;">${safeCpf}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">Telefone</td>
              <td style="padding: 12px 0; color: #1e293b; font-size: 14px;">${safeTelefone}</td>
            </tr>
          </table>
        </div>
        <div style="margin-top: 20px; background: #eef9fd; border: 1px solid #b9e6f4; border-radius: 10px; padding: 14px; text-align: center;">
          <p style="color: #1f4298; font-size: 14px; font-weight: 600; margin: 0;">O cliente <strong>${safeNome}</strong> aceitou os termos e entrou na ${safeCommunityName}.</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
          Enviado automaticamente pelo formulário de cadastro da Comunidade Salina.
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email enviado para lgpd.salina@salina.com.br | Comunidade: ${community.name} | Nome: ${nome}`)
    return res.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    try {
      storeFallbackSubmission({ nome, cpf, telefone, comunidade: community.name }, error.message)
      return res.json({
        success: true,
        fallback: true,
        message: 'Cadastro salvo com contingência temporária de e-mail.',
      })
    } catch (fallbackError) {
      console.error('Erro ao salvar fallback:', fallbackError)
      return res.status(500).json({ success: false, error: 'Falha temporária no servidor.' })
    }
  }
})

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server rodando em http://0.0.0.0:${PORT}`)
})
