/**
 * @jest-environment jsdom
 */
import {screen, waitFor, fireEvent } from "@testing-library/dom"
import '@testing-library/jest-dom'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockedBills from "../__mocks__/store"
import {ROUTES,  ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js"
import Store from "../app/Store.js"
import BillsUI from '../views/BillsUI.js'
import store from '../__mocks__/store'

const onNavigate = ((pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
})
// beforeEach(() => {
//   const html = NewBillUI()
//   document.body.innerHTML = html
// })
describe("I add a file in the input for adding a new bill ", () => {
  test("the fill I added should be detected", () =>{
    // Ici, une nouvelle instance de la classe NewBill est créée avec des propriétés telles que document, onNavigate, store, et localStorage.
    const newBillForTest = new NewBill({ document, onNavigate, store: Store, localStorage: window.localStorage })
    // Un espion (spy) est créé pour surveiller les appels à la fonction handleChangeFile de l’instance newBillForTest.
    const handleChangeFile = jest.fn(newBillForTest.handleChangeFile)
    //  L’élément DOM avec l’attribut data-testid égal à 'file' est récupéré.
    const  testFile = screen.getByTestId('file')
    // Un écouteur d’événement est ajouté à l’élément DOM pour détecter les changements.
        expect(newBillForTest).toBeDefined()
        expect(handleChangeFile).toBeDefined()
        expect(testFile).toBeDefined()
    // Un événement de changement est simulé sur l’élément DOM, avec un fichier factice nommé “test.png”.
    testFile.addEventListener("change", handleChangeFile)
    fireEvent.change(testFile, {
        target: {
            files: [new File(["test.png"], "test.png", { type: "image" })],
            }
        })
    //  change function listener should be called 
    //  Cette assertion vérifie que la fonction handleChangeFile a été appelée exactement une fois.
    //  En résumé, ce test vérifie si le changement de fichier déclenche correctement la fonction handleChangeFile.
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
  })
  test("I try to submit a bill with the wrong format", () =>{
    const testnewBill = new NewBill({ document, onNavigate, store: Store, localStorage: window.localStorage })
    const handleChangeFile = jest.fn(testnewBill.handleChangeFile)
    const myFile = screen.getByTestId('file')
    myFile.addEventListener("change", handleChangeFile)
    fireEvent.change(myFile, {
        target: {
            files: [new File(["wrong-img.txt"], "wrong-img.txt", { type: "text/txt" })],
        }
    })
    expect(handleChangeFile).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('error-format')).toBeTruthy()
  })
})
describe("When I've completed well the formular and I clicked on submit", () => {
  test("Then a new bill is created", () =>{
    const testnewBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage })
    const validBill = {
      type: "Transports",
      name: "Bus",
      amount: "15",
      date: "2022-03-02",
      vat: "10",
      pct: "10",
      commentary: "This is a valid bill",
      fileUrl: "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
      fileName: "valid-image.jpg"
    }
    const handleSubmit = jest.fn((e) => testnewBill.handleSubmit(e))
    testnewBill.createBill = (testnewBill) => testnewBill
    screen.getByTestId('expense-type').value = validBill.type
    screen.getByTestId('expense-name').value = validBill.name
    screen.getByTestId('amount').value = validBill.amount
    screen.getByTestId('datepicker').value = validBill.date
    screen.getByTestId('vat').value = validBill.vat
    screen.getByTestId('pct').value = validBill.pct
    screen.getByTestId('commentary').value = validBill.commentary
    testnewBill.fileUrl = validBill.fileUrl
    testnewBill.fileName = validBill.fileName
    const submitForm = screen.getByTestId('form-new-bill')
    submitForm.addEventListener('click', handleSubmit)
    fireEvent.click(submitForm)
    expect(handleSubmit).toBeCalledTimes(1)
  })
})

describe ('Given I cliked in Nouvelle note de frais', () => {
  describe("When I am on NewBill Page", () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.NewBill)

    // test("then i verified that the phrase is present" , () => {
    // const phrase = screen.getByText('Envoyer une note de frais')
    //   expect(phrase).toBeInTheDocument();
    // })
    // test("then i verified that the prase is present" , () => {
    //   const phrase1 = screen.getByText('Type de dépense')
    //   const phrase2 = screen.getByText('Nom de la dépense')
    //   const phrase3 = screen.getByText('Date')
    //   const phrase4 = screen.getByText('Montant TTC')
    //   const phrase5 = screen.getByText('TVA')
    //   const phrase6 = screen.getByText('Commentaire')
    //   const phrase7 = screen.getByText('Justificatif')
    //   expect(phrase1).toBeInTheDocument();
    //   expect(phrase2).toBeInTheDocument();
    //   expect(phrase3).toBeInTheDocument();
    //   expect(phrase4).toBeInTheDocument();
    //   expect(phrase5).toBeInTheDocument();
    //   expect(phrase6).toBeInTheDocument();
    //   expect(phrase7).toBeInTheDocument();
    //   });
    // test('Then i verified that the icon mail is colored', async ()=>{
    //   await waitFor(() => screen.getByTestId('icon-mail'))
    //   const windowMail = screen.getByTestId('icon-mail')
    //   expect(windowMail).toBeTruthy()
    //   expect(windowMail.getAttribute("class")).toContain("active-icon");
    //   })
    test("then i verified that the good url is present" , () => {
      const locationEnd = document.location.hash 
      expect(locationEnd).toEqual("#employee/bill/new")
      })
    // test("it Should display a form", () => {
    //   expect(screen.getByTestId('form-new-bill')).toBeTruthy()
    //   })
    // test("the form contains 9 inputs", () => {
    //   expect(screen.getByTestId('form-new-bill').length).toEqual(9)
    //   })
 })
})

//  integration test for newBill-POST 
//  La méthode spyOn nous permet d’espionner les appels de méthodes et de vérifier s’ils ont été exécutés1.

describe("Given I am user connected as Employee", () => {
  describe("When I navigate to New-Bill", () => {
    it("Should send the new-bill to the back-end", async () => {
      const validBill = {
        type: "Transports",
        name: "Bus",
        amount: "15",
        date: "2022-03-02",
        vat: "10",
        pct: "10",
        commentary: "I want valid a newBill",
        fileUrl: "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3",
        fileName: "photo-ident-erick"
      }
       const postSpy = jest.spyOn(mockedBills, "bills")
       const bills = await mockedBills.bills().update(validBill)
       expect(postSpy).toHaveBeenCalledTimes(1)
       expect(bills.id).toBe('47qAXb6fIm2zOKkLzMro')
    })
    test("send data and simulate an 404 error ", async () => {
      mockedBills.bills.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("create a new bill an API and fails with 500 message error", async () => {
      mockedBills.bills.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})


