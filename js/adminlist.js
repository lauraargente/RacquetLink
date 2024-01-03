// Definición de la lista de administradores
var adminList = [
    'cnMYh3ZGtqdoPp4pFXx4QLbwh0d2',
    'LRMqsgqizLa2rGcI054Oi18ryl83',
    'j1beIQscq1bW5J8naejelmLArij2',
    'tPl5uIgro3USajqSdFdTngAJZb92',
    'CUINM1nbVrbApC1pOb2bE1Xalur2',
    'W4mdwbHjhYbtwTwUNU3VG6Gkeu13'
];

// Función para verificar si el usuario actual es un administrador
var checkIfUserAdmin = (valorCookieId) => {
    console.log(valorCookieId)
    console.log(adminList)
    return adminList.includes(valorCookieId);
};

// Exportar ambas funciones para que estén disponibles para otros módulos
export { checkIfUserAdmin };