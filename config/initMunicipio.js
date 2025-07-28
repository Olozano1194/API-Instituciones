const Municipio = require('../models/municipioModel');


const getMunicipio = async () => {
    try {
        const response = await fetch('https://api-colombia.com/api/v1/City');

        if(!response.ok) throw new Error('Error en la respuesta');
        const municipios = await response.json();

        //Si ya están en la bd no se insertan
        // const existenMunicipios = await Municipio.find({});
        // if (existenMunicipios.length === 0) {
        //     await Municipio.insertMany(municipios);
        //     console.log('Municipios cargados con exito');            
        // }
        //await Municipio.deleteMany({});
        if (!await Municipio.countDocuments()) {
            const mappedMuns = municipios.map(muni => ({
                updateOne: {
                    filter: { id_municipio: String(muni.id) },
                    update: {
                        $set: {
                            descripcion: muni.name,
                            id_departamento: String(muni.departmentId)
                        }
                    },
                    upsert: true
                }               
            }));
            await Municipio.bulkWrite(mappedMuns);            
        }
        // console.log('Municipios cargados:', municipios.length);
    } catch (error) {
        console.error('Error al cargar municipios:', error);
    };
};

const CargarDatos = async (req, res) => {
    await getMunicipio();
};
CargarDatos

module.exports = getMunicipio;