const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const cors = require('cors')
const express = require('express')
const multer = require('multer')
const nodemailer = require('nodemailer')

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

const STORES = {
  'loja-1-jardim-america': 'Loja 1 - Jardim América',
  'loja-4-perimetral': 'Loja 4 - Perimetral',
  'loja-3-boraceia': 'Loja 3 - Boracéia',
  'loja-5-borborema': 'Loja 5 - Borborema',
}

const MAX_ATTACHMENT_SIZE = 8 * 1024 * 1024
const MAX_ATTACHMENTS = 5
const BLOCKED_EXTENSIONS = new Set([
  '.bat',
  '.cmd',
  '.com',
  '.exe',
  '.js',
  '.msi',
  '.ps1',
  '.scr',
  '.vbs',
])

function envValue(name, fallback = '') {
  const raw = process.env[name]
  if (raw === undefined || raw === null || raw === '') return fallback
  return String(raw).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '')
}

function smtpValue(prefix, name, fallback = '') {
  return envValue(`${prefix}${name}`, envValue(name, fallback))
}

function createTransporter(prefix = '') {
  return nodemailer.createTransport({
    host: smtpValue(prefix, 'SMTP_HOST'),
    port: parseInt(smtpValue(prefix, 'SMTP_PORT', '587'), 10) || 587,
    secure: smtpValue(prefix, 'SMTP_SECURE', 'false').toLowerCase() === 'true',
    authMethod: smtpValue(prefix, 'SMTP_AUTH_METHOD', 'LOGIN'),
    auth: {
      user: smtpValue(prefix, 'SMTP_USER'),
      pass: smtpValue(prefix, 'SMTP_PASS'),
    },
  })
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

function sanitizeSubject(value) {
  return normalizeField(value).replace(/[\r\n]+/g, ' ')
}

function sanitizeAttachmentName(value) {
  const baseName = path.basename(normalizeField(value) || 'anexo')
  return baseName.replace(/[^\w.\- À-ÿ]/g, '_').slice(0, 140)
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateLength(value, min, max) {
  return value.length >= min && value.length <= max
}

function formatYesNo(value) {
  return value === 'sim' ? 'Sim' : 'Não'
}

function generateProtocol() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `DEN-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

function htmlRow(label, value) {
  return `
    <tr>
      <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 700; width: 190px; vertical-align: top;">${escapeHtml(label)}</td>
      <td style="padding: 12px 0; color: #1e293b; font-size: 14px; line-height: 1.6;">${value || '<span style="color: #94a3b8;">Não informado</span>'}</td>
    </tr>
  `
}

function textLine(label, value) {
  return `${label}: ${value || 'Não informado'}`
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

const communityTransporter = createTransporter()
const complaintTransporter = createTransporter('DENUNCIAS_')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_ATTACHMENT_SIZE,
    files: MAX_ATTACHMENTS,
  },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase()
    if (BLOCKED_EXTENSIONS.has(extension)) {
      return callback(new Error('Tipo de arquivo não permitido.'))
    }
    callback(null, true)
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

  const mailOptions = {
    from: `"Formulário ${community.name}" <${envValue('SMTP_USER')}>`,
    to: 'lgpd.salina@salina.com.br',
    subject: `Novo cadastro na ${community.name}: ${sanitizeSubject(nome)}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #1f4298, #00a3d7, #ee1c25); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Novo cadastro na comunidade</h1>
          <p style="color: white; margin: 8px 0 0; font-size: 14px; font-weight: 600;">${safeCommunityName}</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #1e293b; font-size: 16px; margin-top: 0; margin-bottom: 20px;">Dados do cadastrado:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${htmlRow('Nome completo', safeNome)}
            ${htmlRow('CPF', safeCpf)}
            ${htmlRow('Telefone', safeTelefone)}
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
    await communityTransporter.sendMail(mailOptions)
    console.log(`Email de comunidade enviado | Comunidade: ${community.name}`)
    return res.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email de comunidade:', error.message)
    try {
      storeFallbackSubmission({ nome, cpf, telefone, comunidade: community.name }, error.message)
      return res.json({
        success: true,
        fallback: true,
        message: 'Cadastro salvo com contingência temporária de e-mail.',
      })
    } catch (fallbackError) {
      console.error('Erro ao salvar fallback de comunidade:', fallbackError.message)
      return res.status(500).json({ success: false, error: 'Falha temporária no servidor.' })
    }
  }
})

