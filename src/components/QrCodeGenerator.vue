<template>
  <div class="container">
    <h1>Generator Cod QR</h1>
    <div id="fields">
      <input v-for="(field, index) in fields" :key="index" type="text" class="input-field" :placeholder="field.placeholder" v-model="field.value" />
    </div>
    <button class="add-field" @click="addField">Adaugă camp</button>
    <button id="generate-btn" @click="generateQRCode">Genereaza Cod QR</button>
    <div id="qr-code" v-html="qrCode"></div>
    <button id="save-btn" @click="saveQRCode">Salveaza Cod QR</button>
    <button @click="exportToPDF">Exportă PDF</button>
    <button @click="printInvoice">Printează</button>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js';

export default {
  data() {
    return {
      fields: [
        { placeholder: 'Tip solicitant: 1 pentru persoanele fizice, 2 pentru unitățile de cult', value: '' },
        { placeholder: 'Numar factura', value: '' },
        { placeholder: 'Data factura', value: '' },
        { placeholder: 'Judet', value: '' },
        { placeholder: 'Comuna/Oras', value: '' },
        { placeholder: 'Sector/Sat', value: '' },
        { placeholder: 'Nume strada', value: '' },
        { placeholder: 'Numar strada', value: '' },
        { placeholder: 'Nume prenume pentru persoanele fizice / Denumire unitate de cult', value: '' },
        { placeholder: 'CNP pentru persoanele fizice/CIF pentru unitățile de cult', value: '' },
        { placeholder: 'Putere instalata', value: '' },
        { placeholder: 'Serie de identificare invertor', value: '' },
        { placeholder: 'Indicator care marcheaza completarea seriilor panourilor', value: '' },
        { placeholder: 'Serie de identificare panou fotovoltaic 1', value: '' },
      ],
      qrCode: '',
    };
  },
  methods: {
    addField() {
      this.fields.push({ placeholder: 'Serie de identificare panou fotovoltaic N', value: '' });
    },
    generateQRCode() {
      let qrText = this.fields
        .map(field => field.value.trim())
        .filter(value => value !== '')
        .join('|');
      
      if (qrText) {
        this.qrCode = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${qrText}&size=200x200" alt="Cod QR">`;
      } else {
        this.qrCode = '<p>Introduceți cel puțin o valoare.</p>';
      }
    },
    saveQRCode() {
      const qrImage = this.$el.querySelector('#qr-code img');
      const numeValue = this.fields.find(field => field.placeholder.includes('Nume prenume')).value.trim();
      
      if (qrImage) {
        const imageUrl = qrImage.src;

        fetch(imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const imageUrlObject = window.URL.createObjectURL(blob);
            const fileName = `${numeValue}_QR.png`;
            
            const link = document.createElement('a');
            link.href = imageUrlObject;
            link.download = fileName;
            
            link.click();
            
            window.URL.revokeObjectURL(imageUrlObject);
          });
      } else {
        this.qrCode = '<p>Nu există cod QR generat.</p>';
      }
    },
    exportToPDF() {
      const element = this.$el.querySelector('.container');
      const opt = {
        margin: 1,
        filename: 'Factura.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save();
    },
    printInvoice() {
      window.print();
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}

.container {
  max-width: 430px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-field {
  width: 95%;
  margin-bottom: 10px;
  padding: 8px;
}

.add-field {
  display: block;
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#generate-btn {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#qr-code {
  margin-top: 20px;
}

#save-btn {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background-color: #F9A628;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
