const Municipio = require('../models/municipioModel');
const Departamento = require('../models/departamentoModel');
const logger = require('../config/logger');

const getMunicipio = async () => {
    try {
        const response = await fetch('https://api-colombia.com/api/v1/City');

        if (!response.ok) throw new Error('Error en la respuesta');
        const municipios = await response.json();

        if (await Municipio.countDocuments()) {
            return;
        }

        const departamentos = await Departamento.find({});
        const deptByCode = new Map(departamentos.map((d) => [d.id_departamento, d._id]));

        const mappedMuns = municipios
            .map((muni) => {
                const deptId = deptByCode.get(String(muni.departmentId));
                if (!deptId) return null;
                return {
                    updateOne: {
                        filter: { id_municipio: String(muni.id) },
                        update: {
                            $set: {
                                descripcion: muni.name,
                                id_departamento: deptId
                            }
                        },
                        upsert: true
                    }
                };
            })
            .filter(Boolean);

        if (mappedMuns.length) {
            await Municipio.bulkWrite(mappedMuns);
        }
    } catch (error) {
        logger.error(error, 'Error al cargar municipios');
    }
};

const CargarDatos = async (req, res) => {
    await getMunicipio();
};
CargarDatos;

module.exports = getMunicipio;
