<template>
  <main class="min-h-screen bg-linear-to-br from-[#f4f8fc] via-white to-[#eef8fb] px-4 py-8 text-[#18315f] md:py-12">
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <section class="overflow-hidden rounded-[28px] border border-[#d8e6f2] bg-white shadow-2xl shadow-[#1f4298]/10">
        <div class="h-2 w-full bg-linear-to-r from-[#ee1c25] via-[#00a3d7] to-[#1f4298]"></div>

        <div class="px-6 py-8 md:px-10 md:py-10">
          <div class="mb-7 flex justify-center">
            <img
              src="/logo-ideal.png"
              alt="Salina Supermercados"
              class="h-20 w-auto object-contain md:h-24"
            />
          </div>

          <div v-if="!selectedCommunity" class="space-y-7">
            <div class="text-center">
              <h1 class="text-2xl font-extrabold leading-tight text-[#1f4298] md:text-3xl">
                Escolha sua comunidade Salina
              </h1>
              <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                Selecione a unidade desejada para continuar o cadastro e entrar no grupo oficial da comunidade.
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <button
                v-for="community in communities"
                :key="community.id"
                type="button"
                :class="community.id === 'boraceia'
                  ? 'border-l-[#ee1c25] hover:border-[#ee1c25] hover:shadow-[#ee1c25]/15'
                  : 'border-l-[#1f4298] hover:border-[#1f4298] hover:shadow-[#1f4298]/15'"
                class="group flex min-h-36 flex-col justify-between rounded-2xl border border-l-4 border-[#d8e6f2] bg-white p-5 text-left shadow-lg shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#00a3d7]/40"
                @click="selectCommunity(community.id)"
              >
                <span>
                  <span class="block text-xs font-bold uppercase tracking-[0.18em] text-[#00a3d7]">
                    Comunidade Salina
                  </span>
                  <span class="mt-2 block text-xl font-extrabold text-[#18315f]">
                    {{ community.unitName }}
                  </span>
                </span>
                <span class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f4298] group-hover:text-[#ee1c25]">
                  Continuar
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div v-else class="space-y-7">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold text-[#1f4298] transition hover:text-[#ee1c25] focus:outline-none focus:ring-2 focus:ring-[#00a3d7]/40"
              @click="clearCommunity"
            >
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M17 10a1 1 0 01-1 1H6.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L6.414 9H16a1 1 0 011 1z" clip-rule="evenodd" />
              </svg>
              Trocar comunidade
            </button>

            <div class="text-center">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#00a3d7]">
                Cadastro oficial
              </p>
              <h1 class="mt-2 text-2xl font-extrabold leading-tight text-[#1f4298] md:text-3xl">
                {{ selectedCommunity.name }}
              </h1>
              <p class="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                {{ selectedCommunity.description }}
              </p>
            </div>

            <form id="form-cadastro" class="space-y-5" @submit.prevent="handleSubmit">
              <div>
                <label for="nome" class="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Nome completo
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#1f4298]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="nome"
                    v-model="form.nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    required
                    autocomplete="name"
                    class="w-full rounded-xl border border-[#d8e6f2] bg-[#f8fbfe] py-3.5 pl-11 pr-4 text-sm text-[#18315f] placeholder-slate-400 transition-all duration-200 hover:border-[#00a3d7]/70 focus:border-[#00a3d7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a3d7]/25"
                  />
                </div>
              </div>

              <div>
                <label for="cpf" class="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  CPF
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#1f4298]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                    inputmode="numeric"
                    autocomplete="off"
                    class="w-full rounded-xl border border-[#d8e6f2] bg-[#f8fbfe] py-3.5 pl-11 pr-4 text-sm text-[#18315f] placeholder-slate-400 transition-all duration-200 hover:border-[#00a3d7]/70 focus:border-[#00a3d7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a3d7]/25"
                    @input="maskCPF"
                  />
                </div>
              </div>

              <div>
                <label for="telefone" class="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Número de telefone
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#1f4298]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                    inputmode="tel"
                    autocomplete="tel"
                    class="w-full rounded-xl border border-[#d8e6f2] bg-[#f8fbfe] py-3.5 pl-11 pr-4 text-sm text-[#18315f] placeholder-slate-400 transition-all duration-200 hover:border-[#00a3d7]/70 focus:border-[#00a3d7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a3d7]/25"
                    @input="maskPhone"
                  />
                </div>
              </div>

              <div
                v-if="statusMsg"
                :class="statusError ? 'border-red-200 bg-red-50 text-red-700' : 'border-[#b9e6f4] bg-[#eef9fd] text-[#1f4298]'"
                class="rounded-xl border px-4 py-3 text-center text-sm transition-all duration-300"
              >
                {{ statusMsg }}
              </div>

              <button
                id="btn-entrar-comunidade"
                type="submit"
                :disabled="loading"
                class="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-[#1f4298] via-[#00a3d7] to-[#ee1c25] py-4 text-base font-extrabold text-white shadow-lg shadow-[#1f4298]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#ee1c25]/20 focus:outline-none focus:ring-2 focus:ring-[#00a3d7]/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span v-if="!loading" class="flex items-center justify-center gap-3">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Entrar na comunidade
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Enviando...
                </span>
              </button>
            </form>

            <p class="text-center text-xs text-slate-500">
              Seus dados são usados apenas para registrar sua solicitação de entrada na comunidade selecionada.
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const communities = [
  {
    id: 'borborema',
    unitName: 'Borborema',
    name: 'Comunidade Salina Borborema',
    description:
      'Faça parte da Comunidade Salina Borborema e receba conteúdos exclusivos, novidades e ofertas em primeira mão. Ao entrar na comunidade, você concorda que seu nome e número de telefone estarão visíveis aos demais membros e administradores.',
    whatsappUrl: 'https://chat.whatsapp.com/EeiN7l6HQCpE1mzt55vjV6',
  },
  {
    id: 'boraceia',
    unitName: 'Boracéia',
    name: 'Comunidade Salina Boracéia',
    description:
      'Faça parte da Comunidade Salina Boracéia e receba conteúdos exclusivos, novidades e ofertas em primeira mão. Ao entrar na comunidade, você concorda que seu nome e número de telefone estarão visíveis aos demais membros e administradores.',
    whatsappUrl: 'https://chat.whatsapp.com/FGN1AITMqPg6zjNvk2XE6E?s=sw&p=a&mlu=4',
  },
]

const selectedCommunityId = ref('')
const selectedCommunity = computed(
  () => communities.find((community) => community.id === selectedCommunityId.value) || null
)

const form = reactive({
  nome: '',
  cpf: '',
  telefone: '',
})

const loading = ref(false)
const statusMsg = ref('')
const statusError = ref(false)

function selectCommunity(id) {
  selectedCommunityId.value = id
  statusMsg.value = ''
  statusError.value = false
}

function clearCommunity() {
  selectedCommunityId.value = ''
  statusMsg.value = ''
  statusError.value = false
}

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
  if (!selectedCommunity.value || !form.nome || !form.cpf || !form.telefone) return

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
        comunidade: selectedCommunity.value.id,
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
      const redirectUrl = selectedCommunity.value.whatsappUrl
      statusMsg.value = 'Cadastro realizado. Redirecionando para o WhatsApp...'
      statusError.value = false
      setTimeout(() => {
        const newWindow = window.open(redirectUrl, '_blank', 'noopener')
        if (!newWindow) window.location.href = redirectUrl
      }, 1500)
    } else {
      throw new Error(data.error || `Erro ao enviar (${response.status})`)
    }
  } catch (err) {
    if (err?.name === 'AbortError') {
      statusMsg.value = 'Tempo de resposta excedido. Tente novamente em alguns segundos.'
    } else if (err?.message === 'Failed to fetch') {
      statusMsg.value = 'Falha de conexão com o servidor. Verifique sua internet e tente novamente.'
    } else {
      statusMsg.value = err?.message || 'Erro ao enviar os dados. Verifique a conexão com o servidor.'
    }
    statusError.value = true
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
