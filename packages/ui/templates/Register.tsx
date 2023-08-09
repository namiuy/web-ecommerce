import { Box, Container, Heading, Button, Grid, GridItem } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useState, FC } from 'react';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundColorTwo = 'brand.login.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;

const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';

const states = [
  { id: '1', code: 'UYAR', name: 'Artigas' },
  { id: '2', code: 'UYCA', name: 'Canelones' },
  { id: '3', code: 'UYCL', name: 'Cerro Largo' },
  { id: '4', code: 'UYCO', name: 'Colonia' },
  { id: '5', code: 'UYDU', name: 'Durazno' },
  { id: '6', code: 'UYFS', name: 'Flores' },
  { id: '7', code: 'UYFD', name: 'Florida' },
  { id: '8', code: 'UYLA', name: 'Lavalleja' },
  { id: '9', code: 'UYMA', name: 'Maldonado' },
  { id: '10', code: 'UYMO', name: 'Montevideo' },
  { id: '11', code: 'UYPA', name: 'Paysandú' },
  { id: '12', code: 'UYRN', name: 'Río Negro' },
  { id: '13', code: 'UYRV', name: 'Rivera' },
  { id: '14', code: 'UYRO', name: 'Rocha' },
  { id: '15', code: 'UYSA', name: 'Salto' },
  { id: '16', code: 'UYSJ', name: 'San José' },
  { id: '17', code: 'UYSO', name: 'Soriano' },
  { id: '18', code: 'UYTA', name: 'Tacuarembó' },
  { id: '19', code: 'UYTT', name: 'Treinta y Tres' },
];

