<template>
  <h6>Status</h6>
  <div class="text-center">
    <v-chip size="small" :ripple="false" link >
      Aberto
    </v-chip>
    <v-chip size="small" :ripple="false" link>
      Fechado
    </v-chip>
  </div>
  <v-text-field 
    density="compact"
    class="search"
    append-inner-icon="mdi-magnify"
    variant="solo"
    hide-details
    single-line
    v-model="search"
    label="Pesquisar chamados"
    outlined>
  </v-text-field>
  <div class="categorias_e_chamados">
    <div id="categorias">
      <h6>Categoria</h6>
      <div class="text-left"> <!-- Ajuste feito aqui -->
        <v-chip size="small" :ripple="false" link class="categorias">
          Rede
        </v-chip>
        <v-chip size="small" :ripple="false" link class="categorias">
          Sistema
        </v-chip>
      </div>
    </div>
    <v-expansion-panels>
      <v-expansion-panel class="panel-spacing" v-for="(chamado, index) in filteredChamados" v-bind:key="index">
        <v-expansion-panel-title v-bind:class="{ 'panel-title-open': chamadoOpen }">
          <v-row no-gutters>
            <v-col class="d-flex justify-start" cols="4" style="margin-bottom: 2%;"> <h3> {{chamado.titulo}} </h3> </v-col>
            <v-col class="d-flex justify-end" cols="8">
              <v-chip :color="getChipColor(chamado.status)">{{ chamado.status }}</v-chip>
            </v-col>
            <v-col class="d-flex justify-start" cols="12"> 
              <p>{{ chamado.descricao }}</p>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text @click="chamadoOpen = !chamadoOpen">
          <v-row no-gutters>
            <v-col cols="5">
              <v-row no-gutters>
                <v-col cols="5">
                  <v-row no-gutters>
                    <p> Criado por </p>
                  </v-row>
                  <v-row no-gutters>
                    <div class="user-info">
                      <p class="bold-text">{{ chamado.usuario }}</p>
                      <p class="bold-text">{{ chamado.email_usuario }}</p>
                      <p class="bold-text">{{ chamado.setor_usuario }}</p>
                    </div>
                  </v-row>
                </v-col>
                <v-col cols="5">
                  <v-row no-gutters>
                    <p> Técnico Responsável </p>
                  </v-row>
                  <v-row no-gutters>
                    <div class="user-info">
                      <p class="bold-text">{{ chamado.responsavel }}</p>
                      <p class="bold-text">{{ chamado.email_responsavel }}</p>
                    </div>
                  </v-row>
                </v-col>
              </v-row>
              <br>
              <v-row no-gutters>
                <v-col cols="3">
                  <v-row>
                    <v-col>
                      <p class="categoria-text"> Categoria </p>
                      <v-chip color="primary" label> {{chamado.descricao_categoria}} </v-chip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="9">
                  <p> Anexos </p>
                  <div class="icon-container">
                    <v-row v-if="chamado.anexos.length > 0">
                      <v-col>
                        <v-row no-gutters>
                          <template v-for="(anexo, index) in chamado.anexos" v-bind:key="index">
                            <v-btn icon @click="downloadAttachment(anexo)" style="margin-right: 2%;">
                              <v-icon>mdi-file</v-icon>
                            </v-btn>
                          </template>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
              <br>
              <v-row no-gutters>
                 <v-col cols="11">
                   <v-row>
                     <v-col class="d-flex justify-end" v-if="!chamado.responsavel && grant()">
                       <v-chip v-if="grant()" class="ma-0" color="red" @click="negarChamado(chamado.id)" style="margin-right: 3% !important;">Negar</v-chip>
                       <v-chip v-if="grant()" class="ma-0" color="green" @click="atribuirChamado(chamado.id)">Atribuir</v-chip>
                     </v-col>
                     <v-col v-if="chamado.responsavel && grant()">
                       <v-select
                         :items="mudarStatusChamado"
                         label="Status"
                         density="compact"
                         variant="solo"
                         v-model="novoStatus"
                         @update:modelValue="atualizarStatus(chamado.id)"
                       ></v-select>
                     </v-col>
                   </v-row>
                 </v-col>
               </v-row>
            </v-col>
            <v-col cols="7">
              <Chat :chamado_id="chamado.id"/>
            </v-col>
          </v-row>
          <!-- <v-row no-gutters>
            <v-col cols="3">
              <v-row>
                <v-col>
                  <p> Criado por </p>
                </v-col>
              </v-row>
                <v-row>
                <v-col>
                  <p> nome: {{ chamado.usuario }} </p>
                  <p> email: {{ chamado.email_usuario }} </p>
                  <p> setor: {{ chamado.setor_usuario }} </p>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="2">
              <v-row>
                <v-col>
                  <p> Categoria </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-chip class="ma-2" color="primary" label> {{chamado.descricao_categoria}} </v-chip>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="4">
              <v-row v-if="chamado.anexos.length > 0">
                <v-col>
                  <p> Anexos </p>
                </v-col>
              </v-row>
              <v-row v-if="chamado.anexos.length > 0">
                <v-btn v-for="(anexo, index) in chamado.anexos" :key="index" icon @click="downloadAttachment(anexo)" style="margin-right: 2%;">
                  <v-icon>mdi-file</v-icon>
                </v-btn>
              </v-row>
            </v-col>

            <v-col class="d-flex justify-end" cols="2">
              <v-row>
                <v-col class="d-flex justify-end" v-if="!chamado.responsavel && grant()">
                  <v-chip v-if="grant()" class="ma-0" color="red" @click="negarChamado(chamado.id)" style="margin-right: 3% !important;">Negar</v-chip>
                  <v-chip v-if="grant()" class="ma-0" color="green" @click="atribuirChamado(chamado.id)">Atribuir</v-chip>
                </v-col>
                <v-col v-if="chamado.responsavel && grant()">
                  <v-select
                    :items="mudarStatusChamado"
                    label="Status"
                    density="compact"
                    variant="solo"
                    v-model="novoStatus"
                    @update:modelValue="atualizarStatus(chamado.id)"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>

          </v-row>
          <br>
          <v-row no-gutters>
            <v-col cols="3">
              <v-row>
                <v-col>
                  <p> Técnico responsável </p>
                </v-col>
                <v-col>
                  <p> {{ chamado.responsavel }} </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="9">
              <Chat :chamado_id="chamado.id"/>
            </v-col>
          </v-row> -->
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useAuth } from '@/stores/auth';
import http from '@/services/http.js';
const auth = useAuth();
const bearer = `Bearer ${auth.token}`;
import Chat from './Chat.vue';

