<template>
  <main
    :class="[
      'min-h-screen px-4 py-8 text-[#18315f] md:py-12',
      isDarkMode
        ? 'theme-dark bg-[#07111f] text-[#eaf5ff]'
        : 'theme-light bg-linear-to-br from-[#f4f8fc] via-white to-[#eef8fb]',
    ]"
  >
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <section class="overflow-hidden rounded-[28px] border border-[#d8e6f2] bg-white shadow-2xl shadow-[#1f4298]/10">
        <div class="h-2 w-full bg-linear-to-r from-[#ee1c25] via-[#00a3d7] to-[#1f4298]"></div>

        <div class="px-5 py-7 md:px-10 md:py-10">
          <div class="mb-7 flex justify-center">
            <img
              src="/logo-ideal.png"
              alt="Salina Supermercados"
              class="h-20 w-auto object-contain md:h-24"
            />
          </div>

          <div class="mb-7 flex justify-center">
            <div class="theme-toggle" role="group" aria-label="Selecionar tema">
              <button
                type="button"
                class="theme-toggle-option"
                :class="!isDarkMode && 'theme-toggle-option-active'"
                :aria-pressed="!isDarkMode"
                @click="theme = 'light'"
              >
                Claro
              </button>
              <button
                type="button"
                class="theme-toggle-option"
                :class="isDarkMode && 'theme-toggle-option-active'"
                :aria-pressed="isDarkMode"
                @click="theme = 'dark'"
              >
                Escuro
              </button>
            </div>
          </div>

          <template v-if="isComplaintRoute">
            <div v-if="complaintSent" class="mx-auto max-w-2xl text-center">
              <p class="text-sm font-bold uppercase text-[#00a3d7]">Registro enviado</p>
              <h1 class="mt-3 text-2xl font-extrabold leading-tight text-[#1f4298] md:text-3xl">
                Sua denúncia foi registrada com sucesso
              </h1>
              <p class="mt-5 text-sm leading-relaxed text-slate-600 md:text-base">
                As informações serão analisadas com cuidado e tratadas sob sigilo. O acesso ao conteúdo será restrito às pessoas responsáveis pela apuração, observados os deveres de confidencialidade e proteção da identidade de quem realizou o registro.
              </p>
              <p class="mt-4 rounded-2xl border border-[#b9e6f4] bg-[#eef9fd] px-5 py-4 text-sm font-semibold leading-relaxed text-[#1f4298]">
                Caso tenha solicitado retorno, a empresa utilizará exclusivamente o canal informado, preservando a reserva necessária à condução da apuração.
              </p>
            </div>

            <form v-else id="form-denuncia" class="mx-auto max-w-3xl space-y-7" @submit.prevent="handleComplaintSubmit">
              <div class="text-center">
                <p class="text-sm font-bold uppercase text-[#00a3d7]">Canal reservado</p>
                <h1 class="mt-2 text-2xl font-extrabold leading-tight text-[#1f4298] md:text-3xl">
                  Formulário de denúncias
                </h1>
                <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Este canal é destinado ao registro de fatos que exijam apuração interna. As informações serão tratadas com confidencialidade, acesso restrito e cautela, sem exposição indevida da pessoa denunciante.
                </p>
              </div>

              <div class="rounded-2xl border border-[#b9e6f4] bg-[#eef9fd] px-5 py-4 text-sm leading-relaxed text-[#18315f]">
                <strong class="text-[#1f4298]">Compromisso de confidencialidade.</strong>
                A identificação é opcional. Quando informada, será preservada e utilizada apenas quando indispensável à análise responsável dos fatos, respeitando o sigilo e a proteção contra retaliações.
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div>
                  <label for="reporterStore" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                    Loja em que você trabalha
                  </label>
                  <select
                    id="reporterStore"
                    v-model="complaint.reporterStore"
                    class="field-control"
                    :class="complaintErrors.reporterStore && 'field-control-error'"
                    required
                  >
                    <option value="">Selecione sua loja</option>
                    <option v-for="store in stores" :key="store.id" :value="store.id">
                      {{ store.name }}
                    </option>
                  </select>
                  <p v-if="complaintErrors.reporterStore" class="field-error">{{ complaintErrors.reporterStore }}</p>
                </div>

                <div>
                  <label for="accusedStore" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                    Loja da pessoa denunciada
                  </label>
                  <select
                    id="accusedStore"
                    v-model="complaint.accusedStore"
                    class="field-control"
                    :class="complaintErrors.accusedStore && 'field-control-error'"
                    required
                  >
                    <option value="">Selecione a loja</option>
                    <option v-for="store in stores" :key="store.id" :value="store.id">
                      {{ store.name }}
                    </option>
                  </select>
                  <p v-if="complaintErrors.accusedStore" class="field-error">{{ complaintErrors.accusedStore }}</p>
                </div>
              </div>

              <div>
                <label for="reason" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                  O que você deseja denunciar?
                </label>
                <input
                  id="reason"
                  v-model.trim="complaint.reason"
                  type="text"
                  maxlength="180"
                  placeholder="Ex.: abuso de autoridade, importunação sexual, violência verbal, assédio, ameaça ou discriminação"
                  class="field-control"
                  :class="complaintErrors.reason && 'field-control-error'"
                  required
                />
                <p v-if="complaintErrors.reason" class="field-error">{{ complaintErrors.reason }}</p>
              </div>

              <div class="grid gap-5 md:grid-cols-2">
                <div>
                  <label for="accusedName" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                    Nome da pessoa denunciada
                  </label>
                  <input
                    id="accusedName"
                    v-model.trim="complaint.accusedName"
                    type="text"
                    maxlength="120"
                    class="field-control"
                    :class="complaintErrors.accusedName && 'field-control-error'"
                    required
                  />
                  <p v-if="complaintErrors.accusedName" class="field-error">{{ complaintErrors.accusedName }}</p>
                </div>

                <div>
                  <label for="accusedRole" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                    Cargo que ocupa
                  </label>
                  <input
                    id="accusedRole"
                    v-model.trim="complaint.accusedRole"
                    type="text"
                    maxlength="120"
                    class="field-control"
                    :class="complaintErrors.accusedRole && 'field-control-error'"
                    required
                  />
                  <p v-if="complaintErrors.accusedRole" class="field-error">{{ complaintErrors.accusedRole }}</p>
                </div>
              </div>

              <div>
                <label for="details" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                  Descreva o ocorrido com detalhes
                </label>
                <textarea
                  id="details"
                  v-model.trim="complaint.details"
                  rows="7"
                  maxlength="6000"
                  placeholder="Informe datas aproximadas, local, pessoas envolvidas, testemunhas e qualquer detalhe que possa ajudar na apuração."
                  class="field-control min-h-44 resize-y"
                  :class="complaintErrors.details && 'field-control-error'"
                  required
                ></textarea>
                <div class="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <p v-if="complaintErrors.details" class="field-error mt-0">{{ complaintErrors.details }}</p>
                  <p class="sm:ml-auto">{{ complaint.details.length }}/6000 caracteres</p>
                </div>
              </div>

              <div>
                <span class="mb-2 block text-xs font-bold uppercase text-slate-500">
                  Anexar provas, se houver
                </span>
                <label
                  for="attachments"
                  class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#9ed8ec] bg-[#f8fbfe] px-5 py-7 text-center transition hover:border-[#00a3d7] hover:bg-[#eef9fd]"
                >
                  <input id="attachments" type="file" multiple class="sr-only" @change="handleComplaintFiles" />
                  <span class="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f4298] text-white shadow-lg shadow-[#1f4298]/20">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                    </svg>
                  </span>
                  <span class="mt-3 text-sm font-bold text-[#1f4298]">Selecionar arquivos</span>
                  <span class="mt-1 text-xs text-slate-500">Até 5 arquivos, com 8 MB por arquivo.</span>
                </label>
                <p v-if="complaintErrors.files" class="field-error">{{ complaintErrors.files }}</p>

                <ul v-if="complaint.files.length" class="mt-3 space-y-2">
                  <li
                    v-for="(file, index) in complaint.files"
                    :key="`${file.name}-${file.size}-${index}`"
                    class="flex items-center justify-between gap-3 rounded-xl border border-[#d8e6f2] bg-white px-4 py-3 text-sm"
                  >
                    <span class="min-w-0">
                      <span class="block truncate font-semibold text-[#18315f]">{{ file.name }}</span>
                      <span class="text-xs text-slate-500">{{ formatFileSize(file.size) }}</span>
                    </span>
                    <button
                      type="button"
                      class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-[#ee1c25] transition hover:bg-red-50"
                      @click="removeComplaintFile(index)"
                    >
                      Remover
                    </button>
                  </li>
                </ul>
              </div>

              <fieldset class="space-y-3">
                <legend class="text-xs font-bold uppercase text-slate-500">Você quer se identificar?</legend>
                <div class="grid gap-3 sm:grid-cols-2">
                  <button
                    v-for="option in yesNoOptions"
                    :key="`identify-${option.value}`"
                    type="button"
                    class="choice-control"
                    :class="complaint.identify === option.value && 'choice-control-active'"
                    :aria-pressed="complaint.identify === option.value"
                    @click="complaint.identify = option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <p class="text-sm leading-relaxed text-slate-600">
                  Caso escolha se identificar, sua identidade será mantida sob sigilo e não será compartilhada com a pessoa denunciada. O acesso ficará restrito às pessoas responsáveis pela análise da denúncia.
                </p>
                <p v-if="complaintErrors.identify" class="field-error">{{ complaintErrors.identify }}</p>
              </fieldset>

              <div v-if="complaint.identify === 'sim'">
                <label for="reporterName" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                  Seu nome
                </label>
                <input
                  id="reporterName"
                  v-model.trim="complaint.reporterName"
                  type="text"
                  maxlength="120"
                  class="field-control"
                  :class="complaintErrors.reporterName && 'field-control-error'"
                />
                <p v-if="complaintErrors.reporterName" class="field-error">{{ complaintErrors.reporterName }}</p>
              </div>

              <fieldset class="space-y-3">
                <legend class="text-xs font-bold uppercase text-slate-500">
                  Você gostaria de receber algum retorno sobre sua denúncia?
                </legend>
                <div class="grid gap-3 sm:grid-cols-2">
                  <button
                    v-for="option in yesNoOptions"
                    :key="`return-${option.value}`"
                    type="button"
                    class="choice-control"
                    :class="complaint.wantsReturn === option.value && 'choice-control-active'"
                    :aria-pressed="complaint.wantsReturn === option.value"
                    @click="complaint.wantsReturn = option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <p class="text-sm leading-relaxed text-slate-600">
                  O retorno, quando solicitado, será feito com discrição pelo canal escolhido, sem exposição do conteúdo da denúncia ou da identidade de quem realizou o registro.
                </p>
                <p v-if="complaintErrors.wantsReturn" class="field-error">{{ complaintErrors.wantsReturn }}</p>
              </fieldset>

              <div v-if="complaint.wantsReturn === 'sim'" class="rounded-2xl border border-[#d8e6f2] bg-[#f8fbfe] p-5">
                <p class="text-sm font-bold text-[#1f4298]">Como você deseja receber o retorno?</p>
                <p class="mt-1 text-sm text-slate-600">Você pode informar apenas um canal. Ao preencher e-mail ou celular, o outro deixa de ser obrigatório.</p>

                <div class="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label for="returnEmail" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                      E-mail
                    </label>
                    <input
                      id="returnEmail"
                      v-model.trim="complaint.returnEmail"
                      type="email"
                      maxlength="160"
                      placeholder="seuemail@exemplo.com"
                      class="field-control"
                      :class="complaintErrors.returnEmail && 'field-control-error'"
                    />
                    <p v-if="complaintErrors.returnEmail" class="field-error">{{ complaintErrors.returnEmail }}</p>
                  </div>

                  <div>
                    <label for="returnPhone" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                      Número de celular
                    </label>
                    <input
                      id="returnPhone"
                      v-model="complaint.returnPhone"
                      type="text"
                      maxlength="15"
                      inputmode="tel"
                      placeholder="(00) 00000-0000"
                      class="field-control"
                      :class="complaintErrors.returnPhone && 'field-control-error'"
                      @input="maskComplaintReturnPhone"
                    />
                    <p v-if="complaintErrors.returnPhone" class="field-error">{{ complaintErrors.returnPhone }}</p>
                  </div>
                </div>
              </div>

              <div
                v-if="complaintStatus.message"
                :class="complaintStatus.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-[#b9e6f4] bg-[#eef9fd] text-[#1f4298]'"
                class="rounded-xl border px-4 py-3 text-center text-sm"
              >
                {{ complaintStatus.message }}
              </div>

              <button
                type="submit"
                :disabled="complaintLoading"
                class="w-full rounded-xl bg-linear-to-r from-[#1f4298] via-[#00a3d7] to-[#ee1c25] px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-[#1f4298]/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {{ complaintLoading ? 'Enviando...' : 'Enviar denúncia' }}
              </button>
            </form>
          </template>

          <template v-else>
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
                    <span class="block text-xs font-bold uppercase text-[#00a3d7]">Comunidade Salina</span>
                    <span class="mt-2 block text-xl font-extrabold text-[#18315f]">{{ community.unitName }}</span>
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

            <div v-else class="mx-auto max-w-2xl space-y-7">
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
                <p class="text-xs font-bold uppercase text-[#00a3d7]">Cadastro oficial</p>
                <h1 class="mt-2 text-2xl font-extrabold leading-tight text-[#1f4298] md:text-3xl">
                  {{ selectedCommunity.name }}
                </h1>
                <p class="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                  {{ selectedCommunity.description }}
                </p>
              </div>

              <form id="form-cadastro" class="space-y-5" @submit.prevent="handleSubmit">
                <div>
                  <label for="nome" class="mb-2 block text-xs font-bold uppercase text-slate-500">Nome completo</label>
                  <input
                    id="nome"
                    v-model="form.nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    required
                    autocomplete="name"
                    class="field-control"
                  />
                </div>

                <div>
                  <label for="cpf" class="mb-2 block text-xs font-bold uppercase text-slate-500">CPF</label>
                  <input
                    id="cpf"
                    v-model="form.cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    maxlength="14"
                    required
                    inputmode="numeric"
                    autocomplete="off"
                    class="field-control"
                    @input="maskCPF"
                  />
                </div>

                <div>
                  <label for="telefone" class="mb-2 block text-xs font-bold uppercase text-slate-500">
                    Número de telefone
                  </label>
                  <input
                    id="telefone"
                    v-model="form.telefone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    maxlength="15"
                    required
                    inputmode="tel"
                    autocomplete="tel"
                    class="field-control"
                    @input="maskPhone"
                  />
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
                  class="w-full rounded-xl bg-linear-to-r from-[#1f4298] via-[#00a3d7] to-[#ee1c25] px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-[#1f4298]/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {{ loading ? 'Enviando...' : 'Entrar na comunidade' }}
                </button>
              </form>

              <p class="text-center text-xs text-slate-500">
                Seus dados são usados apenas para registrar sua solicitação de entrada na comunidade selecionada.
              </p>
            </div>
          </template>
        </div>
      </section>
    </div>

    <div
      v-if="showComplaintConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#18315f]/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="confirm-title" class="text-xl font-extrabold text-[#1f4298]">Confirmar envio da denúncia</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">
          Confirme se as informações estão completas e corretas. Após o envio, o registro será encaminhado ao canal responsável para análise sigilosa.
        </p>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="rounded-xl border border-[#d8e6f2] px-5 py-3 text-sm font-bold text-[#1f4298] transition hover:bg-[#eef9fd]"
            @click="showComplaintConfirm = false"
          >
            Fazer alteração
          </button>
          <button
            type="button"
            :disabled="complaintLoading"
            class="rounded-xl bg-[#1f4298] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#18315f] disabled:cursor-not-allowed disabled:opacity-60"
            @click="confirmComplaintSubmit"
          >
            {{ complaintLoading ? 'Enviando...' : 'Sim, enviar' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const routePath = window.location.pathname.replace(/\/+$/, '') || '/'
const isComplaintRoute = routePath === '/180' || window.history.state?.reservedChannel === true

if (routePath === '/180' && window.history?.replaceState) {
  window.history.replaceState({ reservedChannel: true }, document.title, '/')
}

const theme = ref('light')
const isDarkMode = computed(() => theme.value === 'dark')

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

const stores = [
  { id: 'loja-1-jardim-america', name: 'Loja 1 - Jardim América' },
  { id: 'loja-4-perimetral', name: 'Loja 4 - Perimetral' },
  { id: 'loja-3-boraceia', name: 'Loja 3 - Boracéia' },
  { id: 'loja-5-borborema', name: 'Loja 5 - Borborema' },
]

const yesNoOptions = [
  { value: 'nao', label: 'Não' },
  { value: 'sim', label: 'Sim' },
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

const complaint = reactive({
  reporterStore: '',
  accusedStore: '',
  reason: '',
  accusedName: '',
  accusedRole: '',
  details: '',
  files: [],
  identify: 'nao',
  reporterName: '',
  wantsReturn: 'nao',
  returnEmail: '',
  returnPhone: '',
})

const loading = ref(false)
const statusMsg = ref('')
const statusError = ref(false)
const complaintLoading = ref(false)
const complaintSent = ref(false)
const showComplaintConfirm = ref(false)
const complaintStatus = reactive({
  message: '',
  error: false,
})
const complaintErrors = reactive({})

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

function maskComplaintReturnPhone(e) {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
  } else {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  }
  complaint.returnPhone = v
}

function clearComplaintErrors() {
  Object.keys(complaintErrors).forEach((key) => delete complaintErrors[key])
}

function setComplaintError(field, message) {
  complaintErrors[field] = message
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function handleComplaintFiles(event) {
  const selectedFiles = Array.from(event.target.files || [])
  const nextFiles = [...complaint.files]
  const maxFiles = 5
  const maxFileSize = 8 * 1024 * 1024

  delete complaintErrors.files

  for (const file of selectedFiles) {
    if (nextFiles.length >= maxFiles) {
      setComplaintError('files', 'É permitido anexar até 5 arquivos.')
      break
    }

    if (file.size > maxFileSize) {
      setComplaintError('files', `O arquivo "${file.name}" ultrapassa o limite de 8 MB.`)
      continue
    }

    nextFiles.push(file)
  }

  complaint.files = nextFiles
  event.target.value = ''
}

function removeComplaintFile(index) {
  complaint.files = complaint.files.filter((_, fileIndex) => fileIndex !== index)
}

function formatFileSize(size) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function validateComplaint() {
  clearComplaintErrors()

  if (!complaint.reporterStore) setComplaintError('reporterStore', 'Selecione a loja em que você trabalha.')
  if (!complaint.accusedStore) setComplaintError('accusedStore', 'Selecione a loja da pessoa denunciada.')
  if (complaint.reason.length < 5) setComplaintError('reason', 'Informe o motivo da denúncia.')
  if (complaint.accusedName.length < 3) setComplaintError('accusedName', 'Informe o nome da pessoa denunciada.')
  if (complaint.accusedRole.length < 2) setComplaintError('accusedRole', 'Informe o cargo da pessoa denunciada.')
  if (complaint.details.length < 20) setComplaintError('details', 'Descreva o ocorrido com mais detalhes.')
  if (!['sim', 'nao'].includes(complaint.identify)) setComplaintError('identify', 'Informe se deseja se identificar.')
  if (!['sim', 'nao'].includes(complaint.wantsReturn)) setComplaintError('wantsReturn', 'Informe se deseja receber retorno.')

  if (complaint.identify === 'sim' && complaint.reporterName.length < 3) {
    setComplaintError('reporterName', 'Informe seu nome para identificação sigilosa.')
  }

  if (complaint.wantsReturn === 'sim') {
    const hasEmail = complaint.returnEmail.length > 0
    const hasPhone = complaint.returnPhone.replace(/\D/g, '').length > 0

    if (!hasEmail && !hasPhone) {
      setComplaintError('returnEmail', 'Informe e-mail ou celular para retorno.')
      setComplaintError('returnPhone', 'Informe e-mail ou celular para retorno.')
    }

    if (hasEmail && !isValidEmail(complaint.returnEmail)) {
      setComplaintError('returnEmail', 'Informe um e-mail válido.')
    }

    if (hasPhone && complaint.returnPhone.replace(/\D/g, '').length < 10) {
      setComplaintError('returnPhone', 'Informe um celular válido.')
    }
  }

  return Object.keys(complaintErrors).length === 0
}

function handleComplaintSubmit() {
  complaintStatus.message = ''
  complaintStatus.error = false

  if (!validateComplaint()) {
    complaintStatus.message = 'Revise os campos destacados antes de enviar.'
    complaintStatus.error = true
    return
  }

  showComplaintConfirm.value = true
}

async function confirmComplaintSubmit() {
  if (!validateComplaint()) {
    showComplaintConfirm.value = false
    return
  }

  complaintLoading.value = true
  complaintStatus.message = ''
  complaintStatus.error = false

  try {
    const payload = new FormData()
    payload.append('reporterStore', complaint.reporterStore)
    payload.append('accusedStore', complaint.accusedStore)
    payload.append('reason', complaint.reason)
    payload.append('accusedName', complaint.accusedName)
    payload.append('accusedRole', complaint.accusedRole)
    payload.append('details', complaint.details)
    payload.append('identify', complaint.identify)
    payload.append('reporterName', complaint.identify === 'sim' ? complaint.reporterName : '')
    payload.append('wantsReturn', complaint.wantsReturn)
    payload.append('returnEmail', complaint.wantsReturn === 'sim' ? complaint.returnEmail : '')
    payload.append('returnPhone', complaint.wantsReturn === 'sim' ? complaint.returnPhone : '')
    complaint.files.forEach((file) => payload.append('anexos', file))

    const response = await fetch('/api/denuncias', {
      method: 'POST',
      body: payload,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Falha ao enviar denúncia (${response.status}).`)
    }

    showComplaintConfirm.value = false
    complaintSent.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    complaintStatus.message = err?.message || 'Não foi possível enviar a denúncia neste momento.'
    complaintStatus.error = true
    showComplaintConfirm.value = false
  } finally {
    complaintLoading.value = false
  }
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
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  gap: 0.25rem;
  border-radius: 999px;
  border: 1px solid #d8e6f2;
  background: #f8fbfe;
  padding: 0.25rem;
  box-shadow: 0 10px 25px rgba(31, 66, 152, 0.08);
}

.theme-toggle-option {
  border-radius: 999px;
  padding: 0.5rem 1rem;
  color: #1f4298;
  font-size: 0.8125rem;
  font-weight: 800;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.theme-toggle-option:hover {
  background: #eef9fd;
  color: #18315f;
}

.theme-toggle-option-active,
.theme-toggle-option-active:hover {
  background: #1f4298;
  color: #fff;
  box-shadow: 0 8px 20px rgba(31, 66, 152, 0.18);
}

.field-control {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #d8e6f2;
  background: #f8fbfe;
  padding: 0.875rem 1rem;
  color: #18315f;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.field-control::placeholder {
  color: #94a3b8;
}

.field-control:hover {
  border-color: rgba(0, 163, 215, 0.7);
}

.field-control:focus {
  outline: none;
  border-color: #00a3d7;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 163, 215, 0.2);
}

.field-control-error {
  border-color: #ef4444;
  background: #fff7f7;
}

.field-error {
  margin-top: 0.5rem;
  color: #b91c1c;
  font-size: 0.75rem;
  font-weight: 700;
}

.choice-control {
  appearance: none;
  cursor: pointer;
  border-radius: 0.75rem;
  border: 1px solid #d8e6f2;
  background: #fff;
  padding: 0.875rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 800;
  color: #1f4298;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.choice-control:hover {
  border-color: #00a3d7;
  background: #eef9fd;
  color: #18315f;
}

.choice-control-active {
  border-color: #1f4298;
  background: #1f4298;
  color: #fff;
  box-shadow: 0 10px 25px rgba(31, 66, 152, 0.16);
}

.choice-control-active:hover {
  border-color: #18315f;
  background: #18315f;
  color: #fff;
}

.theme-dark section {
  border-color: #274766;
  background: #101c2f;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
}

.theme-dark [class*="bg-white"] {
  background-color: #14223a !important;
}

.theme-dark [class*="bg-[#f8fbfe]"],
.theme-dark [class*="bg-[#eef9fd]"] {
  background-color: #12243c !important;
}

.theme-dark [class*="border-[#d8e6f2]"],
.theme-dark [class*="border-[#b9e6f4]"],
.theme-dark [class*="border-[#9ed8ec]"] {
  border-color: #31577f !important;
}

.theme-dark [class*="text-[#1f4298]"],
.theme-dark [class*="text-[#18315f]"] {
  color: #eaf5ff !important;
}

.theme-dark [class*="text-[#00a3d7]"] {
  color: #64d9ff !important;
}

.theme-dark :where(h1, h2, h3, label, legend) {
  color: #eaf5ff !important;
}

.theme-dark :where(p) {
  color: #c8d6e6 !important;
}

.theme-dark .text-slate-600,
.theme-dark .text-slate-500,
.theme-dark .text-slate-400 {
  color: #c8d6e6 !important;
}

.theme-dark .field-control {
  border-color: #31577f;
  background: #0b1728;
  color: #eef7ff;
}

.theme-dark .field-control::placeholder {
  color: #8fa8bf;
}

.theme-dark .field-control:hover {
  border-color: #64d9ff;
}

.theme-dark .field-control:focus {
  border-color: #64d9ff;
  background: #0e1d31;
  box-shadow: 0 0 0 3px rgba(100, 217, 255, 0.18);
}

.theme-dark .field-control-error {
  border-color: #fb7185;
  background: #2a101d;
}

.theme-dark .field-error {
  color: #fda4af;
}

.theme-dark .choice-control {
  border-color: #31577f;
  background: #0f1f34;
  color: #eaf5ff;
}

.theme-dark .choice-control:hover {
  border-color: #64d9ff;
  background: #162d4a;
  color: #fff;
}

.theme-dark .choice-control-active,
.theme-dark .choice-control-active:hover {
  border-color: #64d9ff;
  background: #1f4298;
  color: #fff;
  box-shadow: 0 10px 25px rgba(100, 217, 255, 0.14);
}

.theme-dark .theme-toggle {
  border-color: #31577f;
  background: #0b1728;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.28);
}

.theme-dark .theme-toggle-option {
  color: #c8d6e6;
}

.theme-dark .theme-toggle-option:hover {
  background: #162d4a;
  color: #fff;
}

.theme-dark .theme-toggle-option-active,
.theme-dark .theme-toggle-option-active:hover {
  background: #64d9ff;
  color: #07111f;
}
</style>