const cities = [
  { id: '1', name: 'Artigas', stateId: '1', stateName: 'Artigas' },
  {
    id: '2',
    name: 'Baltasar Brum',
    stateId: '1',
    stateName: 'Artigas',
  },
  { id: '3', name: 'Bella Unión', stateId: '1', stateName: 'Artigas' },
  {
    id: '4',
    name: 'Bernavé Rivera',
    stateId: '1',
    stateName: 'Artigas',
  },
  { id: '5', name: 'Sequeira', stateId: '1', stateName: 'Artigas' },
  {
    id: '6',
    name: 'Tomás Gomensoro',
    stateId: '1',
    stateName: 'Artigas',
  },
  { id: '7', name: 'Canelones', stateId: '2', stateName: 'Canelones' },
  {
    id: '8',
    name: 'Aguas Corrientes',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '9', name: 'Atlántida', stateId: '2', stateName: 'Canelones' },
  {
    id: '10',
    name: 'Barros blancos',
    stateId: '2',
    stateName: 'Canelones',
  },
  {
    id: '11',
    name: 'Costa de Oro',
    stateId: '2',
    stateName: 'Canelones',
  },
  {
    id: '12',
    name: 'Empalme Olmos',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '13', name: 'Juanicó', stateId: '2', stateName: 'Canelones' },
  {
    id: '14',
    name: 'La Floresta',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '15', name: 'La Paz', stateId: '2', stateName: 'Canelones' },
  {
    id: '16',
    name: 'Las Piedras',
    stateId: '2',
    stateName: 'Canelones',
  },
  {
    id: '17',
    name: 'Los Cerrillos',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '18', name: 'Migues', stateId: '2', stateName: 'Canelones' },
  { id: '19', name: 'Montes', stateId: '2', stateName: 'Canelones' },
  { id: '20', name: 'Pando', stateId: '2', stateName: 'Canelones' },
  {
    id: '21',
    name: 'Parque del Plata',
    stateId: '2',
    stateName: 'Canelones',
  },
  {
    id: '22',
    name: 'Paso Carrasco',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '23', name: 'Progreso', stateId: '2', stateName: 'Canelones' },
  { id: '24', name: 'Salinas', stateId: '2', stateName: 'Canelones' },
  {
    id: '25',
    name: 'San Antonio',
    stateId: '2',
    stateName: 'Canelones',
  },
  {
    id: '26',
    name: 'San Bautista',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '27', name: 'Melo', stateId: '3', stateName: 'Cerro Largo' },
  { id: '28', name: 'Aceguá', stateId: '3', stateName: 'Cerro Largo' },
  {
    id: '29',
    name: 'Fraile Muerto',
    stateId: '3',
    stateName: 'Cerro Largo',
  },
  {
    id: '30',
    name: 'Isidoro Noblia',
    stateId: '3',
    stateName: 'Cerro Largo',
  },
  {
    id: '31',
    name: 'Rio Branco',
    stateId: '3',
    stateName: 'Cerro Largo',
  },
  {
    id: '32',
    name: 'Tupambaé',
    stateId: '3',
    stateName: 'Cerro Largo',
  },
  {
    id: '33',
    name: 'Colonia del Sacramento',
    stateId: '4',
    stateName: 'Colonia',
  },
  { id: '34', name: 'Barker', stateId: '4', stateName: 'Colonia' },
  { id: '35', name: 'Carmelo', stateId: '4', stateName: 'Colonia' },
  {
    id: '36',
    name: 'Colonia Valdense',
    stateId: '4',
    stateName: 'Colonia',
  },
  { id: '37', name: 'Conchillas', stateId: '4', stateName: 'Colonia' },
  {
    id: '38',
    name: 'Florencio Sánchez',
    stateId: '4',
    stateName: 'Colonia',
  },
  {
    id: '39',
    name: 'Ismael Cortinas',
    stateId: '4',
    stateName: 'Colonia',
  },
  { id: '40', name: 'Juan Lacaze', stateId: '4', stateName: 'Colonia' },
  { id: '41', name: 'Miguelete', stateId: '4', stateName: 'Colonia' },
  {
    id: '42',
    name: 'Nueva Helvecia',
    stateId: '4',
    stateName: 'Colonia',
  },
  {
    id: '43',
    name: 'Nueva Palmira',
    stateId: '4',
    stateName: 'Colonia',
  },
  {
    id: '44',
    name: 'Ombúes de Lavalle',
    stateId: '4',
    stateName: 'Colonia',
  },
  { id: '45', name: 'Rosario', stateId: '4', stateName: 'Colonia' },
  { id: '46', name: 'Tarariras', stateId: '4', stateName: 'Colonia' },
  { id: '47', name: 'Durazno', stateId: '5', stateName: 'Durazno' },
  { id: '48', name: 'Blanquillo', stateId: '5', stateName: 'Durazno' },
  {
    id: '49',
    name: 'Carlos Reyles',
    stateId: '5',
    stateName: 'Durazno',
  },
  { id: '50', name: 'Carmen', stateId: '5', stateName: 'Durazno' },
  { id: '51', name: 'Centenario', stateId: '5', stateName: 'Durazno' },
  { id: '52', name: 'Cerro Chato', stateId: '5', stateName: 'Durazno' },
  { id: '53', name: 'La Paloma', stateId: '5', stateName: 'Durazno' },
  {
    id: '54',
    name: 'Sarandí del Yi',
    stateId: '5',
    stateName: 'Durazno',
  },
  { id: '55', name: 'Trinidad', stateId: '6', stateName: 'Flores' },
  {
    id: '56',
    name: 'Ismael Cortinas',
    stateId: '6',
    stateName: 'Flores',
  },
  { id: '57', name: 'Florida', stateId: '7', stateName: 'Florida' },
  {
    id: '58',
    name: '25 De Agosto',
    stateId: '7',
    stateName: 'Florida',
  },
  { id: '59', name: '25 De Mayo', stateId: '7', stateName: 'Florida' },
  {
    id: '60',
    name: 'Alejandro Gallinal',
    stateId: '7',
    stateName: 'Florida',
  },
  {
    id: '61',
    name: 'Capilla del Sauce',
    stateId: '7',
    stateName: 'Florida',
  },
  { id: '62', name: 'Cardal', stateId: '7', stateName: 'Florida' },
  { id: '63', name: 'Casupá', stateId: '7', stateName: 'Florida' },
  { id: '64', name: 'Cerro Chato', stateId: '7', stateName: 'Florida' },
  { id: '65', name: 'Chamizo', stateId: '7', stateName: 'Florida' },
  { id: '66', name: 'Fray Marcos', stateId: '7', stateName: 'Florida' },
  { id: '67', name: 'La Cruz', stateId: '7', stateName: 'Florida' },
  { id: '68', name: 'Mendoza', stateId: '7', stateName: 'Florida' },
  {
    id: '69',
    name: 'Mendoza Chico',
    stateId: '7',
    stateName: 'Florida',
  },
  { id: '70', name: 'Nico Pérez', stateId: '7', stateName: 'Florida' },
  {
    id: '71',
    name: 'Sarandí Grande',
    stateId: '7',
    stateName: 'Florida',
  },
  { id: '72', name: 'Valentines', stateId: '7', stateName: 'Florida' },
  { id: '73', name: 'Minas', stateId: '8', stateName: 'Lavalleja' },
  {
    id: '74',
    name: 'J. Batlle y Ordoñez',
    stateId: '8',
    stateName: 'Lavalleja',
  },
  {
    id: '75',
    name: 'José Pedro Varela',
    stateId: '8',
    stateName: 'Lavalleja',
  },
  { id: '76', name: 'Mariscala', stateId: '8', stateName: 'Lavalleja' },
  { id: '77', name: 'Pirarajá', stateId: '8', stateName: 'Lavalleja' },
  {
    id: '78',
    name: 'Solís de Mataojo',
    stateId: '8',
    stateName: 'Lavalleja',
  },
  { id: '79', name: 'Zapicán', stateId: '8', stateName: 'Lavalleja' },
  { id: '80', name: 'Maldonado', stateId: '9', stateName: 'Maldonado' },
  { id: '81', name: 'Aiguá', stateId: '9', stateName: 'Maldonado' },
  {
    id: '82',
    name: 'Gregorio Aznarez',
    stateId: '9',
    stateName: 'Maldonado',
  },
  {
    id: '83',
    name: 'Pan de Azúcar',
    stateId: '9',
    stateName: 'Maldonado',
  },
  {
    id: '84',
    name: 'Piriápolis',
    stateId: '9',
    stateName: 'Maldonado',
  },
  {
    id: '85',
    name: 'Punta del Este',
    stateId: '9',
    stateName: 'Maldonado',
  },
  {
    id: '86',
    name: 'San Carlos',
    stateId: '9',
    stateName: 'Maldonado',
  },
  {
    id: '87',
    name: 'Ciudad Vieja',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '88', name: 'Aguada', stateId: '10', stateName: 'Montevideo' },
  {
    id: '89',
    name: 'Aires Puros',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '90',
    name: 'Atahualpa',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '91',
    name: 'Bañados de Carrasco',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '92',
    name: 'Barrio Sur',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '93',
    name: 'Belvedere',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '94',
    name: 'Brazo Oriental',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '95', name: 'Buceo', stateId: '10', stateName: 'Montevideo' },
  {
    id: '96',
    name: 'Capurro - Bella Vista, Arroyo Seco',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '97',
    name: 'Carrasco',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '98',
    name: 'Carrasco Norte',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '99',
    name: 'Casabó - Pajas Blancas',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '100',
    name: 'Casavalle',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '101',
    name: 'Castro - Pérez Castellanos',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '102', name: 'Centro', stateId: '10', stateName: 'Montevideo' },
  {
    id: '103',
    name: 'Cerrito de la Victoria',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '104',
    name: 'Colón Centro y Noroeste',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '105',
    name: 'Colón Sudeste - Abayubá',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '106',
    name: 'Conciliación',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '107', name: 'Cordón', stateId: '10', stateName: 'Montevideo' },
  {
    id: '108',
    name: 'Flor de Maroñas',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '109',
    name: 'Ituzaingó',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '110',
    name: 'Jacinto Vera',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '111',
    name: 'Jardines del Hipódromo',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '112',
    name: 'La Blanqueada',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '113',
    name: 'La Comercial',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '114',
    name: 'La Figurita',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '115',
    name: 'La Paloma - Tomkinson',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '116',
    name: 'La Teja',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '117',
    name: 'Larrañaga',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '118',
    name: 'Las Acacias',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '119',
    name: 'Las Canteras',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '120',
    name: 'Lezica - Melilla',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '121', name: 'Malvín', stateId: '10', stateName: 'Montevideo' },
  {
    id: '122',
    name: 'Malvín Norte',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '123', name: 'Manga', stateId: '10', stateName: 'Montevideo' },
  {
    id: '124',
    name: 'Manga - Toledo Chico',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '125',
    name: 'Maroñas - Parque Guaraní',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '126',
    name: 'Mercado Modelo - Bolívar',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '127',
    name: 'Nuevo París',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '128',
    name: 'Palermo',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '129',
    name: 'Parque Batlle - Villa Dolores',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '130',
    name: 'Parque Rodó',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '131',
    name: 'Paso de la Arena – Santiago Vázquez',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '132',
    name: 'Paso de las Duranas',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '133',
    name: 'Peñarol - Lavalleja',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '134',
    name: 'Piedras Blancas',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '135',
    name: 'Pocitos',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '136', name: 'Prado', stateId: '10', stateName: 'Montevideo' },
  {
    id: '137',
    name: 'Punta Carretas',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '138',
    name: 'Punta de Rieles - Bella Italia',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '139',
    name: 'Punta Gorda',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '140',
    name: 'Reducto',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '141', name: 'Sayago', stateId: '10', stateName: 'Montevideo' },
  {
    id: '142',
    name: 'Tres Cruces',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '143',
    name: 'Tres Ombúes - Pueblo Victoria',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '144', name: 'Unión', stateId: '10', stateName: 'Montevideo' },
  {
    id: '145',
    name: 'Villa del Cerro',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '146',
    name: 'Villa Española',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '147',
    name: 'Villa García - Manga Rural',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '148',
    name: 'Villa Muñoz - Retiro, Goes',
    stateId: '10',
    stateName: 'Montevideo',
  },
  {
    id: '149',
    name: 'Santiago Vázquez',
    stateId: '10',
    stateName: 'Montevideo',
  },
  { id: '150', name: 'Paysandú', stateId: '11', stateName: 'Paysandú' },
  { id: '151', name: 'Algorta', stateId: '11', stateName: 'Paysandú' },
  { id: '152', name: 'Chapicuy', stateId: '11', stateName: 'Paysandú' },
  { id: '153', name: 'Guichón', stateId: '11', stateName: 'Paysandú' },
  {
    id: '154',
    name: 'Lorenzo Geyres',
    stateId: '11',
    stateName: 'Paysandú',
  },
  { id: '155', name: 'Merinos', stateId: '11', stateName: 'Paysandú' },
  { id: '156', name: 'Porvenir', stateId: '11', stateName: 'Paysandú' },
  {
    id: '157',
    name: 'Quebracho',
    stateId: '11',
    stateName: 'Paysandú',
  },
  { id: '158', name: 'Tambores', stateId: '11', stateName: 'Paysandú' },
  {
    id: '159',
    name: 'Fray Bentos',
    stateId: '12',
    stateName: 'Río Negro',
  },
  { id: '160', name: 'Greco', stateId: '12', stateName: 'Río Negro' },
  {
    id: '161',
    name: 'Nuevo Berlín',
    stateId: '12',
    stateName: 'Río Negro',
  },
  {
    id: '162',
    name: 'San Javier',
    stateId: '12',
    stateName: 'Río Negro',
  },
  { id: '163', name: 'Young', stateId: '12', stateName: 'Río Negro' },
  { id: '164', name: 'Rivera', stateId: '13', stateName: 'Rivera' },
  {
    id: '165',
    name: 'Minas de Corrales',
    stateId: '13',
    stateName: 'Rivera',
  },
  { id: '166', name: 'Tranqueras', stateId: '13', stateName: 'Rivera' },
  { id: '167', name: 'Vichadero', stateId: '13', stateName: 'Rivera' },
  { id: '168', name: 'Rocha', stateId: '14', stateName: 'Rocha' },
  { id: '169', name: '18 de Julio', stateId: '14', stateName: 'Rocha' },
  { id: '170', name: 'Castillos', stateId: '14', stateName: 'Rocha' },
  { id: '171', name: 'Cebollatí', stateId: '14', stateName: 'Rocha' },
  { id: '172', name: 'Chuy', stateId: '14', stateName: 'Rocha' },
  {
    id: '173',
    name: 'La Aguada y Costa Azul',
    stateId: '14',
    stateName: 'Rocha',
  },
  {
    id: '174',
    name: 'La Coronilla',
    stateId: '14',
    stateName: 'Rocha',
  },
  { id: '175', name: 'La Paloma', stateId: '14', stateName: 'Rocha' },
  { id: '176', name: 'Lascano', stateId: '14', stateName: 'Rocha' },
  {
    id: '177',
    name: 'San Luis al Medio',
    stateId: '14',
    stateName: 'Rocha',
  },
  { id: '178', name: 'Velázquez', stateId: '14', stateName: 'Rocha' },
  { id: '179', name: 'Salto', stateId: '15', stateName: 'Salto' },
  { id: '180', name: 'Belén', stateId: '15', stateName: 'Salto' },
  {
    id: '181',
    name: 'Constitución',
    stateId: '15',
    stateName: 'Salto',
  },
  { id: '182', name: 'Lavalleja', stateId: '15', stateName: 'Salto' },
  { id: '183', name: 'San José', stateId: '16', stateName: 'San José' },
  {
    id: '184',
    name: 'Ciudad del Plata',
    stateId: '16',
    stateName: 'San José',
  },
  {
    id: '185',
    name: 'Ecilda Paullier',
    stateId: '16',
    stateName: 'San José',
  },
  {
    id: '186',
    name: 'Ismael Cortinas',
    stateId: '16',
    stateName: 'San José',
  },
  {
    id: '187',
    name: 'Ituzaingó',
    stateId: '16',
    stateName: 'San José',
  },
  { id: '188', name: 'Libertad', stateId: '16', stateName: 'San José' },
  {
    id: '189',
    name: 'Playa Pascual',
    stateId: '16',
    stateName: 'San José',
  },
  {
    id: '190',
    name: 'Puntas de Valdez',
    stateId: '16',
    stateName: 'San José',
  },
  {
    id: '191',
    name: 'Rafael Peraza',
    stateId: '16',
    stateName: 'San José',
  },
  {
    id: '192',
    name: 'Rodríguez',
    stateId: '16',
    stateName: 'San José',
  },
  { id: '193', name: 'Mercedes', stateId: '17', stateName: 'Soriano' },
  { id: '194', name: 'Cardona', stateId: '17', stateName: 'Soriano' },
  { id: '195', name: 'Dolores', stateId: '17', stateName: 'Soriano' },
  { id: '196', name: 'Egaña', stateId: '17', stateName: 'Soriano' },
  {
    id: '197',
    name: 'Jose E. Rodo',
    stateId: '17',
    stateName: 'Soriano',
  },
  { id: '198', name: 'Palmitas', stateId: '17', stateName: 'Soriano' },
  { id: '199', name: 'Risso', stateId: '17', stateName: 'Soriano' },
  {
    id: '200',
    name: 'Santa Catalina',
    stateId: '17',
    stateName: 'Soriano',
  },
  {
    id: '201',
    name: 'Villa Soriano',
    stateId: '17',
    stateName: 'Soriano',
  },
  {
    id: '202',
    name: 'Tacuarembó',
    stateId: '18',
    stateName: 'Tacuarembó',
  },
  { id: '203', name: 'Achar', stateId: '18', stateName: 'Tacuarembó' },
  { id: '204', name: 'Ansina', stateId: '18', stateName: 'Tacuarembó' },
  {
    id: '205',
    name: 'Curtina',
    stateId: '18',
    stateName: 'Tacuarembó',
  },
  {
    id: '206',
    name: 'Paso de los Toros',
    stateId: '18',
    stateName: 'Tacuarembó',
  },
  {
    id: '207',
    name: 'San Gregorio de Polanco',
    stateId: '18',
    stateName: 'Tacuarembó',
  },
  {
    id: '208',
    name: 'Treinta y Tres',
    stateId: '19',
    stateName: 'Treinta y Tres',
  },
  {
    id: '300',
    name: 'Gral. Enrique Martínez',
    stateId: '19',
    stateName: 'Treinta y Tres',
  },
  {
    id: '301',
    name: 'Rincón',
    stateId: '19',
    stateName: 'Treinta y Tres',
  },
  {
    id: '302',
    name: 'Santa Clara de Olimar',
    stateId: '19',
    stateName: 'Treinta y Tres',
  },
  {
    id: '303',
    name: 'Vergara',
    stateId: '19',
    stateName: 'Treinta y Tres',
  },
  {
    id: '309',
    name: 'Cerro Chato',
    stateId: '19',
    stateName: 'Treinta y Tres',
  },
  {
    id: '310',
    name: 'San Jacinto',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '311', name: 'San Luis', stateId: '2', stateName: 'Canelones' },
  {
    id: '312',
    name: 'San Ramón',
    stateId: '2',
    stateName: 'Canelones',
  },
  {
    id: '313',
    name: 'Santa Lucía',
    stateId: '2',
    stateName: 'Canelones',
  },
  {
    id: '314',
    name: 'Santa Rosa',
    stateId: '2',
    stateName: 'Canelones',
  },
  { id: '315', name: 'Sauce', stateId: '2', stateName: 'Canelones' },
  { id: '316', name: 'Soca', stateId: '2', stateName: 'Canelones' },
  { id: '317', name: 'Suárez', stateId: '2', stateName: 'Canelones' },
  { id: '318', name: 'Tala', stateId: '2', stateName: 'Canelones' },
  { id: '319', name: 'Toledo', stateId: '2', stateName: 'Canelones' },
];

