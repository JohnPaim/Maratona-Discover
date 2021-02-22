 const Modal = {
     open (){
                    //abrir modal
                    //adicionar a calss active ao modal
                 document
                    .querySelector('.modal-overlay')
                    .classList
                    .add('active')
     },
     close(){
                    //fechar o modal
                    //remover a class active do modal
                 document
                    .querySelector('.modal-overlay')
                    .classList
                    .remove('active')
     }
 }
 
 const Storage = {
     get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
        []
     },
     set (transactions) {
         localStorage.setItem("dev.finances:transactions", JSON.stringify
         (transactions))

     }

 }


 const Transaction = {
     all: Storage.get(),


     add(transaction){
        Transaction.all.push (transaction)

        App.reload()
     },

     remove(index){
        Transaction.all.splice(index, 1)

        App.reload()

     },
     incomes() {
         let income = 0
         Transaction.all.forEach(transaction => {
            if(transaction.type == "r" ) {
                income += transaction.amount;
            }

         })
            return income;
     },
     expenses() {
        let expense = 0
        Transaction.all.forEach(transaction => {
           if(transaction.type == "d" ) {
               expense += transaction.amount;
           }

        })
           return expense;
     },
     total() {
            return Transaction.incomes() - Transaction.expenses();
     }
 }

 const DOM = {
     transactionsContainer: document.querySelector('#data-table tbody'),
    
     addTransaction (transaction, index ) {
         const tr = document.createElement('tr')
         tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
         tr.dataset.index = index

         DOM.transactionsContainer.appendChild(tr)

         
     },
     
     innerHTMLTransaction(transaction, index) {  
         const CSSclass = transaction.type == "r" ? "income" : "expense"  

         const amount = Utils.formatCurrency(transaction.amount)

         const type = transaction.type == "r" ? "Receita" : "Despeza"

        const html = `
          <td class="description">${transaction.description}</td>
          <td class="${CSSclass}">${amount}</td>
          <td class="date">${transaction.date}</td>
          <td class="description">${type}</td>
          <td>
         <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover 
         transação">
         </td>       
        `

        return html
     },

     updateBalance() {
         document
         .getElementById('incomeDisplay')
         .innerHTML =  Utils.formatCurrency(Transaction.incomes())
         document
         .getElementById('expenseDisplay')
         .innerHTML = Utils.formatCurrency(Transaction.expenses())
         document
         .getElementById('totalDisplay')
         .innerHTML = Utils.formatCurrency(Transaction.total())
     },

     clearTransactions() {
         DOM.transactionsContainer.innerHTML = ""
     }
 }

 const Utils = {
     formatAmount(value){
        value = Number(value) *100
        
        return value

     },

     formatDate (date){
         const splittedDate = date.split ("-")
        return ` ${splittedDate[2]} / ${splittedDate [1]} / ${splittedDate[0]}`
     },

     formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
     }
 }

 const Form = {
     description: document.querySelector('input#description'),
     amount: document.querySelector('input#amount'),
     date: document.querySelector  ('input#date'),

     getValues() {
         return {
             description: Form.description.value,
             amount:Form.amount.value,
             date:Form.date.value,
             type: getType()
             
         }
     },
     
     validateFields(){
        const { description, amount, date } = Form.getValues()
        if(description.trim( ) === "" ||
            amount.trim() === "" ||
            date.trim() === "" ) {
                throw new Error("Por Favor, preencha todos os campos")
            }

        if(isNaN(amount)){
            throw new Error("Valor inválido ")
        }
        if(amount <= 0){
            throw new Error("O valor deve ser maior do que zero")
        }

        let data = date.replaceAll("-" , "")
        data = parseInt(data)
        if(isNaN(data)){
            throw new Error("Data inválida")
        }
        
            
     },

     formatValues(){
         let { description, amount, date, type } = Form.getValues()

         amount = Utils.formatAmount (amount)

         date = Utils.formatDate (date)
         
         return{
             description,
             amount,
             date,
             type
         }
     },

     saveTransaction(transaction){
            Transaction.add (transaction)

        },

        clearFields(){
            Form.description.value = ""
            Form.amount.value = ""
            Form.date.value = ""
        },

     submit(event) {
         event.preventDefault()

         try {
             Form.validateFields()
             const transaction = Form.formatValues()
             console.log(transaction)
             Form.saveTransaction (transaction)
             Form.clearFields()
             Modal.close()

         } catch (error) {
             alert (error.message)
         }

     }
 }


const App = {
     init() {
            let transactions = Transaction.all.sort(compare)
            transactions.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
       
        DOM.updateBalance()      
       

     },
     reload() {
         DOM.clearTransactions()
        App.init()
     },
 }
 
 App.init()

 function getType(){
 return document.querySelector('input[name="operacao"]:checked').value
 }

 function compare( a, b ) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }
 
 
 
          