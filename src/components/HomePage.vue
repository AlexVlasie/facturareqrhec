<template>
  <div class="home">
    <button @click="printPage" class="buton-print" style="background-color: green; color: white; padding: 10px;">PRINTEAZA</button>
    <div class="factura">
      <div class="factura-item">
        <h3>Furnizor: SC Hoiura Electro Construct SRL</h3>
        <p>Nr. R.C./AUT: J40/2380/2004</p>
        <p>CIF: RO 16149867</p>
        <p>CAPITAL SOCIAL: 200 lei</p>
        <p>SEDIUL: Bucuresti, sector 3, str. Ghita Serban, nr 55, ap 36</p>
        <div class="conturi">
          <p>Cont: RO21TREZ703507024X020783</p>
          <p>Banca: TREZ SECT 3</p>
          <p>Cont: RO36BRDE441SV21904434410</p>
          <p>Banca: BRD HURMUZACHI</p>
        </div>
      </div>
      <div class="factura-item factura-item-centru">
        <img class="logo-hec" src="../assets/favicon512.jpg" />
        <div class="informatii-factura">
          <h2>Seria HEC Nr.: <input class="inline-input" style="margin-bottom: 5px;" placeholder="serie si nr facutra" /></h2>
          <h3>Data: <input class="inline-input" style="margin-bottom: 5px;" placeholder="ex. 18 iul. 2023" /></h3>
        </div>
        <h3 class="center-text" style="padding-top: 10px;">Data Scadenta: <input class="inline-input" /></h3>
        <br />
        <h4>Cota TVA 9%</h4>
        <div class="cod-qr-final">
          <img v-if="generatedQrCode" :src="generatedQrCode" alt="Cod QR" />
          <p v-else><strong>QR-UL GENERAT ESTE AFISAT AICI..</strong></p>
        </div>
      </div>
      <div class="factura-item factura-item-client">
        <h3 class="client-scurt">Cumparator: <input style="width: 60%;" /></h3>
        <hr class="client-scurt" style="width: 85%;" />
        <p class="client-scurt">Nr. R.C./an: <input style="width: 60%;" /></p>
        <p class="client-scurt">C.I.F. / CNP <input style="width: 60%;" /></p>
        <p class="client-scurt">Adresa / Sediul: <textarea style="width: 60%; height: 15px; resize: vertical;"></textarea></p>
        <hr />
        <p class="client-scurt"> Contul: <input style="width: 60%;" /> </p>
        <p class="client-scurt"><strong>Banca:</strong> <input style="width: 60%;" /></p>
        <hr style="width: 85%; margin-top: 20px; margin-bottom: 20px;" />
        <h4 class="client-scurt">Contract <input style="width: 60%;" /></h4>
        <h4 class="client-scurt">Data Contract: <input style="width: 40%;" /></h4>
        <button style="margin-top: 20px;" class="buton-qr" @click="openQrModal">Genereaza QR</button>
      </div>
    </div>
    <div class="linii-factura" style="font-size: 18px;">
      <div class="linii-factura-item nr-crt">Nr. crt.</div>
      <div class="linii-factura-item denumire" style="font-size: 17px;"><strong>Denumirea produselor sau a serviciilor</strong></div>
      <div class="linii-factura-item unitate">U.M.</div>
      <div class="linii-factura-item">Cantitatea</div>
      <div class="linii-factura-item">Pret Unitar(fara TVA) LEI</div>
      <div class="linii-factura-item">Valoarea LEI</div>
      <div class="linii-factura-item">Valoarea TVA</div>
      <!-- Linii de produse -->
      <div v-for="(product, index) in products" :key="index" class="linii-factura-row">
        <div class="linii-factura-item nr-crt">{{ index + 1 }}</div>
        <div class="linii-factura-item denumire">
          <input class="denumire" v-model="product.name" type="text" />
        </div>
        <div class="linii-factura-item unitate">
          <input class="centered-input" v-model="product.unit" type="text" placeholder="Buc." />
        </div>
        <div class="linii-factura-item">
          <input class="centered-input" v-model.number="product.quantity" type="number" @input="updateValues(product)" />
        </div>
        <div class="linii-factura-item">
          <input class="centered-input" v-model.number="product.unitPrice" type="number" @input="updateValues(product)" />
        </div>
        <div class="linii-factura-item">{{ product.value.toFixed(2) }}</div>
        <div class="linii-factura-item">{{ product.tva.toFixed(2) }}</div>
      </div>
      <button class="add-product" @click="addProduct">Adaugă linie produs</button>
      <button class="remove-product" @click="removeProduct">Sterge ultima linie adaugata</button>
    </div>
    <div class="text-obligatoriu">
      <p>
        Suma de 20000.00 lei, se suporta de catre Autoritate (Administratia Fondului de Mediu), prin programul privind instalarea sistemelor de panouri fotovoltaice pentru producerea de energie electrica, in vederea acoperirii necesarului de consum si livrarii surplusului in reteaua nationala.
      </p>
    </div>
    <div class="date-totale">
      <div class="date-totale-item printable" style="height: 440px;" >
        <p>Semnatura si stampila furnizorului</p>
        <div style="padding-top: 130px;">
          <p>Radoi Narcisa</p>
          <p>2760706035019</p>
          <p>RZ 287888</p>
        </div>
      </div>
      <div class="date-totale-item expeditie printable" style="height: 440px;">
        <p>Date privind expeditia:</p>
        <p>Numele delegatului: RADOI IUSTIN</p>
        <p>CNP: 1750101384185</p>
        <p>B.I./C.I. seria /nr. RK 019855</p>
        <p>Mijlocul de transport AUTO nr. </p>
        <p style="margin-left: 75px;"><strong>B 123 HEC</strong></p>
        <p>Expedierea s-a efectuat in prezenta noastra</p>
        <p>la data de ................... ora ..............</p>
        <p>Semnaturile .........................</p>
      </div>
      <div class="date-totale-item semnatura-total printable" style="height: 440px;">
        <div class="total-din-care-accize">
          <p>Total,</p>
          <p>din care accize</p>
        </div>
        <hr />
        <div class="semnatura-primire">
          <p style="margin-bottom: 120px;">Semnatura de primire</p>
        </div>
      </div>
      <div class="date-totale-item toto printable" style="height: 440px;">
        
        <div class="valoare-lei-total">Total valoare fără TVA: {{ totalValoareFaraTVA.toFixed(2) }} LEI</div>
        <hr />
        <div class="valoare-lei-tva">Total TVA: {{ totalTVA.toFixed(2) }} LEI</div>
        <hr />
        <div class="total-de-plata">Total de plată: {{ totalDePlata.toFixed(2) }} LEI</div>
      </div>
    </div>

    <!-- Modal QR -->
    <div v-if="showQrModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeQrModal">&times;</span>
        <h2>Generator Cod QR</h2>
        <div id="fields">
          <textarea v-for="(field, index) in fields" :key="index" class="input-field" :placeholder="field.placeholder" v-model="field.value"></textarea>
        </div>
        <button class="add-field" @click="addField" style="background-color: orange; margin: 4px; color: white;">Adaugă camp</button>
        <button id="generate-btn" @click="generateQRCode" style="background-color: blue; margin: 4px; color: white;">Generează Cod QR</button>
        <div id="qr-code" v-html="qrCode"></div>
        <button id="save-btn" @click="saveQRCode" style="background-color: green; margin: 4px; color: white;">Salvează Cod QR</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      products: [
        { name: 'Lorem Ipsum', unit: '', quantity: 10, unitPrice: 50.00, value: 0, tva: 0 },
        { name: 'Dolor Sit Amet', unit: '', quantity: 5, unitPrice: 100.00, value: 0, tva: 0 },
      ],
      showQrModal: false,
      qrInput: '',
      qrCode: '',
      generatedQrCode: '',
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
    };
  },
  computed: {
    totalValoareFaraTVA() {
      return this.products.reduce((acc, product) => acc + product.value, 0);
    },
    totalTVA() {
      return this.products.reduce((acc, product) => acc + product.tva, 0);
    },
    totalDePlata() {
      return this.totalValoareFaraTVA + this.totalTVA;
    }
  },
  methods: {
    openQrModal() {
      this.showQrModal = true;
    },
    closeQrModal() {
      this.showQrModal = false;
      this.qrInput = '';
      this.qrCode = '';
    },
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
      if (qrImage) {
        this.generatedQrCode = qrImage.src;
        this.closeQrModal();
      } else {
        this.qrCode = '<p>Nu există cod QR generat.</p>';
      }
    },
    updateValues(product) {
      product.value = product.quantity * product.unitPrice;
      product.tva = product.value * 0.09; // 9% TVA
    },
    addProduct() {
      this.products.push({ name: '', unit: '', quantity: 0, unitPrice: 0, value: 0, tva: 0 });
    },

    removeProduct() {
      this.products.pop({ name: '', unit: '', quantity: 0, unitPrice: 0, value: 0, tva: 0 });
    },

    printPage() {
      window.print();
    }
  },
  mounted() {
    this.products.forEach(this.updateValues);
  }
};
</script>

