'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()
}



const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

//CRUD

const deleteClient = (index) =>{
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
} 

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
    
}

const isValidFields = () => {
    return document.getElementById("form").reportValidity()
}

//Interação layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}
const saveClient = () => {
    if (isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value

        }
        const index = document.getElementById('nome').dataset.index
        if (index ==  'new'){
            createClient(client)
            updateTable()
            closeModal()
        } else{
            updateClient(index, client)
            updateTable()
            closeModal()
        }

        
       
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red id="delete-${index}"">Excluir</button>
        </td>
    
    `
    
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row) )
}
 const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
 }

 const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
 }

 const editclient = (index) =>{
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal() 
 }

 const editDelete = (event) => {
     if(event.target.type == 'button'){
        
        const [action, index] = event.target.id.split('-')

        if (action == 'edit'){
            editclient(index)
        } else {
            
            deleteClient(index)
            updateTable()
            
            
        }
     }
 }

 updateTable()
 
//Evento   
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('save')
    .addEventListener('click', saveClient)

document.getElementById('cancel')
    .addEventListener('click', closeModal)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)