export default {
  name: "ListChamados",
  components: {
    Chat
  },
  props: {
    loadChamados: Function // Defina a propriedade `loadChamados` como uma função
  },
  data() {
    return {
      chamados: ref([]),
      search: ref(''),
      loading: ref(false),
      page: ref(1),
      limit: 20,
      mudarStatusChamado: ['Em andamento','Pendente','Aguardando Feedback'],
    };
  },
  computed: {
    // Filtrar chamados com base na pesquisa
    filteredChamados() {
      return this.chamados.filter(chamado =>
        chamado.titulo.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    async atualizarStatus(id) {
      try {
        const response = await http.put(`/atualizaStatus/${id}`, {
          status: this.novoStatus
        }, {
          headers: {
            Authorization: bearer
          }
        });
        // Verificar se a requisição foi bem-sucedida
        if (response.data.error) {
          console.error('Erro ao atualizar status:', response.data.error);
          return;
        }
        // Se a atualização foi bem-sucedida, recarregar os chamados
        await this.carregarChamados();
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
      }
    },

    async atribuirChamado(id) {
    try {
      await http.put(`/atribuirChamado/${id}`, {}, {
        headers: {
          Authorization: bearer
        }
      });
      await this.carregarChamados();
    } catch (error) {
      console.error('Erro ao atribuir chamado:', error);
    }
  },

  async negarChamado(id) {
    const motivo = prompt("Digite o motivo da negação:");
    if (motivo !== null) {
      try {
        await http.put(`/rejeitaChamado/${id}`, { motivo }, {
          headers: {
            Authorization: bearer
          }
        });
        await this.carregarChamados();
      } catch (error) {
        console.error('Erro ao negar chamado:', error);
      }
    }
  },
    grant() {
      const arrayGrants = ['admin', 'supervisor', 'analista', 'tecnico'];
      return arrayGrants.includes(auth.permission);
    },
    // Função para carregar os chamados utilizando a função recebida como prop
    async carregarChamados() {
      if (this.loading) return; // Evitar múltiplas chamadas enquanto carrega
      this.loading = true;
      try {
        // Redefinir o array de chamados para vazio
        this.chamados = [];

        // Fazer a requisição para carregar os chamados
        const novosChamados = await this.loadChamados();

        // Atualizar o array de chamados com os novos chamados retornados pela API
        this.chamados = novosChamados;

      } catch (error) {
        console.error('Erro ao carregar chamados:', error);
      } finally {
        this.loading = false; // Resetar o estado de loading
      }
    },
    getChipColor(status){
      const statusColors = {
        Aberto: 'blue',
        'Em andamento': 'yellow',
        Pendente: 'orange',
        Fechado: 'green',
        Rejeitado: 'red',
        'Aguardando Feedback': 'light-blue'
      }
      return statusColors[status] || 'primary'; // Se o status não estiver mapeado, use a cor padrão 'primary'
    },
    handleScroll(){
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollPosition >= documentHeight && !loading.value) {
        page.value++;
        loadChamados(); // Chama a função de carregamento
      }
    },
    downloadAttachment(attachmentUrl){
      const link = document.createElement('a');
      link.href = attachmentUrl;
      link.target = '_blank';
      link.download = attachmentUrl.substring(attachmentUrl.lastIndexOf('/') + 1);
      link.click();
    }
  },
  // Lifecycle hook para carregar os chamados inicialmente
  async mounted() {
    await this.carregarChamados();
  }
};
</script>
  
<style scoped>
.panel-spacing {
  margin-bottom: 20px; /* ou qualquer valor que você preferir */
}

.icon-container {
  width: 100%;
  overflow-x: auto; /* Adiciona rolagem horizontal se os ícones ultrapassarem o limite */
  white-space: nowrap; /* Impede que os ícones quebrem para uma nova linha */
}

.search{
  margin-top: 3%;
  margin-bottom: 1%;
  width: 100%;
}

.categorias_e_chamados {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.categorias {
  margin-bottom: 3% !important; /* Espaço entre as categorias e a lista de chamados */
}

.datas_chamado{
  font-size: 13px;
}

.panel-title-open {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Adicione o estilo do box shadow conforme necessário */
}

.bold-text {
  font-weight: bold;
}

.user-info {
  max-width: 100%;
}
</style>
  