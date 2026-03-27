require('dotenv').config()
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const fs = require('fs')

const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

function envValue(name, fallback = '') {
  const raw = process.env[name]
  if (raw === undefined || raw === null || raw === '') return fallback
  return String(raw).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')
}

// CRITICAL: Trust proxy headers from nginx
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

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: envValue('SMTP_HOST'),
  port: parseInt(envValue('SMTP_PORT', '587'), 10) || 587,
  secure: envValue('SMTP_SECURE', 'false').toLowerCase() === 'true', // true for 465, false for other ports
  authMethod: envValue('SMTP_AUTH_METHOD', 'LOGIN'),
  auth: {
    user: envValue('SMTP_USER'),
    pass: envValue('SMTP_PASS'),
  },
})

app.post('/api/submit', async (req, res) => {
  const { nome, cpf, telefone } = req.body

  if (!nome || !cpf || !telefone) {
    return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' })
  }

  const mailOptions = {
    from: `"Formulario Comunidade Salina Borborema" <${envValue('SMTP_USER')}>`,
    to: 'lgpd.salina@salina.com.br',
    subject: `🎉 Usuário ${nome} se cadastrou na comunidade Salina Borborema`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #10b981, #0d9488); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🎉 Novo Cadastro na Comunidade!</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #1e293b; font-size: 16px; margin-top: 0; margin-bottom: 20px;">Dados do cadastrado:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 140px;">👤 Nome Completo</td>
              <td style="padding: 12px 0; color: #1e293b; font-size: 14px;">${nome}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">🪪 CPF</td>
              <td style="padding: 12px 0; color: #1e293b; font-size: 14px;">${cpf}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">📱 Telefone</td>
              <td style="padding: 12px 0; color: #1e293b; font-size: 14px;">${telefone}</td>
            </tr>
          </table>
        </div>
        <div style="margin-top: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px; text-align: center;">
          <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0;">✅ O cliente <strong>${nome}</strong> aceitou os termos e entrou na comunidade.</p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
          Enviado automaticamente pelo formulário de cadastro da Comunidade Ideal.
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Email enviado para lgpd.salina@salina.com.br | Nome: ${nome}`)
    return res.json({ success: true })
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    // Fallback: nao perde o cadastro quando SMTP estiver indisponivel.
    try {
      storeFallbackSubmission({ nome, cpf, telefone }, error.message)
      return res.json({
        success: true,
        fallback: true,
        message: 'Cadastro salvo com contingencia temporaria de email.',
      })
    } catch (fallbackError) {
      console.error('❌ Erro ao salvar fallback:', fallbackError)
      return res.status(500).json({ success: false, error: 'Falha temporaria no servidor.' })
    }
  }
})

// Catch-all route to serve the frontend for any other request
// Use middleware instead of app.get('*') for Express 5 compatibility
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server rodando em http://0.0.0.0:${PORT}`)
})
