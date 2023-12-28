// Definición de la lista de administradores
var adminList = [
    'cnMYh3ZGtqdoPp4pFXx4QLbwh0d2',
    'LRMqsgqizLa2rGcI054Oi18ryl83'
];

// Función para verificar si el usuario actual es un administrador
var checkIfUserAdmin = (valorCookieId) => {
    console.log(valorCookieId)
    console.log(adminList)
    return adminList.includes(valorCookieId);
};

// Exportar ambas funciones para que estén disponibles para otros módulos
export { checkIfUserAdmin };