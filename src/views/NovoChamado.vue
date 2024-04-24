<template>
    <div class="content">
      <div id="container-form">
        <p class="titulos">Envie uma nova solicitação de TI</p>
        <form>
          <div class="form-group">
            <label for="titulo">Título do chamado:</label>
            <input type="text" id="titulo" placeholder="Descreva o assunto do chamado">
          </div>
          <div class="form-group">
            <label for="categoria">Categoria:</label>
            <select id="categoria">
              <option disabled selected>Escolha uma categoria</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.descricao }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="descricao">Descrição:</label>
            <textarea id="descricao" placeholder="Detalhe seu problema"></textarea>
          </div>
          <div class="form-group file-input" @dragover.prevent @drop="handleFileDrop">
            <label for="anexo" class="file-label">Anexar arquivo:</label>
            <div class="file-container" @click="openFilePicker" @dragover.prevent @dragenter.prevent>
              <span class="file-description">Clique para escolher os arquivos ou arraste-os aqui</span>
              <input type="file" id="anexo" name="anexo" style="display: none" ref="fileInput" @change="handleFileChange" multiple>
            </div>
            <ul class="file-list">
              <li v-for="(file, index) in selectedFiles" :key="index">
                <span>{{ file.name }}</span>
                <span class="file-remove" @click="removeFile(index)">
                  <svg class="icon-trash" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 24 24">
                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                  </svg>
                </span>
              </li>
            </ul>
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import http from '@/services/http.js'
  
  export default {
    data() {
      return {
        selectedFiles: [],
        categorias: []
      };
    },
    mounted() {
      this.fetchCategorias();
    },
    methods: {
      openFilePicker() {
        this.$refs.fileInput.click();
      },
      handleFileChange(event) {
        const files = event.target.files;
        this.selectedFiles = Array.from(files);
      },
      handleFileDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        this.selectedFiles = Array.from(files);
      },
      removeFile(index) {
        this.selectedFiles.splice(index, 1);
      },
      fetchCategorias() {
        http.get('/categorias')
          .then(response => {
            this.categorias = response.data.result;
          })
          .catch(error => {
            console.error('Erro ao buscar categorias:', error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  #container-form {
    width: 34%;
    padding: 20px;
    border-radius: 8px;
    background-color: #f5f5f5;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .titulos {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  select,
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  textarea {
    height: 120px;
    resize: none;
  }
  
  .file-input {
    position: relative;
  }
  
  .file-container {
    width: 100%;
    padding: 10px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.3s ease;
    height: 120px;
  }
  
  .file-container:hover {
    border-color: #007bff;
  }
  
  .file-description {
    text-align: center;
    color: #777;
  }
  
  .file-list {
    margin-top: 10px;
    padding-left: 0;
    list-style: none;
  }
  
  .file-list li {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .file-remove {
    cursor: pointer;
  }
  
  .icon-trash {
    fill: #777;
    transition: transform 0.3s ease;
  }
  
  .file-remove:hover .icon-trash {
    fill: #dc3545;
  }
  </style>
  