const statesSelect = () => {
  return states.map(state => (
    <option key={state.id} value={state.id}>
      {state.name}
    </option>
  ));
};

const citiesSelect = (id: any) => {
  return cities.map(city =>
    city.stateId === id ? (
      <option key={city.id} value={city.id}>
        {city.name}
      </option>
    ) : null,
  );
};

type RegisterProps = {
  Logo: FC;
};

export const Register: FC<RegisterProps> = ({ Logo }) => {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateChange = (e: any) => {
    setSelectedState(e.target.value);
  };

  return (
    <Box height={'100vh'} bg={_backgroundColorTwo}>
      <Box bgGradient={_backgroundGradient} h={'40rem'}>
        <Box p={'1.5rem'} display={'flex'} justifyContent={{ base: 'center', lg: 'start' }}>
          <Logo />
        </Box>
        <Container
          maxW={'45rem'}
          color={'white'}
          mt={'5rem'}
          mb={'1rem'}
          px={0}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Link borderRadius={'50%'} p={'0.25rem'} _hover={_backButtonHover}>
            {' '}
            <ArrowBackIcon boxSize={'6'} />
          </Link>
          <Heading size={'lg'} display={'inline-block'}>
            Completa tus datos
          </Heading>
          <Box width={'2rem'}> &nbsp;</Box>
        </Container>
        <Container
          maxW={'45rem'}
          minH={'20rem'}
          bg={'white'}
          boxShadow={'lg'}
          borderRadius={'0.5rem'}
          p={'2rem 2rem 1rem 2rem'}
        >
          <Formik
            initialValues={{
              name: '',
              lastName: '',
              email: '',
              password: '',
              passwordConfirm: '',
              phone: '',
              address: '',
              department: '',
              location: '',
            }}
            onSubmit={values => {
              alert(JSON.stringify(values, null, 2));
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Grid
                  gridTemplateAreas={`"name lastName" "email email" "password passwordConfirm" "phone address" "department location" "submit submit"`}
                  gap={'1rem'}
                >
                  <GridItem gridArea={'name'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="name">Nombre</FormLabel>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'lastName'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="lastName">Apellido</FormLabel>
                      <Field
                        as={Input}
                        id="lastName"
                        name="lastName"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'email'}>
                    <FormControl>
                      <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'password'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'passwordConfirm'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="passwordConfirm">Confirme su contraseña</FormLabel>
                      <Field
                        as={Input}
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'phone'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="phone">Teléfono</FormLabel>
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        type="tel"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'address'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="address">Direccion</FormLabel>
                      <Field
                        as={Input}
                        id="address"
                        name="address"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'department'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="department">Departamento</FormLabel>
                      <Field
                        as={Select}
                        onChange={handleStateChange}
                        value={selectedState}
                        id="department"
                        name="department"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      >
                        <option value="-1">Seleccione un departamento...</option>
                        {statesSelect()}
                      </Field>
                    </FormControl>
                  </GridItem>
                  <GridItem gridArea={'location'}>
                    <FormControl width={'20rem'}>
                      <FormLabel htmlFor="location">Localidad</FormLabel>
                      <Field
                        as={Select}
                        id="location"
                        name="location"
                        type="text"
                        variant="filled"
                        _focus={{ borderColor: 'primary.main' }}
                      >
                        <option value="-1">Seleccione una localidad...</option>
                        {citiesSelect(selectedState)}
                      </Field>
                    </FormControl>
                  </GridItem>

                  <GridItem gridArea={'submit'} mt={'1rem'}>
                    <Button
                      type="submit"
                      bg={_loginButtonBg}
                      color={'white'}
                      width="100%"
                      _hover={{ backgroundColor: 'primary.main' }}
                      mb={'0.75rem'}
                    >
                      Registrarse
                    </Button>
                  </GridItem>
                </Grid>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Box>
  );
};