app.post('/api/denuncias', (req, res) => {
  upload.array('anexos', MAX_ATTACHMENTS)(req, res, async (uploadError) => {
    if (uploadError) {
      const message = uploadError instanceof multer.MulterError
        ? 'Não foi possível receber os anexos. Verifique a quantidade e o tamanho dos arquivos.'
        : uploadError.message
      return res.status(400).json({ success: false, error: message })
    }

    const reporterStoreId = normalizeField(req.body?.reporterStore)
    const accusedStoreId = normalizeField(req.body?.accusedStore)
    const reason = normalizeField(req.body?.reason)
    const accusedName = normalizeField(req.body?.accusedName)
    const accusedRole = normalizeField(req.body?.accusedRole)
    const details = normalizeField(req.body?.details)
    const identify = normalizeField(req.body?.identify || 'nao').toLowerCase()
    const reporterName = normalizeField(req.body?.reporterName)
    const wantsReturn = normalizeField(req.body?.wantsReturn || 'nao').toLowerCase()
    const returnEmail = normalizeField(req.body?.returnEmail)
    const returnPhone = normalizeField(req.body?.returnPhone)

    const errors = []

    if (!STORES[reporterStoreId]) errors.push('Loja de origem inválida.')
    if (!STORES[accusedStoreId]) errors.push('Loja da pessoa denunciada inválida.')
    if (!validateLength(reason, 5, 180)) errors.push('Informe o motivo da denúncia.')
    if (!validateLength(accusedName, 3, 120)) errors.push('Informe o nome da pessoa denunciada.')
    if (!validateLength(accusedRole, 2, 120)) errors.push('Informe o cargo da pessoa denunciada.')
    if (!validateLength(details, 20, 6000)) errors.push('Descreva o ocorrido com mais detalhes.')
    if (!['sim', 'nao'].includes(identify)) errors.push('Opção de identificação inválida.')
    if (!['sim', 'nao'].includes(wantsReturn)) errors.push('Opção de retorno inválida.')
    if (identify === 'sim' && !validateLength(reporterName, 3, 120)) errors.push('Informe o nome para identificação sigilosa.')

    if (wantsReturn === 'sim') {
      const hasEmail = returnEmail.length > 0
      const hasPhone = returnPhone.replace(/\D/g, '').length > 0

      if (!hasEmail && !hasPhone) errors.push('Informe e-mail ou celular para retorno.')
      if (hasEmail && !isValidEmail(returnEmail)) errors.push('Informe um e-mail válido para retorno.')
      if (hasPhone && returnPhone.replace(/\D/g, '').length < 10) errors.push('Informe um celular válido para retorno.')
    }

    if (errors.length) {
      return res.status(400).json({ success: false, error: errors[0] })
    }

    const protocol = generateProtocol()
    const reporterStore = STORES[reporterStoreId]
    const accusedStore = STORES[accusedStoreId]
    const safeDetails = escapeHtml(details).replace(/\n/g, '<br>')
    const complaintRecipient = envValue('DENUNCIAS_TO', 'denuncias@salina.com.br')
    const complaintSender = smtpValue('DENUNCIAS_', 'SMTP_USER', envValue('SMTP_USER'))
    const subject = `Canal de Denúncias | ${sanitizeSubject(accusedName)} | ${sanitizeSubject(reason)} | ${sanitizeSubject(accusedStore)}`

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 760px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 18px;">
        <div style="background: linear-gradient(135deg, #1f4298, #00a3d7, #ee1c25); padding: 26px; border-radius: 14px; color: white;">
          <h1 style="margin: 0; font-size: 22px;">Registro recebido pelo Canal de Denúncias</h1>
          <p style="margin: 10px 0 0; font-size: 14px; font-weight: 700;">Protocolo: ${escapeHtml(protocol)}</p>
        </div>

        <div style="margin-top: 18px; border: 1px solid #b9e6f4; background: #eef9fd; border-radius: 12px; padding: 16px;">
          <p style="margin: 0; color: #1f4298; font-size: 14px; line-height: 1.6; font-weight: 700;">
            Este registro contém informações sensíveis e deve ser tratado com acesso restrito, confidencialidade e cautela, sem exposição indevida da pessoa denunciante.
          </p>
        </div>

        <div style="margin-top: 18px; background: white; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(15,23,42,0.08);">
          <h2 style="margin: 0 0 12px; color: #1e293b; font-size: 17px;">Resumo da denúncia</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${htmlRow('Loja do denunciante', escapeHtml(reporterStore))}
            ${htmlRow('Loja da pessoa denunciada', escapeHtml(accusedStore))}
            ${htmlRow('Motivo informado', escapeHtml(reason))}
            ${htmlRow('Pessoa denunciada', escapeHtml(accusedName))}
            ${htmlRow('Cargo informado', escapeHtml(accusedRole))}
          </table>
        </div>

        <div style="margin-top: 18px; background: white; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(15,23,42,0.08);">
          <h2 style="margin: 0 0 12px; color: #1e293b; font-size: 17px;">Relato detalhado</h2>
          <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.7;">${safeDetails}</p>
        </div>

        <div style="margin-top: 18px; background: white; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(15,23,42,0.08);">
          <h2 style="margin: 0 0 12px; color: #1e293b; font-size: 17px;">Identificação e retorno</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${htmlRow('Deseja se identificar?', escapeHtml(formatYesNo(identify)))}
            ${htmlRow('Nome do denunciante', identify === 'sim' ? escapeHtml(reporterName) : 'Não informado')}
            ${htmlRow('Solicitou retorno?', escapeHtml(formatYesNo(wantsReturn)))}
            ${htmlRow('E-mail para retorno', wantsReturn === 'sim' ? escapeHtml(returnEmail) : 'Não informado')}
            ${htmlRow('Celular para retorno', wantsReturn === 'sim' ? escapeHtml(returnPhone) : 'Não informado')}
          </table>
        </div>

        <div style="margin-top: 18px; background: white; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(15,23,42,0.08);">
          <h2 style="margin: 0 0 12px; color: #1e293b; font-size: 17px;">Anexos</h2>
          <p style="margin: 0; color: #475569; font-size: 14px;">${req.files?.length ? `${req.files.length} arquivo(s) anexado(s) a este e-mail.` : 'Nenhum arquivo foi anexado.'}</p>
        </div>
      </div>
    `

    const text = [
      'Registro recebido pelo Canal de Denúncias',
      `Protocolo: ${protocol}`,
      '',
      'Resumo da denúncia',
      textLine('Loja do denunciante', reporterStore),
      textLine('Loja da pessoa denunciada', accusedStore),
      textLine('Motivo informado', reason),
      textLine('Pessoa denunciada', accusedName),
      textLine('Cargo informado', accusedRole),
      '',
      'Relato detalhado',
      details,
      '',
      'Identificação e retorno',
      textLine('Deseja se identificar?', formatYesNo(identify)),
      textLine('Nome do denunciante', identify === 'sim' ? reporterName : ''),
      textLine('Solicitou retorno?', formatYesNo(wantsReturn)),
      textLine('E-mail para retorno', wantsReturn === 'sim' ? returnEmail : ''),
      textLine('Celular para retorno', wantsReturn === 'sim' ? returnPhone : ''),
      '',
      `Anexos: ${req.files?.length || 0}`,
    ].join('\n')

    const attachments = (req.files || []).map((file) => ({
      filename: sanitizeAttachmentName(file.originalname),
      content: file.buffer,
      contentType: file.mimetype,
    }))

    try {
      await complaintTransporter.sendMail({
        from: `"Canal de Denúncias Salina" <${complaintSender}>`,
        to: complaintRecipient,
        subject,
        html,
        text,
        attachments,
      })

      console.log(`Denuncia enviada | Protocolo: ${protocol} | Loja denunciada: ${accusedStore}`)
      return res.json({ success: true, protocol })
    } catch (error) {
      console.error(`Erro ao enviar denuncia | Protocolo: ${protocol}:`, error.message)
      return res.status(500).json({
        success: false,
        error: 'Não foi possível enviar a denúncia neste momento. Tente novamente em alguns minutos.',
      })
    }
  })
})

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server rodando em http://0.0.0.0:${PORT}`)
})