<style scoped>
.home {
  display: grid;
  margin-bottom: 50px;
  grid-template-rows: auto auto auto auto;
}

.factura {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}

.factura-item {
  border: 1px solid #ccc;
  padding: 10px;
}

.linii-factura {
  display: grid;
  grid-template-columns: 50px repeat(6, 1fr);
  grid-auto-rows: minmax(40px, auto);
  gap: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}

.linii-factura-item {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.linii-factura-row {
  display: contents;
}

.add-product {
  grid-column: span 7;
  padding: 10px;
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.remove-product {
  grid-column: span 7;
  padding: 10px;
  background-color: #F9A628;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.text-obligatoriu {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid #ccc;
  padding: 5px;
}

.date-totale {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap: 10px;
  border: 1px solid #ccc;
}

.date-totale-item {
  border: 1px solid #ccc;
  padding: 10px;
}

.factura-item-centru {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-hec {
  width: 100px;
  display: flex;
  flex-direction: row;
  align-content: center;
  padding-bottom: 5px;
}

.informatii-factura {
  margin-top: 0px;
}

.factura-item-client {
  display: grid;
  grid-template-columns: 2;
}

.buton-qr {
  padding: 10px 20px;
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.conturi {
  margin-top: 30%;
}

.nr-crt {
  width: 50px;
}

.center-text {
  text-align: center;
}

/* Modal CSS */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.input-field {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

.valoare-lei-total {
  margin-top: 22px;
  width: 400px;
}

.date-totale-item {
  height: 330px;
}

.denumire {
  width: 630px;
}

.client-scurt {
  margin-bottom: 2px;
}

.inline-input {
  display: inline-block;
  width: auto;
}

.centered-input {
  text-align: center;
}

@media print {
  .home {
    grid-template-rows: auto auto auto auto;
    font-size: 16px; /* Mărește dimensiunea fontului */
  }

  .buton-print {
    display: none;
  }

  .remove-product {
    display: none;
  }

  .expeditie {
    font-size: 15px;
  }

  .printable {
    height: 440px;
  }

  .client-scurt {
    font-size: 18px;
  }

  .client-scurt,
  .client-scurt input,
  .client-scurt textarea,
  .client-scurt p,
  .client-scurt h3,
  .client-scurt h4 {
    font-size: 18px;
  }

  .factura, .linii-factura, .date-totale, .text-obligatoriu {
    page-break-inside: avoid;
    border: 1px solid #000;
    padding: 10px;
    margin-bottom: 20px;
  }

  .factura-item, .linii-factura-item, .date-totale-item {
    border: 1px solid #000; /* Adaugă borduri pentru aspect de tabel */
    padding: 5px;
    margin: 0;
  }

  .factura-item {
    font-size: 14px; /* Mărește dimensiunea fontului */
  }

  .linii-factura-item {
    font-size: 14px; /* Mărește dimensiunea fontului */
    padding: 5px;
  }

  .add-product, .buton-qr {
    display: none; /* Ascunde butoanele care nu sunt necesare la print */
  }

  input {
    border: none; /* Ascunde bordurile input-urilor */
    font-size: 14px; /* Mărește dimensiunea fontului */
    width: 100%; /* Ajustează lățimea input-urilor */
  }

  textarea {
    border: none;
  }

  h2, h3, h4, p {
    margin: 0;
  }

  .text-obligatoriu {
    font-size: 12px; /* Ajustează dimensiunea fontului */
  }

  .valoare-lei-total, .valoare-lei-tva, .total-de-plata {
    font-size: 14px; /* Mărește dimensiunea fontului */
  }

  .date-totale-item {
    font-size: 12px; /* Ajustează dimensiunea fontului */
  }

  /* Ajustează stilurile pentru tabelul de produse */
  .linii-factura {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }

  .linii-factura-item {
    display: table-cell;
    border: 1px solid #000;
    padding: 5px;
    text-align: center; /* Centrează textul în tabel */
  }

  .linii-factura-row {
    display: table-row;
  }

  /* Ajustează stilurile pentru zona de semnături */
  .date-totale {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }

  .date-totale-item {
    display: table-cell;
    border: 1px solid #000;
    padding: 5px;
  }

  /* Stiluri specifice pentru expeditie și toto */
  .date-totale-item.expeditie {
    width: 40%; /* Mărește lățimea pentru clasa expeditie */
  }

  .date-totale-item.toto {
    width: 15%; /* Reduce lățimea pentru clasa toto */
  }
}

p {
  font-size: 20px;
}

.valoare-lei-total {
  font-size: 20px;
  margin-top: 3px;
}

.valoare-lei-tva {
  font-size: 20px;
}

.total-de-plata {
  font-size: 25px;
  font-weight: bolder;
}
</style>
