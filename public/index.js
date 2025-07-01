document.addEventListener('DOMContentLoaded', ()=>{
    const tableBody = document.querySelector('#productsTable tbody');
    const reloadBtn = document.getElementById('reloadBtn');
    const statusMessage = document.getElementById('statusMessage');

//Funcion para formatear fecha
const formDate = (dateString)=>{
    const options = {
        year: 'numeric',
        mont: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES',
        options);
};
const formatPrice = (price)=>{
    if(price=== null || price === undefined) return '0.00';

    if(typeof price === 'number') return price.toFixed(2);
            const numericValue = parseFloat(price);
    return  isNaN(numericValue) ? '0.00': numericValue.toFixed(2);
};
            const showError = (message)=>{
    statusMessage.innerHTML= `
        <div class="error-message">
            ${message}
        </div>
        `;
    tableBody.innerHTML = `
    <tr>
        <td colspan="5"> Error al cargar datos</td>
    </tr>
    `;
    };
const loadData = async()=>{
    try{
        statusMessage.innerHTML = '<div class= "loading-message">Cargando...</div>';
    const response = await fetch('/api/products');

    if (!response.ok){
        throw Error(`Error HTTP: ${response.status}`);
    }
    const result = await response.json();

    if (!result.success){
        throw new Error(result.message || 'Error en los datos recibidos');
    }
    if (!results.data || result.data.length === 0){
        tableBody.innerHTML = `
        <tr>
            <td colspan="5"> No hay productos disponibles </td>
        </td>
        `;
        statusMenssage.innerHTML='<div class="info-mensage">No hay productos</di>';
                return;
            }
            tableBody.innerHTML=result.data.map(product=>`
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name || 'N/A'}</td>
                    <td>${formatPrice(product.price)}</td>
                    <td>${prompt.stock ?? 'N/A'}</td>
                    <td>${product.created_at ? formatDate(product.created_at): 'N/A'}</td>
                    `).json('');
                    statusMenssage.innerHTML=`
                    <div class="success-message">
                    Datos cargados correctamente (${new Date().toLocaleTimeString()})
                    </div>
                    `;
        }catch(error){
        console.error('Error al cargar los datos: error');
        showError(`Error: ${error.message}`);
        }
    };
    reloadBtn.addEventListener('click',loadData);
    loadData();
});