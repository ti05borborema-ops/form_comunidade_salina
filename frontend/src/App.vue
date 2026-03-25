<template>
  <div class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
    <!-- Background decorative blobs -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-lg">
      <!-- Card -->
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        <!-- Top gradient strip -->
        <div class="h-1.5 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>

        <div class="px-8 py-10 md:px-12 md:py-12">

          <!-- Logo -->
          <div class="flex justify-center mb-8">
            <div class="bg-white rounded-2xl px-6 py-4 shadow-lg shadow-black/30">
              <img
                src="/logo-ideal.png"
                alt="Logo Ideal"
                class="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          </div>

          <!-- Headline -->
          <div class="text-center mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              Faça parte da nossa comunidade!
            </h1>
          </div>

          <!-- Descriptive text area -->
          <div class="mb-8">
            <div class="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p class="text-slate-300 leading-relaxed text-sm md:text-base">
                {{ descricao }}
              </p>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5" id="form-cadastro">

            <!-- Nome Completo -->
            <div class="group">
              <label for="nome" class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Nome Completo
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="nome"
                  v-model="form.nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  required
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-200 hover:border-white/20"
                />
              </div>
            </div>

            <!-- CPF -->
            <div class="group">
              <label for="cpf" class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                CPF
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                  </svg>
                </div>
                <input
                  id="cpf"
                  v-model="form.cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  maxlength="14"
                  required
                  @input="maskCPF"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-200 hover:border-white/20"
                />
              </div>
            </div>

            <!-- Telefone -->
            <div class="group">
              <label for="telefone" class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Número de Telefone
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="telefone"
                  v-model="form.telefone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  maxlength="15"
                  required
                  @input="maskPhone"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-200 hover:border-white/20"
                />
              </div>
            </div>

            <!-- Status messages -->
            <div v-if="statusMsg" :class="statusError ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'"
              class="border rounded-xl px-4 py-3 text-sm text-center transition-all duration-300">
              {{ statusMsg }}
            </div>

            <!-- Submit button -->
            <button
              id="btn-entrar-comunidade"
              type="submit"
              :disabled="loading"
              class="group relative w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <span v-if="!loading" class="flex items-center justify-center gap-3">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Entrar na Comunidade
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Enviando...
              </span>
            </button>

          </form>

          <!-- Footer note -->
          <p class="text-center text-slate-500 text-xs mt-6">
            🔒 Seus dados são seguros e não serão compartilhados.
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const descricao = ref(
  'Faça parte da comunidade Salina Borborema e receba conteúdos exclusivos, novidades e ofertas em primeira mão. Não perca essa oportunidade única de estar sempre atualizado! Ao entrar na comunidade você concorda que seu nome e seu número de telefone estarão visiveis aos demais membros da comunidade e aos administradores desta.'
)

const form = reactive({
  nome: '',
  cpf: '',
  telefone: '',
})

const loading = ref(false)
const statusMsg = ref('')
const statusError = ref(false)

function maskCPF(e) {
  let v = e.target.value.replace(/\D/g, '')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.cpf = v
}

function maskPhone(e) {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  }
  form.telefone = v
}

async function handleSubmit() {
  if (!form.nome || !form.cpf || !form.telefone) return

  loading.value = true
  statusMsg.value = ''
  statusError.value = false

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        nome: form.nome,
        cpf: form.cpf,
        telefone: form.telefone,
      }),
    })
    clearTimeout(timeout)

    const contentType = response.headers.get('content-type') || ''
    let data = {}

    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      await response.text()
      data = { error: `Resposta inválida do servidor (${response.status})` }
    }

    if (response.ok && data.success) {
      statusMsg.value = 'Cadastro realizado! Redirecionando para o WhatsApp...'
      statusError.value = false
      setTimeout(() => {
        window.open('https://chat.whatsapp.com/EeiN7l6HQCpE1mzt55vjV6', '_blank')
      }, 1500)
    } else {
      throw new Error(data.error || `Erro ao enviar (${response.status})`)
    }
  } catch (err) {
    if (err?.name === 'AbortError') {
      statusMsg.value = 'Tempo de resposta excedido. Tente novamente em alguns segundos.'
    } else if (err?.message === 'Failed to fetch') {
      statusMsg.value = 'Falha de conexao com o servidor. Verifique sua internet e tente novamente.'
    } else {
      statusMsg.value = err?.message || 'Erro ao enviar os dados. Verifique a conexao com o servidor.'
    }
    statusError.value = true
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
