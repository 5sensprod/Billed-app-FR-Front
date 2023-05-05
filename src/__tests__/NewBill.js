/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("When I am on NewBill Page", () => {
  let newBillInstance;

  beforeEach(() => {
    // Setup
    const html = NewBillUI();
    document.body.innerHTML = html;
    const onNavigate = jest.fn();
    const storeMock = {
      bills: jest.fn().mockReturnValue({
        create: jest.fn(),
      }),
    };
    window.localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "test@employee.com" })
    );
    newBillInstance = new NewBill({
      document,
      onNavigate,
      store: storeMock,
      localStorage: window.localStorage,
    });
  });
  
  afterEach(() => {
    window.localStorage.clear();
  });
  describe("When I am on NewBill Page", () => {
    test("Then form elements should be rendered", () => {
      // Setup
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Assert
      const form = document.querySelector(`form[data-testid="form-new-bill"]`);
      const fileInput = document.querySelector(`input[data-testid="file"]`);
      const expenseTypeSelect = document.querySelector(`select[data-testid="expense-type"]`);
      const expenseNameInput = document.querySelector(`input[data-testid="expense-name"]`);
      const amountInput = document.querySelector(`input[data-testid="amount"]`);
      const datepickerInput = document.querySelector(`input[data-testid="datepicker"]`);
      const vatInput = document.querySelector(`input[data-testid="vat"]`);
      const pctInput = document.querySelector(`input[data-testid="pct"]`);
      const commentaryTextarea = document.querySelector(`textarea[data-testid="commentary"]`);

      expect(form).toBeTruthy();
      expect(fileInput).toBeTruthy();
      expect(expenseTypeSelect).toBeTruthy();
      expect(expenseNameInput).toBeTruthy();
      expect(amountInput).toBeTruthy();
      expect(datepickerInput).toBeTruthy();
      expect(vatInput).toBeTruthy();
      expect(pctInput).toBeTruthy();
      expect(commentaryTextarea).toBeTruthy();
    });
    describe("When I upload a file", () => {
      let newBillInstance;
      let createMock;
    
      beforeEach(() => {
        window.localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "test@employee.com" })
        );
        createMock = jest.fn().mockResolvedValue({ fileUrl: "https://example.com", key: "1234" });
        const storeMock = {
          bills: jest.fn().mockReturnValue({
            create: createMock,
          }),
        };
      
        newBillInstance = new NewBill({
          document,
          onNavigate: jest.fn(),
          store: storeMock,
          localStorage: window.localStorage,
        });
      });
    
      afterEach(() => {
        window.localStorage.clear(); // Ajoutez cette ligne
      });

      test("with valid extension, it should call create method", () => {
        const fileInput = document.querySelector(`input[data-testid="file"]`);
        const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
        const event = {
          target: {
            value: "C:\\fakepath\\test.jpg",
            files: [file],
          },
          preventDefault: jest.fn(),
        };
        newBillInstance.handleChangeFile(event);

        expect(createMock).toHaveBeenCalled();
      });

      test("with invalid extension, it should not call create method and clear the input value", () => {
        const fileInput = document.querySelector(`input[data-testid="file"]`);
        const file = new File(["content"], "test.txt", { type: "text/plain" });
        const event = {
          target: {
            value: "C:\\fakepath\\test.txt",
            files: [file],
          },
          preventDefault: jest.fn(),
        };
        newBillInstance.handleChangeFile(event);

        expect(createMock).not.toHaveBeenCalled();
        expect(fileInput.value).toBe("");
      });
    });
    describe("When I submit the form", () => {
      test("Then the updateBill method should be called", () => {
        // Setup
        const updateBillMock = jest.fn();
        newBillInstance.updateBill = updateBillMock;
        newBillInstance.fileUrl = "https://example.com"; // Add this line
        const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`);
        
        // Fill required fields
        const expenseTypeSelect = document.querySelector(`select[data-testid="expense-type"]`);
        const expenseNameInput = document.querySelector(`input[data-testid="expense-name"]`);
        const amountInput = document.querySelector(`input[data-testid="amount"]`);
        const datepickerInput = document.querySelector(`input[data-testid="datepicker"]`);
    
        expenseTypeSelect.value = "Restaurant";
        expenseNameInput.value = "Test expense";
        amountInput.value = "100";
        datepickerInput.value = "2023-05-05";
    
        // Act
        formNewBill.dispatchEvent(new Event("submit"));
    
        // Assert
        expect(updateBillMock).toHaveBeenCalled();
      });
    });
  
  });
});