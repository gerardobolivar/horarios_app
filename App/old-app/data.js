// Datos de prueba
const data = [
  {
    lunes: [
      { curso: "IF1300-Introducción", horaI: "1", horaF: "4", aula: "A01"},
      { curso: "Lógica de Programación", horaI: "8", horaF: "10", aula: "A01"},
    ],
    martes: null,
    miercoles: [{ curso: "IF1300-Introducción", horaI: "1", horaF: "4",aula: "A01" }],
    jueves: [{ curso: "Seminario I", horaI: "6", horaF: "7", aula: "A01" }],
    viernes: [{ curso: "Base de datos", horaI: "0", horaF: "1", aula: "A01" }],
    sabado: null,
  },
];
const data2 = [
  {
    lunes: null,
    martes: [
      { curso: "Programación II", horaI: "1", horaF: "4", aula: "A01" },
      { curso: "Inglés otras carreras", horaI: "8", horaF: "10", aula: "A01" },
    ],
    miercoles: null,
    jueves: null,
    viernes: null,
    sabado: [{ curso: "Base de datos", horaI: "0", horaF: "1", aula: "A01" }],
  },
];

const dataCells = {
  "cell11": [
    {
      cname: "Fundamentos de Bases de Datos",
      cgrupo: "01",
      caula: "A01"
    }
  ],
  "cell21": [
    {
      cname: "Fundamentos de Bases de Datos",
      cgrupo: "01",
      caula: "A01"
    } 
  ],
  "cell31": [
    {
      cname: "Fundamentos de Bases de Datos",
      cgrupo: "01",
      caula: "A01"
    }
  ],
  "cell41": [
    {
      cname: "Fundamentos de bases de datos",
      cgrupo: "01",
      caula: "A01"
    }
  ],
   "cell25": [
    {
      cname: "IF3000 Introducción a la computación...",
      cgrupo: "01",
      caula: "A01"
    }
  ],
  "cell35": [
    {
      cname: "IF3000 Introducción a la computación...",
      cgrupo: "01",
      caula: "A01"
    } 
  ],
  "cell45": [
    {
      cname: "IF3000 Introducción a la computación...",
      cgrupo: "01",
      caula: "A01"
    }
  ],
  "cell55": [
    {
      cname: "IF3000 Introducción a la computación...",
      cgrupo: "01",
      caula: "A01"
    }
  ],
}

const dataCellsI = {
  "cell11": [
    {
      cname: "Sistemas Operativos",
      cgrupo: "01",
      caula: "A01"
    },
    
  ],
  "cell21": [
    {
      cname: "Sistemas operativos",
      cgrupo: "01",
      caula: "A01"
    },
  ],
  "cell31": [
    {
      cname: "Sistemas operativos",
      cgrupo: "01",
      caula: "A01"
    }
  ],
  "cell41": [
    {
      cname: "Sistemas Operativos",
      cgrupo: "01",
      caula: "A01"
    }
  ],
  "cell62": [
    {
      cname: "Seminario",
      cgrupo: "01",
      caula: "A01"
    },
  ],
  "cell72": [
    {
      cname: "Seminario",
      cgrupo: "01",
      caula: "A01"
    },
  ],

}


export default dataCells;
export { data, data2, dataCells, dataCellsI };